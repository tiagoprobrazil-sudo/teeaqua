# TODO — Tee Aqua Solutions

Checklist do que falta para o site sair do modo demonstração e ir para produção.
Código, arquitetura e revisão de bugs: concluídos. O que resta abaixo depende de
contas, credenciais e conteúdo reais que só o Tiago pode fornecer/criar.

## 1. Cloudflare (infraestrutura)

- [ ] Confirmar conta Cloudflare com plano Workers adequado (SSR + KV).
- [ ] `wrangler login` na máquina de deploy.
- [ ] Criar o namespace KV de sessão: `wrangler kv namespace create SESSION` e
      colar o `id` retornado em `wrangler.jsonc` (hoje o binding é injetado
      automaticamente só em dev; em produção precisa do id real).
- [ ] Confirmar DNS do domínio já registrado apontando para a Cloudflare.
- [ ] Depois do primeiro deploy, configurar o domínio customizado apontando
      para o Worker (Cloudflare dashboard → Workers → domínio).
- [ ] Decidir sobre Cloudflare Images: hoje nada no código depende mais dele
      (trocamos a única página que usava `astro:assets Image` por `<img>`
      manual). `imageService: 'cloudflare-binding'` ainda está em
      `astro.config.mjs` mas é inofensivo enquanto não usado — pode remover
      ou deixar para uso futuro no painel admin.

## 2. Supabase

- [ ] Criar o projeto no Supabase.
- [ ] Rodar a migration `supabase/migrations/202609190001_initial.sql`
      (`supabase db push` depois de linkar o projeto, ou colar o SQL direto
      no SQL Editor do Supabase). Ela já cria tabelas, RLS, policies, o
      bucket de storage `catalog` e as categorias de posts.
- [ ] Criar o usuário admin: cadastrar no Supabase Auth (email/senha) e
      depois setar `raw_app_meta_data.role = "admin"` nesse usuário (via SQL
      Editor ou dashboard) — é isso que `is_admin()` e o middleware checam.
- [ ] Cadastrar as categorias reais de produtos pelo painel `/admin` (produto
      exige `categoria_id`, então categorias precisam existir primeiro).
- [ ] Cadastrar marcas, se houver.
- [ ] Cadastrar o catálogo real de produtos.

## 3. Cloudflare Turnstile (anti-spam do formulário de contato e login admin)

- [ ] Criar um site no Turnstile para o domínio de produção.
- [ ] Pegar Site Key e Secret Key.
- [ ] Incluir `localhost`/`127.0.0.1` nos hostnames permitidos também, para
      testar localmente.

## 4. Variáveis de ambiente / segredos

Local (`.dev.vars`, copiar de `.env.example`, nunca commitar):
- [ ] `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`, `TURNSTILE_HOSTNAMES`
- [ ] `SITE_PHONE`, `SITE_WHATSAPP`, `SITE_EMAIL`, `SITE_ADDRESS`,
      `SITE_INSTAGRAM`, `SITE_FACEBOOK`
- [ ] `DEMO_MODE=false` quando for testar com dados reais

Produção (via `wrangler secret put <NOME>` ou dashboard Cloudflare):
- [ ] Mesmas variáveis acima, com os valores de produção.

## 5. Conteúdo e dados reais (nada foi inventado no código)

- [ ] Telefone, WhatsApp, e-mail, endereço.
- [ ] Redes sociais (Instagram, Facebook).
- [ ] Fotografia profissional licenciada (hoje `src/config/media.ts` usa
      fotos do Unsplash como placeholder — trocar pelas fotos reais da
      empresa/piscinas).
- [ ] Marcas reais comercializadas (hoje a página `/marcas` mostra estado
      vazio honesto, sem inventar nada).
- [ ] Conteúdo real de blog/dicas (hoje há 3 posts de demonstração).
- [ ] Revisão jurídica da Política de Privacidade (`src/pages/privacidade.astro`
      já está marcada como versão inicial pendente de aprovação).

## 6. Testes finais antes de ir ao ar

- [ ] Testar o formulário de contato de ponta a ponta com Turnstile e
      Supabase reais (hoje só valida que o formulário fica desabilitado
      corretamente quando não configurado).
- [ ] Testar login admin e o CRUD completo (produtos, categorias, marcas,
      artigos, contatos) com o usuário admin real.
- [ ] Rodar Lighthouse / Core Web Vitals na versão com fotos reais.
- [ ] Conferir em pelo menos Chrome, Safari e um Android real.

## 7. Deploy

- [ ] `npm run deploy` (roda `astro check` → `astro build` → `wrangler deploy`).
- [ ] Confirmar `DEMO_MODE` desligado em produção (senão sitemap e robots.txt
      ficam vazios/bloqueados de propósito).
- [ ] Apontar o domínio customizado no Worker publicado.

---

## Já concluído (não precisa refazer)

- Arquitetura Astro 7 SSR + Cloudflare Workers + React islands + Tailwind v4.
- Logo SVG (símbolo T + gota + onda) em todas as variações pedidas.
- Header, Hero slider (4 slides, autoplay, swipe, reduced-motion), Home completa.
- Catálogo com busca/filtro/ordenação/paginação, página de produto com JSON-LD.
- Painel admin completo (dashboard, produtos, categorias, marcas, artigos,
  contatos) com autenticação Supabase e upload de imagem validando magic bytes.
- Schema Supabase com RLS, policies, bucket de storage e triggers.
- SEO técnico: sitemap, robots, canonical, Open Graph, JSON-LD
  (Organization/WebSite/BreadcrumbList/Product/Article), noindex automático
  em modo demo.
- Revisão completa de código (todo arquivo lido) e visual (toda rota testada
  no navegador, desktop e mobile, sem erros de console). 7 bugs reais
  encontrados e corrigidos nessa revisão.
