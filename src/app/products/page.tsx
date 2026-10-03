import type { Metadata } from "next";
import { getProducts } from "@/lib/data";
import { Catalogue } from "@/components/catalogue";
export const metadata: Metadata = { title: "Product catalogue" };
export const dynamic = "force-dynamic";
export default async function Products({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const [products, params] = await Promise.all([getProducts(), searchParams]);
  return (
    <>
      <section className="page-intro">
        <div className="container">
          <span className="eyebrow">THE DOGRA SPORTS CATALOGUE</span>
          <h1>Find your next game.</h1>
          <p>
            Explore sportswear, cricket essentials and equipment. Ask us for
            current models, prices and availability.
          </p>
        </div>
      </section>
      <section className="section container catalogue-section">
        <Catalogue products={products} initialCategory={params.category} />
        <p className="catalogue-note">
          Sample ranges are labelled. Product photographs and confirmed
          specifications are added by the store.
        </p>
      </section>
    </>
  );
}
