import type {APIRoute} from 'astro';import {site,demoMode} from '../config/site';import {publicDb} from '../lib/supabase';
const escape=(s:string)=>s.replace(/[<>&"']/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&apos;'}[c]!));
export const GET:APIRoute=async({url})=>{
const paths=['/','/empresa','/produtos','/marcas','/solucoes','/dicas','/contato','/privacidade'];const db=publicDb();
if(db){const [{data:products,error:pe},{data:posts,error:ae}]=await Promise.all([db.from('products').select('slug,categories!inner(ativo)').eq('ativo',true).eq('categories.ativo',true),db.from('posts').select('slug').eq('publicado',true).lte('published_at',new Date().toISOString())]);if(pe||ae)return new Response('Sitemap temporariamente indisponível',{status:503});products?.forEach(p=>paths.push('/produto/'+p.slug));posts?.forEach(p=>paths.push('/dicas/'+p.slug));}
const body=`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${(demoMode?[]:paths).map(path=>'<url><loc>'+escape(new URL(path,site.domain||url.origin).href)+'</loc></url>').join('')}</urlset>`;
return new Response(body,{headers:{'Content-Type':'application/xml; charset=utf-8','Cache-Control':'public, max-age=300'}});
};

