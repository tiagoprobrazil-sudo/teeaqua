import { z } from 'zod';
const text = (max: number) => z.string().trim().max(max);
export const contactSchema = z.object({
  nome: text(120).min(2, 'Informe seu nome.'), empresa: text(160).default(''),
  telefone: text(30).regex(/^[+()\d\s.-]*$/, 'Telefone inválido.').default(''),
  whatsapp: text(30).regex(/^[+()\d\s.-]*$/, 'WhatsApp inválido.').default(''),
  email: z.string().trim().max(254).pipe(z.email('Informe um e-mail válido.')), cidade: text(120).min(2, 'Informe sua cidade.'),
  assunto: z.enum(['Orçamento', 'Produtos', 'Distribuição', 'Suporte', 'Outros']),
  mensagem: text(5000).min(10, 'Escreva uma mensagem com pelo menos 10 caracteres.'),
  consentimento: z.literal('on', { error: 'Autorize o uso dos dados para este atendimento.' }),
});
export const imageUrl = z.string().refine(v => !v || /^https:\/\/[^\s]+$/.test(v) || /^\/images\/[^\s]+$/.test(v), 'Use uma URL HTTPS ou /images/.');
export const productSchema = z.object({
  nome: text(180).min(2), slug: text(180).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  descricao_curta: text(300), descricao: text(20000), codigo: text(80),
  categoria_id: z.uuid().nullable(), marca_id: z.uuid().nullable(),
  imagem_principal: imageUrl, galeria: z.array(imageUrl).max(20),
  especificacoes: z.record(z.string().max(100), z.string().max(1000)),
  destaque: z.boolean(), ativo: z.boolean(), ordem: z.number().int().min(0).max(100000),
});
export const sameOrigin = (request: Request) => request.headers.get('origin') === new URL(request.url).origin;
export const json = (body: unknown, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
export function safeJson(value: unknown) { return JSON.stringify(value).replace(/</g, '\\u003c'); }
