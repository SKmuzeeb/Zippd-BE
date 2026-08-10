-- zippd database schema (Neon Postgres)
-- This is the single source of truth for table/column names used by the API and frontend.
-- Apply this once against the Neon database. The app never runs DDL on boot.

create extension if not exists pgcrypto;

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz not null default now()
);

create table if not exists profiles (
  id uuid primary key references users(id) on delete cascade,
  email text,
  full_name text,
  phone text,
  created_at timestamptz not null default now()
);

create table if not exists kiranas (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  owner_name text not null,
  address text not null,
  locality text not null,
  city text not null,
  phone text not null,
  tagline text,
  hours_open time not null default '07:00',
  hours_close time not null default '22:00',
  created_at timestamptz not null default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  kirana_id uuid not null references kiranas(id) on delete cascade,
  name text not null,
  description text,
  category text not null,
  price_rupees numeric(10,2) not null check (price_rupees >= 0),
  unit text not null check (unit in ('kg','g','pcs','l','pack')),
  image_url text,
  in_stock boolean not null default true,
  min_order_qty numeric(6,2) not null default 1,
  step numeric(6,2) not null default 1,
  created_at timestamptz not null default now(),
  unique (kirana_id, name)
);

create table if not exists favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

create table if not exists orders (
  id text primary key,
  user_id uuid references users(id) on delete set null,
  kirana_id uuid not null references kiranas(id),
  status text not null default 'pending' check (status in ('pending','ready','picked_up','cancelled')),
  pickup_slot timestamptz not null,
  total numeric(10,2) not null check (total >= 0),
  payment_method text not null default 'pay_at_pickup',
  created_at timestamptz not null default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id text not null references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  name text not null,
  description text,
  price_rupees numeric(10,2) not null,
  unit text not null,
  quantity numeric(6,2) not null check (quantity > 0)
);
