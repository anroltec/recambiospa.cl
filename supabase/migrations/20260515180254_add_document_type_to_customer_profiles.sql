alter table customer_profiles
  add column if not exists document_type text not null default 'boleta'
  check (document_type in ('boleta', 'factura'));
