-- Eman Agency Poppo Coin Order System
-- Run this complete script in Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  name text not null,
  poppo_id text not null,
  coins bigint not null,
  price_ttd numeric(12,2) not null,
  payment_method text not null,
  receipt_path text not null,
  status text not null default 'Pending'
    check (status in ('Pending','Paid','Processing','Completed','Rejected')),
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;

-- Remove older prototype policies if they exist.
drop policy if exists "public can insert orders" on public.orders;
drop policy if exists "public can lookup orders" on public.orders;
drop policy if exists "authenticated admins can update orders" on public.orders;

-- Customers may create orders.
create policy "public can insert orders"
on public.orders for insert
to anon
with check (
  length(trim(name)) between 1 and 120
  and length(trim(poppo_id)) between 1 and 100
  and length(trim(order_number)) = 10
  and coins > 0
  and price_ttd > 0
  and payment_method in ('Bank Transfer','PayPal','Binance / USDT (BEP20)')
  and status = 'Pending'
);

-- Only authenticated admin users can read/update the orders table directly.
create policy "authenticated admins can read orders"
on public.orders for select
to authenticated
using (true);

create policy "authenticated admins can update orders"
on public.orders for update
to authenticated
using (true)
with check (true);

-- Customer status lookup returns only non-sensitive fields for an exact order number.
create or replace function public.lookup_order(p_order_number text)
returns table (
  order_number text,
  coins bigint,
  price_ttd numeric,
  payment_method text,
  status text,
  created_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  select o.order_number, o.coins, o.price_ttd, o.payment_method, o.status, o.created_at
  from public.orders o
  where o.order_number = upper(trim(p_order_number))
  limit 1;
$$;

revoke all on function public.lookup_order(text) from public;
grant execute on function public.lookup_order(text) to anon, authenticated;

-- Private receipt bucket.
insert into storage.buckets (id,name,public)
values ('receipts','receipts',false)
on conflict (id) do update set public=false;

drop policy if exists "public can upload receipts" on storage.objects;
drop policy if exists "authenticated admins can read receipts" on storage.objects;

-- Customers may upload into the private receipts bucket.
create policy "public can upload receipts"
on storage.objects for insert
to anon
with check (
  bucket_id = 'receipts'
  and lower(storage.extension(name)) in ('jpg','jpeg','png','webp','pdf')
);

-- Authenticated admins can read private receipts and generate signed URLs.
create policy "authenticated admins can read receipts"
on storage.objects for select
to authenticated
using (bucket_id = 'receipts');

-- Before a high-volume public launch, add rate limiting/anti-spam controls,
-- stronger admin authorization, backups, privacy/terms pages, and verify compliance
-- with Poppo Live's current rules.
