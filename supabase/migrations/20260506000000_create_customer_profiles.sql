-- Customer B2B profiles — all business/billing data lives here.
-- Linked to Shopify by shopify_id (gid://shopify/Customer/…).
-- Shopify owns: email, password, firstName, lastName, orders.
-- Supabase owns: phone, RUT, razón social, giro, billing address, notes.

create table if not exists customer_profiles (
  id                    uuid        primary key default gen_random_uuid(),
  shopify_id            text        unique not null,
  phone                 text,
  rut                   text,
  razon_social          text,
  giro                  text,
  billing_address_line1 text,
  billing_address_line2 text,
  billing_comuna        text,
  billing_city          text,
  billing_region        text,
  billing_postal_code   text,
  billing_country_code  text        not null default 'CL',
  billing_notes         text,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- Only server-side (service_role) can access this table.
alter table customer_profiles enable row level security;

-- Auto-stamp updated_at on every UPDATE.
create or replace function update_updated_at_column()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_customer_profiles_updated_at
  before update on customer_profiles
  for each row execute procedure update_updated_at_column();
