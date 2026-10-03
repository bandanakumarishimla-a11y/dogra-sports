import { siteUrl } from "@/lib/config";
import { getProducts } from "@/lib/data";
export const revalidate = 300;
export default async function sitemap() {
  const products = await getProducts();
  return [
    ...[
      "",
      "/products",
      "/team-kits",
      "/bulk-orders",
      "/about",
      "/gallery",
      "/contact",
      "/privacy",
      "/terms",
      "/shipping",
      "/returns",
    ].map((p) => ({ url: `${siteUrl}${p}` })),
    ...products.map((p) => ({ url: `${siteUrl}/products/${p.slug}` })),
  ];
}
