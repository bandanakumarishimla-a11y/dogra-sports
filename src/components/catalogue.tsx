"use client";
import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import type { Product } from "@/lib/types";
import { categories } from "@/lib/config";
import { ProductCard } from "./product-card";
export function Catalogue({
  products,
  initialCategory = "",
}: {
  products: Product[];
  initialCategory?: string;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [brand, setBrand] = useState("");
  const [size, setSize] = useState("");
  const [price, setPrice] = useState("");
  const [sort, setSort] = useState("featured");
  const brands = [...new Set(products.map((p) => p.brand).filter(Boolean))];
  const sizes = [...new Set(products.flatMap((p) => p.sizes))];
  const filtered = useMemo(() => {
    let result = products.filter(
      (p) =>
        (!category || p.category === category) &&
        (!query ||
          `${p.name} ${p.category} ${p.brand} ${p.description}`
            .toLowerCase()
            .includes(query.toLowerCase())) &&
        (!brand || p.brand === brand) &&
        (!size || p.sizes.includes(size)) &&
        (!price || (p.price !== null && Number(p.price) <= Number(price))),
    );
    if (sort === "name") result.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "price")
      result.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
    else result.sort((a, b) => Number(b.featured) - Number(a.featured));
    return result;
  }, [products, query, category, brand, size, price, sort]);
  return (
    <>
      <div className="catalogue-tools">
        <label className="search-field">
          <Search size={20} />
          <input
            aria-label="Search products"
            placeholder="Search products, sports or brands…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button aria-label="Clear search" onClick={() => setQuery("")}>
              <X size={18} />
            </button>
          )}
        </label>
        <label className="sort-field">
          Sort by
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="featured">Featured</option>
            <option value="name">Name: A–Z</option>
            <option value="price">Price: low to high</option>
          </select>
        </label>
      </div>
      <div className="category-tabs">
        <button
          className={!category ? "active" : ""}
          onClick={() => setCategory("")}
        >
          All products
        </button>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={category === c ? "active" : ""}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="filter-row">
        <SlidersHorizontal size={18} />
        <label>
          Brand
          <select value={brand} onChange={(e) => setBrand(e.target.value)}>
            <option value="">All brands</option>
            {brands.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </label>
        <label>
          Size
          <select value={size} onChange={(e) => setSize(e.target.value)}>
            <option value="">All sizes</option>
            {sizes.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <label>
          Maximum price
          <select value={price} onChange={(e) => setPrice(e.target.value)}>
            <option value="">Any price</option>
            <option value="1000">₹1,000</option>
            <option value="5000">₹5,000</option>
            <option value="10000">₹10,000</option>
            <option value="25000">₹25,000</option>
          </select>
        </label>
        <span>
          {filtered.length} {filtered.length === 1 ? "range" : "ranges"}
        </span>
      </div>
      {filtered.length ? (
        <div className="product-grid">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Search size={36} />
          <h2>No matching products</h2>
          <p>
            Try another search or reset your filters. You can also contact us
            for a specific requirement.
          </p>
          <button
            className="button button-red"
            onClick={() => {
              setQuery("");
              setCategory("");
              setBrand("");
              setSize("");
              setPrice("");
            }}
          >
            Reset filters
          </button>
        </div>
      )}
    </>
  );
}
