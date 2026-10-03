import Link from "next/link";
export default function NotFound() {
  return (
    <div className="container section empty-state">
      <span className="eyebrow">404 · PAGE NOT FOUND</span>
      <h1>Let’s get you back in the game.</h1>
      <p>This page may have moved or the product may no longer be listed.</p>
      <Link href="/products" className="button button-red">
        Explore products
      </Link>
    </div>
  );
}
