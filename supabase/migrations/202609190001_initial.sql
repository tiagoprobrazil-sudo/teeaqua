-- Tee Aqua Solutions — Supabase PostgreSQL
-- Apply with: supabase db push (after linking the intended project).
begin;
create extension if not exists pgcrypto;

create or replace function public.is_admin() returns boolean
language sql stable security invoker set search_path = ''
as $$ select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin' $$;

create or replace function public.touch_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin new.updated_at = now(); return new; end;
$$;

create table public.categories (
 id uuid primary key default gen_random_uuid(),
 nome text not null check(char_length(nome) between 2 and 180),
 slug text not null unique check(slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
 descricao text not null default '', imagem text not null default '',
 ordem integer not null default 0 check(ordem>=0), ativo boolean not null default false,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.brands (
 id uuid primary key default gen_random_uuid(), nome text not null,
 slug text not null unique check(slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
 logo text, ativo boolean not null default false,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.products (
 id uuid primary key default gen_random_uuid(), nome text not null,
 slug text not null unique check(slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
 descricao_curta text not null default '', descricao text not null default '',
 categoria_id uuid not null references public.categories(id) on delete restrict,
 marca_id uuid references public.brands(id) on delete restrict,
 imagem_principal text not null default '', galeria jsonb not null default '[]' check(jsonb_typeof(galeria)='array'),
 codigo text not null default '', especificacoes jsonb not null default '{}' check(jsonb_typeof(especificacoes)='object'),
 destaque boolean not null default false, ativo boolean not null default false,
 ordem integer not null default 0 check(ordem>=0),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create unique index products_code_unique on public.products(codigo) where codigo<>'';
create table public.product_images (
 id uuid primary key default gen_random_uuid(), product_id uuid not null references public.products(id) on delete cascade,
 url text not null check(url ~ '^https://' or url ~ '^/images/'), alt text not null default '',
 ordem integer not null default 0 check(ordem>=0), created_at timestamptz not null default now()
);
create index product_images_order on public.product_images(product_id,ordem);
create table public.contacts (
 id uuid primary key default gen_random_uuid(),
 nome text not null check(char_length(nome) between 2 and 120), empresa text not null default '',
 telefone text not null default '', whatsapp text not null default '',
 email text not null check(char_length(email)<=254), cidade text not null,
 assunto text not null check(assunto in ('Orçamento','Produtos','Distribuição','Suporte','Outros')),
 mensagem text not null check(char_length(mensagem) between 10 and 5000),
 consentimento boolean not null check(consentimento), consent_version text not null,
 status text not null default 'novo' check(status in ('novo','em_atendimento','concluido')),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.post_categories (
 id uuid primary key default gen_random_uuid(), nome text not null,
 slug text not null unique, created_at timestamptz not null default now()
);
create table public.posts (
 id uuid primary key default gen_random_uuid(), titulo text not null,
 slug text not null unique check(slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
 resumo text not null default '', conteudo text not null default '', imagem text not null default '',
 categoria_id uuid references public.post_categories(id) on delete restrict,
 publicado boolean not null default false, published_at timestamptz,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 constraint publication_date_required check(not publicado or published_at is not null)
);
create index products_category on public.products(categoria_id);
create index products_brand on public.products(marca_id);
create index products_catalog on public.products(ativo,ordem,id);
create index products_featured on public.products(ordem) where ativo and destaque;
create index products_search on public.products using gin(to_tsvector('portuguese',nome||' '||descricao_curta));
create index contacts_inbox on public.contacts(status,created_at desc);
create index posts_publication on public.posts(publicado,published_at desc);
create index posts_category on public.posts(categoria_id);
create index categories_order on public.categories(ativo,ordem);

-- Keep JSON gallery and normalized image rows in sync, atomically.
create or replace function public.sync_product_images() returns trigger
language plpgsql security invoker set search_path = '' as $$
begin
 if TG_OP='INSERT' or new.galeria is distinct from old.galeria then
  delete from public.product_images where product_id=new.id;
  insert into public.product_images(product_id,url,ordem)
  select new.id, value, (ordinality-1)::integer from jsonb_array_elements_text(new.galeria) with ordinality;
 end if;
 return new;
end;
$$;
create trigger products_gallery_sync after insert or update of galeria on public.products for each row execute function public.sync_product_images();

do $$ declare t text; begin
 foreach t in array array['categories','brands','products','contacts','posts'] loop
 execute format('create trigger touch_updated_at before update on public.%I for each row execute function public.touch_updated_at()',t);
 end loop;
 foreach t in array array['categories','brands','products','product_images','contacts','posts','post_categories'] loop
 execute format('alter table public.%I enable row level security',t);
 execute format('revoke all on public.%I from anon, authenticated',t);
 execute format('grant select,insert,update,delete on public.%I to authenticated',t);
 execute format('grant all on public.%I to service_role',t);
 execute format('create policy admin_all on public.%I for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()))',t);
 end loop;
end $$;

grant select on public.categories,public.brands,public.products,public.product_images,public.posts,public.post_categories to anon;
create policy public_categories on public.categories for select to anon,authenticated using(ativo);
create policy public_brands on public.brands for select to anon,authenticated using(ativo);
create policy public_products on public.products for select to anon,authenticated using(
 ativo and exists(select 1 from public.categories c where c.id=categoria_id and c.ativo)
);
create policy public_images on public.product_images for select to anon,authenticated using(
 exists(select 1 from public.products p where p.id=product_id and p.ativo)
);
create policy public_posts on public.posts for select to anon,authenticated using(publicado and published_at<=now());
create policy public_post_categories on public.post_categories for select to anon,authenticated using(true);
-- contacts has NO public SELECT/INSERT policies. Only the validated server endpoint uses service_role.

insert into public.post_categories(nome,slug) values
 ('Tratamento da água','tratamento-da-agua'),('Limpeza','limpeza'),('Manutenção','manutencao'),
 ('Equipamentos','equipamentos'),('Economia','economia'),('Segurança','seguranca');

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('catalog','catalog',true,5242880,array['image/jpeg','image/png','image/webp'])
on conflict(id) do nothing;
create policy catalog_public_read on storage.objects for select to anon,authenticated using(bucket_id='catalog');
create policy catalog_admin_insert on storage.objects for insert to authenticated
with check(bucket_id='catalog' and (select public.is_admin()) and (storage.foldername(name))[1]=(select auth.uid())::text);
create policy catalog_admin_update on storage.objects for update to authenticated
using(bucket_id='catalog' and (select public.is_admin()))
with check(bucket_id='catalog' and (select public.is_admin()));
create policy catalog_admin_delete on storage.objects for delete to authenticated
using(bucket_id='catalog' and (select public.is_admin()));
commit;

