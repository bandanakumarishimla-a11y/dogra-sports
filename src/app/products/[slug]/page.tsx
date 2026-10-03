import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, Phone } from "lucide-react";
import { getProducts } from "@/lib/data";
import { business } from "@/lib/config";
import { CategoryIcon } from "@/components/category-icon";
import { ProductCard } from "@/components/product-card";
export const dynamic = "force-dynamic";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = (await getProducts()).find((p) => p.slug === slug);
  return { title: p?.name || "Product not found", description: p?.description };
}
export default async function ProductDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const products = await getProducts();
  const p = products.find((p) => p.slug === slug);
  if (!p) notFound();
  const related = products
    .filter((v) => v.id !== p.id && v.category === p.category)
    .slice(0, 3);
  return (
    <div className="container section">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href="/products">Products</Link>
        <span>/</span>
        <span>{p.name}</span>
      </nav>
      <div className="product-detail">
        <div className="detail-image">
          {p.image_url ? (
            <Image
              src={p.image_url}
              alt={p.name}
              fill
              sizes="(max-width:800px) 100vw,50vw"
            />
          ) : (
            <div className="product-placeholder">
              <CategoryIcon category={p.category} size={120} />
              <span>PRODUCT PHOTO TO BE ADDED</span>
            </div>
          )}
        </div>
        <div className="detail-copy">
          <span className="eyebrow">
            {p.category}
            {p.brand && ` / ${p.brand}`}
          </span>
          <h1>{p.name}</h1>
          {p.sample && (
            <span className="inline-badge">Sample product range</span>
          )}
          <p className="detail-description">{p.description}</p>
          <div className="detail-price">
            {p.price !== null
              ? `₹${Number(p.price).toLocaleString("en-IN")}`
              : "Contact us for a quotation"}
            <span>{p.stock}</span>
          </div>
          <ul className="detail-list">
            {p.details.map((d) => (
              <li key={d}>
                <Check size={18} />
                {d}
              </li>
            ))}
          </ul>
          {p.sizes.length > 0 && (
            <div className="variant-row">
              <strong>Size options</strong>
              {p.sizes.map((s) => (
                <span key={s}>{s}</span>
              ))}
            </div>
          )}
          {p.colours.length > 0 && (
            <div className="variant-row">
              <strong>Colours</strong>
              {p.colours.map((s) => (
                <span key={s}>{s}</span>
              ))}
            </div>
          )}
          <div className="detail-actions">
            <Link
              href={`/contact?product=${encodeURIComponent(p.name)}`}
              className="button button-red"
            >
              Check availability / enquire
            </Link>
            <a className="button button-light" href={business.phoneHref}>
              <Phone size={17} /> Call us
            </a>
          </div>
          <small>
            Availability, final specifications and delivery terms are confirmed
            before your order.
          </small>
        </div>
      </div>
      {related.length > 0 && (
        <section className="related-section">
          <div className="section-heading">
            <h2>More for your game.</h2>
            <Link href="/products" className="text-link">
              View catalogue
            </Link>
          </div>
          <div className="product-grid">
            {related.map((v) => (
              <ProductCard key={v.id} product={v} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
