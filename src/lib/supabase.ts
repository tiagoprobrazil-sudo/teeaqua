import { createClient } from '@supabase/supabase-js';
import { createServerClient, parseCookieHeader } from '@supabase/ssr';
import { env } from 'cloudflare:workers';
import type { AstroCookies } from 'astro';
export const configured = () => Boolean(env.SUPABASE_URL && env.SUPABASE_ANON_KEY);
export function publicDb() {
  return configured() ? createClient(env.SUPABASE_URL!, env.SUPABASE_ANON_KEY!, { auth: { persistSession: false, autoRefreshToken: false } }) : null;
}
export function sessionDb(cookies: AstroCookies, secure: boolean, cookieHeader: string) {
  return configured() ? createServerClient(env.SUPABASE_URL!, env.SUPABASE_ANON_KEY!, {
    cookieOptions: { httpOnly: true, secure, sameSite: 'lax', path: '/' },
    cookies: { getAll: () => parseCookieHeader(cookieHeader).map(c => ({ name: c.name, value: c.value || '' })), setAll: values => values.forEach(({ name, value, options }) => cookies.set(name, value, options)) },
  }) : null;
}
// Only imported by server endpoints. Never send this key as a prop or use PUBLIC_ prefix.
export function serviceDb() {
  return env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY ? createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } }) : null;
}
