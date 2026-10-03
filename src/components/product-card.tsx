import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/types";
import { CategoryIcon } from "./category-icon";
export function ProductCard({ product: p }: { product: Product }) {
  return (
    <article className="product-card">
      <Link
        href={`/products/${p.slug}`}
        className="product-image"
        aria-label={`View ${p.name}`}
      >
        {p.image_url ? (
          <Image
            src={p.image_url}
            alt={p.name}
            fill
            sizes="(max-width:600px) 100vw,(max-width:1000px) 50vw,25vw"
          />
        ) : (
          <div className="product-placeholder">
            <CategoryIcon category={p.category} size={68} />
            <span>PRODUCT PHOTO TO BE ADDED</span>
          </div>
        )}
        {p.sample && <span className="sample-badge">Sample range</span>}
      </Link>
      <div className="product-info">
        <span className="eyebrow">
          {p.category}
          {p.brand && ` / ${p.brand}`}
        </span>
        <h3>
          <Link href={`/products/${p.slug}`}>{p.name}</Link>
        </h3>
        <p>{p.stock}</p>
        <div className="product-bottom">
          <strong>
            {p.price !== null
              ? `₹${Number(p.price).toLocaleString("en-IN")}`
              : "Enquire for price"}
          </strong>
          <Link href={`/products/${p.slug}`} className="text-link">
            View details
          </Link>
        </div>
      </div>
    </article>
  );
}
