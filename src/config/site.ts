import { env } from 'cloudflare:workers';
// Contact info shared with the client's other site (CALIENDO PSI). Env vars still
// win when set (e.g. a future dedicated number), these are just the real defaults.
export const site = {
  name: 'Tee Aqua Solutions',
  tagline: 'Distribuidora de materiais para piscina',
  description: 'Produtos, equipamentos e soluções para manter sua piscina sempre limpa, segura e cristalina.',
  domain: env.SITE_URL || '',
  phone: env.SITE_PHONE || '+55 (21) 99864-6217', whatsapp: env.SITE_WHATSAPP || '5521998646217',
  email: env.SITE_EMAIL || 'eduvelloso@gmail.com', address: env.SITE_ADDRESS || 'Recreio dos Bandeirantes, Rio de Janeiro · RJ',
  socials: { instagram: env.SITE_INSTAGRAM || '', facebook: env.SITE_FACEBOOK || '' },
};
export const demoMode = env.DEMO_MODE === 'true' || (import.meta.env.DEV && env.DEMO_MODE !== 'false' && !env.SUPABASE_URL);
export function whatsappUrl(message = 'Olá! Gostaria de conhecer as soluções da Tee Aqua.') {
  const number = site.whatsapp.replace(/\D/g, '');
  return number ? `https://wa.me/${number}?text=${encodeURIComponent(message)}` : '/contato';
}
export const navigation = [['Início', '/'], ['Empresa', '/empresa'], ['Produtos', '/produtos'], ['Marcas', '/marcas'], ['Soluções', '/solucoes'], ['Dicas', '/dicas'], ['Contato', '/contato']];
