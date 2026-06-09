-- Merch order records: one row per paid checkout, written by the
-- printful-checkout edge function (service role). Gives the Admin panel
-- a reconciliation trail between PayPal payments and Printful fulfillment.

create table public.merch_orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  customer_name text not null,
  email text not null,
  items jsonb not null,
  shipping_address jsonb not null,
  subtotal_cents integer not null,
  shipping_cents integer not null,
  total_cents integer not null,
  currency text not null default 'USD',
  paypal_order_id text not null unique,
  paypal_capture_id text,
  printful_order_id text,
  printful_status text,
  status text not null default 'paid',
  error_detail text
);

comment on column public.merch_orders.status is 'paid | fulfillment_created | fulfillment_failed';

alter table public.merch_orders enable row level security;

-- Only admins can read order records (service role bypasses RLS for writes)
create policy "Admins can view merch orders"
  on public.merch_orders
  for select
  using (public.has_role(auth.uid(), 'admin'::public.app_role));

create index merch_orders_created_at_idx on public.merch_orders (created_at desc);
create index merch_orders_status_idx on public.merch_orders (status);
