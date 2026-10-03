-- Follow-up applied migration: restrict a Supabase-created event-trigger function.
-- Event triggers still run; this removes unnecessary direct API execution privileges.
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
