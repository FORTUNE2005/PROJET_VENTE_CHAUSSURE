"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { categories } from "@/data/categories";
import { Product } from "@/data/types";

const categoryMap: Record<string, { id: string; name: string; slug: string; image: string; productCount: number }> = {};
categories.forEach((c) => { categoryMap[c.id] = c; categoryMap[c.slug] = c; });

interface RawProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  category: string;
  images: string;
  colors: string;
  sizes: string;
  stock: number;
  rating: number;
  reviewCount: number;
  isNew: number;
  isBestSeller: number;
  description?: string;
  material?: string;
}

function rawToProduct(raw: RawProduct): Product {
  const cat = categoryMap[raw.category] || categories[0];
  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    price: raw.price,
    originalPrice: raw.originalPrice ?? undefined,
    category: cat,
    images: (() => { try { return JSON.parse(raw.images); } catch { return []; } })(),
    colors: (() => { try { return JSON.parse(raw.colors); } catch { return []; } })(),
    sizes: (() => { try { return JSON.parse(raw.sizes); } catch { return []; } })(),
    stock: raw.stock,
    rating: raw.rating,
    reviewCount: raw.reviewCount,
    isNew: raw.isNew === 1,
    isBestSeller: raw.isBestSeller === 1,
    description: raw.description,
    material: raw.material,
  };
}

function SearchContent() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/produits")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setProducts(data.map(rawToProduct)); })
      .catch(() => {});
  }, []);

  const results = useMemo(() => {
    if (!query.trim()) return { products: [], categories: [] };
    const q = query.toLowerCase();
    return {
      products: products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.material?.toLowerCase().includes(q)
      ),
      categories: categories.filter((c) => c.name.toLowerCase().includes(q)),
    };
  }, [query, products]);

  const hasResults = results.products.length > 0 || results.categories.length > 0;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl lg:text-3xl font-serif font-bold text-stone-900 mb-6">Recherche</h1>

      <div className="relative mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher une paire, une catégorie, une matière..."
          className="w-full bg-stone-50 border border-stone-200 rounded-full px-5 py-4 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-200 focus:border-stone-300"
          autoFocus
        />
        <svg className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
      </div>

      {query.trim() && !hasResults && (
        <div className="text-center py-12">
          <p className="text-stone-500">Aucun résultat pour &ldquo;{query}&rdquo;</p>
          <p className="text-xs text-stone-400 mt-2">Essayez avec d&apos;autres mots-clés</p>
        </div>
      )}

      {results.categories.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-medium text-stone-400 uppercase tracking-wider mb-4">Catégories</h2>
          <div className="flex flex-wrap gap-2">
            {results.categories.map((cat) => (
              <Link key={cat.id} href={`/categories/${cat.slug}`} className="bg-stone-100 text-stone-700 px-4 py-2 rounded-full text-sm hover:bg-stone-200 transition-colors">
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {results.products.length > 0 && (
        <div>
          <h2 className="text-sm font-medium text-stone-400 uppercase tracking-wider mb-4">
            Produits ({results.products.length})
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {results.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function RecherchePage() {
  return (
    <>
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <Suspense fallback={
          <div className="max-w-2xl mx-auto text-center py-12">
            <p className="text-stone-400">Chargement...</p>
          </div>
        }>
          <SearchContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
