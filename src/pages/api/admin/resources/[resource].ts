import type {APIRoute} from 'astro';import {z} from 'zod';import {adminResources,type Resource} from '../../../../config/admin';import {sameOrigin,json,imageUrl} from '../../../../lib/validation';
const common={nome:z.string().trim().min(2).max(180),slug:z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(180),ativo:z.boolean()};
const schemas={
categorias:z.object({...common,descricao:z.string().max(2000),imagem:imageUrl,ordem:z.number().int().min(0).max(100000)}),
marcas:z.object({...common,logo:imageUrl.nullable()}),
artigos:z.object({titulo:z.string().trim().min(2).max(200),slug:common.slug,resumo:z.string().max(2000),conteudo:z.string().max(50000),imagem:imageUrl,categoria_id:z.uuid().nullable(),publicado:z.boolean(),published_at:z.iso.datetime().nullable()}).refine(d=>!d.publicado||Boolean(d.published_at),'Defina uma data para publicar.')
};
export const POST:APIRoute=async({request,params,locals})=>{
if(!sameOrigin(request))return json({error:'Origem inválida.'},403);if(!locals.user)return json({error:'Acesso negado.'},401);
const resource=params.resource as Resource;if(!Object.hasOwn(adminResources,resource))return json({error:'Recurso inválido.'},404);
try{const raw=await request.text();if(raw.length>65000)return json({error:'Dados muito longos.'},413);const body=JSON.parse(raw);const id=body.id;const data={...body,ativo:body.ativo==='on',publicado:body.publicado==='on',ordem:Number(body.ordem||0),categoria_id:body.categoria_id||null,logo:body.logo||null,published_at:body.published_at?new Date(body.published_at+'Z').toISOString():null};const parsed=schemas[resource].safeParse(data);if(!parsed.success)return json({error:parsed.error.issues.map(i=>i.path.join('.')+': '+i.message).join(' ')},400);
const table=adminResources[resource].table;const payload=parsed.data as never;const query=id?locals.supabase!.from(table).update(payload).eq('id',id):locals.supabase!.from(table).insert(payload);const {error}=await query.select('id').single();return error?json({error:error.code==='23505'?'Este slug já existe.':'Não foi possível salvar o registro.'},400):json({success:true});
}catch{return json({error:'Verifique os dados informados.'},400);}
};
export const DELETE:APIRoute=async({request,params,locals,url})=>{
if(!sameOrigin(request))return json({error:'Origem inválida.'},403);if(!locals.user)return json({error:'Acesso negado.'},401);const resource=params.resource as Resource;if(!Object.hasOwn(adminResources,resource))return json({error:'Recurso inválido.'},404);
const id=url.searchParams.get('id');if(!id||!z.uuid().safeParse(id).success)return json({error:'Registro inválido.'},400);
const {data,error}=await locals.supabase!.from(adminResources[resource].table).delete().eq('id',id).select('id').maybeSingle();return error?json({error:'Não foi possível excluir. Verifique se há produtos ou artigos vinculados.'},409):data?json({success:true}):json({error:'Registro não encontrado.'},404);
};

