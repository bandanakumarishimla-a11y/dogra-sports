import { serverDb } from "./supabase";
import type { Product, Settings } from "./types";
import { defaultSettings } from "./data-defaults";
export async function getProducts(): Promise<Product[]> {
  const { data, error } = await serverDb()
    .from("dogra_products")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: true });
  if (error) throw new Error("Catalogue is temporarily unavailable");
  return data || [];
}
export async function getSettings(): Promise<Settings> {
  const { data } = await serverDb()
    .from("dogra_settings")
    .select("value")
    .eq("id", "store")
    .maybeSingle();
  return { ...defaultSettings, ...((data?.value as Partial<Settings>) || {}) };
}
