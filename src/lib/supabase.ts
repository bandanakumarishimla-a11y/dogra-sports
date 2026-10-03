import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import { supabaseUrl, supabaseKey } from "./config";
let client: SupabaseClient<Database> | undefined;
export function browserDb() {
  if (!client) client = createClient<Database>(supabaseUrl, supabaseKey);
  return client;
}
export function serverDb() {
  return createClient<Database>(supabaseUrl, supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
