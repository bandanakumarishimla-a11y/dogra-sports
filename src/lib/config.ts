export const business = {
  name: "Dogra Sports",
  phone: "+91 97363 25100",
  phoneHref: "tel:+919736325100",
  alternate: "+91 98163 75037",
  alternateHref: "tel:+919816375037",
  address:
    "Near ITI Bilaspur, 6-B Industrial Area, Sadar, Bilaspur (209), Bilaspur, Himachal Pradesh, 174001",
  hours: "9:00 AM – 8:00 PM",
};
export const categories = [
  "Cricket",
  "Sportswear",
  "Footwear",
  "Team sports",
  "Fitness",
  "Institutional",
];
export const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://uyjgofjayarqnpoqawza.supabase.co";
// A publishable key is intentionally public. RLS protects all customer and admin records.
export const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  "sb_publishable_E5JzqogiBkdaaYOxXCnNBQ_kOE_4R2H";
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");
