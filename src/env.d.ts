/// <reference types="astro/client" />
declare namespace Cloudflare { interface Env {
  SITE_URL?: string; SUPABASE_URL?: string; SUPABASE_ANON_KEY?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string; TURNSTILE_SITE_KEY?: string;
  TURNSTILE_SECRET_KEY?: string; TURNSTILE_HOSTNAMES?: string; DEMO_MODE?: string;
  SITE_PHONE?: string; SITE_WHATSAPP?: string; SITE_EMAIL?: string;
  SITE_ADDRESS?: string; SITE_INSTAGRAM?: string; SITE_FACEBOOK?: string;
} }
declare namespace App { interface Locals {
  supabase: import('@supabase/supabase-js').SupabaseClient | null;
  user: import('@supabase/supabase-js').User | null;
} }
