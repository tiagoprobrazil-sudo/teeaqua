import type { APIRoute } from 'astro';import {env} from 'cloudflare:workers';import {serviceDb} from '../../lib/supabase';import {contactSchema,sameOrigin,json} from '../../lib/validation';
export const POST:APIRoute=async({request})=>{
if(!sameOrigin(request))return json({error:'Origem inválida.'},403);
if(Number(request.headers.get('content-length')||0)>20000)return json({error:'Mensagem muito longa.'},413);
const db=serviceDb();if(!db||!env.TURNSTILE_SECRET_KEY||!env.TURNSTILE_HOSTNAMES)return json({error:'O atendimento online ainda não está disponível.'},503);
try{
const raw=await request.text();if(raw.length>20000)return json({error:'Mensagem muito longa.'},413);
const parsedRequest=new Request(request.url,{method:'POST',headers:request.headers,body:raw});const form=await parsedRequest.formData();
if(form.get('website'))return json({error:'Não foi possível validar a solicitação.'},400);
const started=Number(form.get('started_at'));if(!Number.isFinite(started)||Date.now()-started<2500||Date.now()-started>86400000)return json({error:'Recarregue a página e tente novamente.'},400);
const parsed=contactSchema.safeParse(Object.fromEntries(form));if(!parsed.success)return json({error:parsed.error.issues[0].message},400);
const token=String(form.get('cf-turnstile-response')||'');if(!token||token.length>2048)return json({error:'Conclua a verificação de segurança.'},400);
const verification=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({secret:env.TURNSTILE_SECRET_KEY,response:token,remoteip:request.headers.get('CF-Connecting-IP')||undefined}),signal:AbortSignal.timeout(8000)});
if(!verification.ok)return json({error:'A verificação está indisponível. Tente novamente.'},503);
const result=await verification.json() as {success:boolean;hostname?:string;action?:string};
const hosts=env.TURNSTILE_HOSTNAMES.split(',').map(h=>h.trim());
if(!result.success||result.action!=='contact'||!result.hostname||!hosts.includes(result.hostname))return json({error:'Verificação expirada ou inválida. Tente novamente.'},400);
const {consentimento,...data}=parsed.data;
const {error}=await db.from('contacts').insert({...data,consentimento:consentimento==='on',consent_version:'2026-09-19'});
if(error)return json({error:'Não foi possível registrar sua mensagem. Tente novamente em instantes.'},503);
return json({success:true},201);
}catch{return json({error:'Não foi possível enviar sua mensagem. Tente novamente.'},400);}
};

