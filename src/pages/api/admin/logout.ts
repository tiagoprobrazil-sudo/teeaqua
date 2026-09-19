import type {APIRoute} from 'astro';import {sameOrigin,json} from '../../../lib/validation';
export const POST:APIRoute=async({request,locals,redirect})=>{if(!sameOrigin(request))return json({error:'Origem inválida.'},403);await locals.supabase?.auth.signOut();return redirect('/admin/login',303);};

