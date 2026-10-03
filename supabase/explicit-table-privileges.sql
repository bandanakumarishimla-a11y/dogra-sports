revoke all on public.dogra_admins, public.dogra_products, public.dogra_settings, public.dogra_enquiries from anon, authenticated;
grant select on public.dogra_admins to authenticated;
grant select on public.dogra_products, public.dogra_settings to anon, authenticated;
grant insert, update, delete on public.dogra_products to authenticated;
grant update on public.dogra_settings to authenticated;
grant insert on public.dogra_enquiries to anon, authenticated;
grant select, update, delete on public.dogra_enquiries to authenticated;

-- Keep anonymous catalogue reads independent of private admin memberships.
drop policy "Published catalogue" on public.dogra_products;
create policy "Published catalogue" on public.dogra_products for select to anon, authenticated using (published);
