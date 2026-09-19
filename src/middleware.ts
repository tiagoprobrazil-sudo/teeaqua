import { defineMiddleware } from 'astro:middleware';
import { sessionDb } from './lib/supabase';
export const onRequest=defineMiddleware(async(context,next)=>{
const protectedRoute=context.url.pathname.startsWith('/admin') || context.url.pathname.startsWith('/api/admin');
context.locals.supabase=null; context.locals.user=null;
if(protectedRoute) {
const db=sessionDb(context.cookies,context.url.protocol==='https:',context.request.headers.get('cookie')||''); context.locals.supabase=db;
if(db) { const {data:{user}}=await db.auth.getUser(); context.locals.user=user?.app_metadata?.role==='admin'?user:null; }
if(context.url.pathname!=='/admin/login' && !context.locals.user) {
return context.url.pathname.startsWith('/api/') ? Response.json({error:'Acesso não autorizado.'},{status:401}) : context.redirect('/admin/login');
}
}
const response=await next();
response.headers.set('X-Content-Type-Options','nosniff');
response.headers.set('Referrer-Policy','strict-origin-when-cross-origin');
response.headers.set('Permissions-Policy','camera=(), microphone=(), geolocation=()');
response.headers.set('X-Frame-Options','DENY');
if(protectedRoute || context.url.pathname.startsWith('/api/')) {
response.headers.set('Cache-Control','no-store');
response.headers.set('X-Robots-Tag','noindex, nofollow');
}
return response;
});
