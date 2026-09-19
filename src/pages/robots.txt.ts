import type {APIRoute} from 'astro';import {site,demoMode} from '../config/site';
export const GET:APIRoute=({url})=>new Response(demoMode?'User-agent: *\nDisallow: /\n':`User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\nSitemap: ${site.domain||url.origin}/sitemap.xml\n`,{headers:{'Content-Type':'text/plain; charset=utf-8'}});

