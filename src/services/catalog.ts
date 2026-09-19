import { publicDb } from '../lib/supabase';
import { demoMode } from '../config/site';
import * as demo from '../data/demo';
import type { Product, Category, Brand, Post } from '../types/catalog';
export async function getCategories(): Promise<Category[]> {
const db=publicDb(); if(!db) return demoMode?demo.categories:[];
const {data,error}=await db.from('categories').select('*').eq('ativo',true).order('ordem');
if(error) throw new Error('Não foi possível carregar as categorias.'); return data || [];
}
export async function getBrands(): Promise<Brand[]> {
const db=publicDb(); if(!db) return [];
const {data,error}=await db.from('brands').select('*').eq('ativo',true).order('nome');
if(error) throw new Error('Não foi possível carregar as marcas.'); return data || [];
}
export async function getProducts(params: URLSearchParams = new URLSearchParams(), featured=false) {
const search=(params.get('busca') || '').trim().slice(0,100);
const category=params.get('categoria') || ''; const brand=params.get('marca') || '';
const sort=params.get('ordem') || 'relevancia';
const page=Math.max(1,Math.min(10000,Number(params.get('pagina')) || 1)); const limit=featured?4:9;
const db=publicDb();
if(!db) {
let rows=demoMode?[...demo.products]:[];
if(featured) rows=rows.filter(p=>p.destaque);
if(search) rows=rows.filter(p=>(p.nome+' '+p.descricao_curta+' '+p.codigo).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().includes(search.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()));
if(category) rows=rows.filter(p=>p.categories?.slug===category);
if(brand) rows=rows.filter(p=>p.marca_id===brand);
if(sort==='nome') rows.sort((a,b)=>a.nome.localeCompare(b.nome,'pt-BR'));
if(sort==='recentes') rows.sort((a,b)=>b.created_at.localeCompare(a.created_at));
return {products:rows.slice((page-1)*limit,page*limit),total:rows.length,page,limit,demo:demoMode};
}
let query=db.from('products').select('*,categories!inner(*),brands(*)',{count:'exact'}).eq('ativo',true).eq('categories.ativo',true);
if(featured) query=query.eq('destaque',true);
if(search) query=query.ilike('nome','%'+search.replace(/[%_\\]/g,'')+'%');
if(category) query=query.eq('categories.slug',category);
if(brand) query=query.eq('marca_id',brand);
query=sort==='nome'?query.order('nome'):sort==='recentes'?query.order('created_at',{ascending:false}):query.order('ordem');
const {data,count,error}=await query.order('id').range((page-1)*limit,page*limit-1);
if(error) throw new Error('Não foi possível carregar o catálogo. Tente novamente em instantes.');
return {products:(data || []) as Product[],total:count || 0,page,limit,demo:false};
}
export async function getProduct(slug:string):Promise<Product|null> {
const db=publicDb(); if(!db) return demoMode?demo.products.find(p=>p.slug===slug)||null:null;
const {data,error}=await db.from('products').select('*,categories!inner(*),brands(*),product_images(url,ordem)').eq('slug',slug).eq('ativo',true).eq('categories.ativo',true).maybeSingle();
if(error) throw new Error('Não foi possível carregar este produto.');
if(!data) return null;
const images=(data.product_images || []).sort((a:{ordem:number},b:{ordem:number})=>a.ordem-b.ordem).map((i:{url:string})=>i.url);
return {...data,galeria:images.length?images:data.galeria} as Product;
}
export async function getPosts():Promise<Post[]> {
const db=publicDb(); if(!db) return demoMode?demo.posts:[];
const {data,error}=await db.from('posts').select('*,post_categories(*)').eq('publicado',true).lte('published_at',new Date().toISOString()).order('published_at',{ascending:false});
if(error) throw new Error('Não foi possível carregar os artigos.'); return data || [];
}

