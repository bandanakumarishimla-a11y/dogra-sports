-- Dogra Sports: catalogue, private customer enquiries and owner-managed admin access.
create table public.dogra_admins (user_id uuid primary key references auth.users(id) on delete cascade);
alter table public.dogra_admins enable row level security;
grant select on public.dogra_admins to authenticated;
create policy "Admins see own membership" on public.dogra_admins for select to authenticated using (user_id = (select auth.uid()));

create table public.dogra_products (
 id uuid primary key default gen_random_uuid(), slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
 name text not null check (char_length(name) between 1 and 150), category text not null check(category in ('Cricket','Sportswear','Footwear','Team sports','Fitness','Institutional')),
 brand text not null default '', description text not null default '', details text[] not null default '{}',sizes text[] not null default '{}',colours text[] not null default '{}',
 price numeric(12,2) check(price is null or price >= 0),stock text not null default 'Check availability' check(stock in ('Check availability','In stock','Out of stock','Made to order')),
 image_url text,featured boolean not null default false,published boolean not null default true,sample boolean not null default false,created_at timestamptz not null default now()
);
alter table public.dogra_products enable row level security;
grant select on public.dogra_products to anon,authenticated;
grant insert,update,delete on public.dogra_products to authenticated;
create policy "Published catalogue" on public.dogra_products for select to anon,authenticated using(published);
create policy "Owner manages catalogue" on public.dogra_products for all to authenticated using(exists(select 1 from public.dogra_admins where user_id=(select auth.uid()))) with check(exists(select 1 from public.dogra_admins where user_id=(select auth.uid())));

create table public.dogra_settings (id text primary key, value jsonb not null);
alter table public.dogra_settings enable row level security;
grant select on public.dogra_settings to anon,authenticated;
grant update on public.dogra_settings to authenticated;
create policy "Public store content" on public.dogra_settings for select to anon,authenticated using(true);
create policy "Owner updates content" on public.dogra_settings for update to authenticated using(exists(select 1 from public.dogra_admins where user_id=(select auth.uid()))) with check(exists(select 1 from public.dogra_admins where user_id=(select auth.uid())));

create table public.dogra_enquiries (
 id uuid primary key default gen_random_uuid(),created_at timestamptz not null default now(),
 name text not null check(char_length(name) between 2 and 100), phone text not null check(phone ~ '^[0-9+ ()-]{10,20}$'),
 kind text not null check(kind in ('Product enquiry','Custom team kits','Institutional / bulk order','General enquiry')),
 organisation text not null default '' check(char_length(organisation)<=150), product text not null default '' check(char_length(product)<=150),
 quantity integer check(quantity is null or quantity between 1 and 100000),sizes text not null default '' check(char_length(sizes)<=500),delivery_date date,
 message text not null check(char_length(message) between 5 and 3000),
 attachment_name text check(char_length(attachment_name)<=150),attachment_type text check(attachment_type in ('image/png','image/jpeg','application/pdf')),
 attachment_base64 text check(char_length(attachment_base64)<=2800000),
 status text not null default 'new' check(status in ('new','contacted','closed')),
 check ((attachment_base64 is null and attachment_name is null and attachment_type is null) or (attachment_base64 is not null and attachment_name is not null and attachment_type is not null))
);
alter table public.dogra_enquiries enable row level security;
grant insert on public.dogra_enquiries to anon,authenticated;
grant select,update,delete on public.dogra_enquiries to authenticated;
create policy "Customers submit requests" on public.dogra_enquiries for insert to anon,authenticated with check(status='new' and created_at between now()-interval '5 minutes' and now()+interval '5 minutes');
create policy "Owner reads enquiries" on public.dogra_enquiries for select to authenticated using(exists(select 1 from public.dogra_admins where user_id=(select auth.uid())));
create policy "Owner updates enquiries" on public.dogra_enquiries for update to authenticated using(exists(select 1 from public.dogra_admins where user_id=(select auth.uid()))) with check(exists(select 1 from public.dogra_admins where user_id=(select auth.uid())));
create policy "Owner removes enquiries" on public.dogra_enquiries for delete to authenticated using(exists(select 1 from public.dogra_admins where user_id=(select auth.uid())));
create index dogra_enquiry_phone_date on public.dogra_enquiries(phone,created_at);
-- A restricted trigger checks recent submissions without granting customer read access.
create schema if not exists dogra_private;
revoke all on schema dogra_private from public,anon,authenticated;
create function dogra_private.limit_enquiry() returns trigger language plpgsql security definer set search_path='' as $$
begin
 perform pg_advisory_xact_lock(hashtextextended(new.phone,0));
 if (select count(*) from public.dogra_enquiries where phone=new.phone and created_at>now()-interval '1 hour') >= 5 then
 raise exception 'Too many enquiries. Please call the store.' using errcode='P0001';
 end if;
 return new;
end;$$;
revoke all on function dogra_private.limit_enquiry() from public,anon,authenticated;
create trigger dogra_enquiry_limit before insert on public.dogra_enquiries for each row execute function dogra_private.limit_enquiry();

insert into public.dogra_settings values('store','{"hero_title":"Gear up.\nPlay strong.","hero_subtitle":"Cricket essentials, sportswear and custom team kits. Find your next game at Dogra Sports, Bilaspur.","whatsapp":"","gallery":[]}');
insert into public.dogra_products(slug,name,category,description,details,sizes,colours,stock,featured,sample) values
('cricket-bats','Cricket bats','Cricket','Find the right bat for your game. Ask our team about available models, weights and willow options.',array['Model, willow and weight depend on the selected bat.','Contact the store for current options and photographs.'],array['Ask for available sizes'],'{}','Check availability',true,true),
('batting-gloves','Batting gloves','Cricket','Explore batting gloves for adult and junior players. Enquire about right-hand and left-hand options.',array['Ask about protection, fit and available models.','Right-hand and left-hand availability is confirmed by the store.'],array['Men','Youth','Boys'],'{}','Check availability',true,true),
('cricket-kit-bags','Cricket kit bags','Cricket','Carry your match-day essentials. Ask about current backpack, duffle and wheelie bag options.',array['Capacity and features depend on the selected model.','Request photographs and a quotation from our team.'],'{}','{}','Check availability',true,true),
('custom-team-jerseys','Custom team jerseys','Sportswear','Bring your team colours to life with personalised jerseys, player names, numbers and sponsor logos.',array['Design and fabric options are confirmed before production.','Share your logo, quantities and sizes for a quotation.'],array['Custom size requirements'],array['Custom team colours'],'Made to order',true,true),
('cricket-footwear','Cricket footwear','Footwear','Explore footwear for training and match days. Ask about current cricket spikes and shoe sizes.',array['Choose footwear to suit your playing surface.','Available brands, sizes and sole types are confirmed by the store.'],array['Ask for available sizes'],'{}','Check availability',false,true),
('badminton-equipment','Badminton equipment','Team sports','Rackets, shuttlecocks and accessories for your next session.',array['Racket and shuttle specifications vary by model.','Enquire for current models and quantities.'],'{}','{}','Check availability',false,true),
('fitness-training','Fitness & training equipment','Fitness','Equipment for personal training, team sessions and fitness spaces.',array['Share your training goals and equipment requirements.','Specifications and quotations are provided for confirmed products.'],'{}','{}','Check availability',false,true),
('institutional-sports-supplies','School & academy supplies','Institutional','Sports goods, uniforms and equipment for schools, clubs and academies.',array['Upload your requirement list for a tailored quotation.','Delivery and installation terms are confirmed per order.'],'{}','{}','Check availability',false,true);

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('dogra-products','dogra-products',true,5242880,array['image/jpeg','image/png','image/webp']);
create policy "Public product images" on storage.objects for select to anon,authenticated using(bucket_id='dogra-products');
create policy "Owner uploads product images" on storage.objects for insert to authenticated with check(bucket_id='dogra-products' and exists(select 1 from public.dogra_admins where user_id=(select auth.uid())));
create policy "Owner replaces product images" on storage.objects for update to authenticated using(bucket_id='dogra-products' and exists(select 1 from public.dogra_admins where user_id=(select auth.uid()))) with check(bucket_id='dogra-products' and exists(select 1 from public.dogra_admins where user_id=(select auth.uid())));
create policy "Owner removes product images" on storage.objects for delete to authenticated using(bucket_id='dogra-products' and exists(select 1 from public.dogra_admins where user_id=(select auth.uid())));
