import type {APIRoute} from 'astro';import {productSchema,sameOrigin,json} from '../../../../lib/validation';
export const POST:APIRoute=async({request,params,locals})=>{
if(!sameOrigin(request))return json({error:'Origem inválida.'},403);
if(!locals.user)return json({error:'Acesso negado.'},401);
try{const raw=await request.text();if(raw.length>100000)return json({error:'Dados muito longos.'},413);const parsed=productSchema.safeParse(JSON.parse(raw));if(!parsed.success)return json({error:parsed.error.issues.map(i=>i.path.join('.')+': '+i.message).join(' ')},400);
if(!parsed.data.categoria_id)return json({error:'Selecione uma categoria.'},400);
const db=locals.supabase!;const {data,error}=params.id==='novo'?await db.from('products').insert(parsed.data).select('id').single():await db.from('products').update(parsed.data).eq('id',params.id!).select('id').single();
if(error)return json({error:error.code==='23505'?'Já existe um produto com esse slug ou código.':'Não foi possível salvar. Confira os dados e tente novamente.'},400);
return json({id:data.id},params.id==='novo'?201:200);
}catch{return json({error:'Dados inválidos.'},400);}
};
export const DELETE:APIRoute=async({request,params,locals})=>{
if(!sameOrigin(request))return json({error:'Origem inválida.'},403);if(!locals.user)return json({error:'Acesso negado.'},401);
const {data,error}=await locals.supabase!.from('products').delete().eq('id',params.id!).select('id').maybeSingle();return error?json({error:'Não foi possível excluir o produto.'},400):data?json({success:true}):json({error:'Produto não encontrado.'},404);
};

