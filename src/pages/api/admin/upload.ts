import type {APIRoute} from 'astro';import {sameOrigin,json} from '../../../lib/validation';
export const POST:APIRoute=async({request,locals})=>{
if(!sameOrigin(request))return json({error:'Origem inválida.'},403);if(!locals.user)return json({error:'Acesso negado.'},401);
if(Number(request.headers.get('content-length')||0)>5300000)return json({error:'Imagem maior que 5 MB.'},413);
try{const body=await request.arrayBuffer();if(body.byteLength>5300000)return json({error:'Imagem maior que 5 MB.'},413);const form=await new Request(request.url,{method:'POST',headers:request.headers,body}).formData();const file=form.get('file');if(!file||typeof file==='string'||file.size>5*1024*1024)return json({error:'Selecione uma imagem de até 5 MB.'},400);
const bytes=new Uint8Array(await file.arrayBuffer());let ext='';if(bytes[0]===0xff&&bytes[1]===0xd8&&bytes[2]===0xff)ext='jpg';else if(bytes[0]===0x89&&bytes[1]===0x50&&bytes[2]===0x4e&&bytes[3]===0x47)ext='png';else if(new TextDecoder().decode(bytes.slice(0,4))==='RIFF'&&new TextDecoder().decode(bytes.slice(8,12))==='WEBP')ext='webp';if(!ext)return json({error:'Formato inválido. Use JPEG, PNG ou WebP.'},400);
const path=locals.user.id+'/'+crypto.randomUUID()+'.'+ext;const {error}=await locals.supabase!.storage.from('catalog').upload(path,bytes,{contentType:ext==='jpg'?'image/jpeg':'image/'+ext,upsert:false});if(error)return json({error:'Falha no upload. Confira o bucket e as permissões.'},400);
return json({url:locals.supabase!.storage.from('catalog').getPublicUrl(path).data.publicUrl},201);
}catch{return json({error:'Não foi possível enviar a imagem.'},400);}
};

