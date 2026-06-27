alter table public.products
add column if not exists gallery_urls text[] default '{}';
