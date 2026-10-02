-- Proposed schema, not applied to a remote project.
create table public.dogra_enquiries (
 id uuid primary key default gen_random_uuid(),
 created_at timestamptz not null default now(),
 name text not null check (char_length(name) between 1 and 100),
 phone text not null check (char_length(phone) between 10 and 20),
 requirement text not null check (requirement in ('Product enquiry','Custom team kits','Institutional / bulk order')),
 message text not null check (char_length(message) between 1 and 2000)
);
alter table public.dogra_enquiries enable row level security;
revoke all on public.dogra_enquiries from anon, authenticated;
-- No public policies. Customer enquiries must never be publicly readable.
