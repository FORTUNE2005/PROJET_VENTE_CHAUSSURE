"use client";

import { useState } from "react";
import { Product } from "@/data/types";
import ProductCard from "@/components/ProductCard";
import { formatPrice } from "@/lib/format";

interface Filters {
  sizes: number[];
  colors: string[];
  priceRange: [number, number];
  sort: string;
}

const allSizes = [35, 36, 37, 38, 39, 40, 41];
const allColors = ["Noir", "Blanc", "Nude", "Rose", "Rouge", "Bordeaux", "Marron", "Gris", "Bleu", "Doré", "Corail"];
const priceRanges = [
  { label: "Moins de 35 000 F", min: 0, max: 35000 },
  { label: "35 000 F - 55 000 F", min: 35000, max: 55000 },
  { label: "55 000 F - 75 000 F", min: 55000, max: 75000 },
  { label: "Plus de 75 000 F", min: 75000, max: Infinity },
];

interface CategoryFiltersProps {
  products: Product[];
  categoryName: string;
}

export default function CategoryFilters({ products, categoryName }: CategoryFiltersProps) {
  const [filters, setFilters] = useState<Filters>({
    sizes: [],
    colors: [],
    priceRange: [0, Infinity],
    sort: "newest",
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filteredProducts = products
    .filter((p) => {
      if (filters.sizes.length > 0 && !p.sizes.some((s) => filters.sizes.includes(s))) return false;
      if (filters.colors.length > 0 && !p.colors.some((c) => filters.colors.includes(c))) return false;
      if (p.price < filters.priceRange[0] || p.price > filters.priceRange[1]) return false;
      return true;
    })
    .sort((a, b) => {
      switch (filters.sort) {
        case "price-asc": return a.price - b.price;
        case "price-desc": return b.price - a.price;
        case "popular": return b.reviewCount - a.reviewCount;
        default: return 0;
      }
    });

  const toggleSize = (size: number) => {
    setFilters((f) => ({
      ...f,
      sizes: f.sizes.includes(size) ? f.sizes.filter((s) => s !== size) : [...f.sizes, size],
    }));
  };

  const toggleColor = (color: string) => {
    setFilters((f) => ({
      ...f,
      colors: f.colors.includes(color) ? f.colors.filter((c) => c !== color) : [...f.colors, color],
    }));
  };

  const activeFilterCount = filters.sizes.length + filters.colors.length + (filters.priceRange[0] > 0 || filters.priceRange[1] < Infinity ? 1 : 0);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-serif font-bold text-stone-900">{categoryName}</h1>
          <p className="mt-1 text-sm text-stone-500">{filteredProducts.length} produits</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden flex items-center gap-2 bg-white border border-stone-200 rounded-full px-4 py-2 text-sm text-stone-700 hover:border-stone-300"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
            </svg>
            Filtres
            {activeFilterCount > 0 && (
              <span className="bg-stone-900 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">{activeFilterCount}</span>
            )}
          </button>
          <select
            value={filters.sort}
            onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value }))}
            className="bg-white border border-stone-200 rounded-full px-4 py-2 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-200"
          >
            <option value="newest">Nouveautés</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
            <option value="popular">Popularité</option>
          </select>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Desktop Filters */}
        <aside className="hidden lg:block w-64 shrink-0 space-y-6">
          {/* Sizes */}
          <div>
            <h3 className="text-sm font-medium text-stone-900 mb-3">Pointure</h3>
            <div className="flex flex-wrap gap-2">
              {allSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => toggleSize(size)}
                  className={`w-10 h-10 rounded-lg text-sm border transition-colors ${
                    filters.sizes.includes(size)
                      ? "bg-stone-900 text-white border-stone-900"
                      : "bg-white text-stone-700 border-stone-200 hover:border-stone-300"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div>
            <h3 className="text-sm font-medium text-stone-900 mb-3">Couleur</h3>
            <div className="space-y-2">
              {allColors.map((color) => (
                <button
                  key={color}
                  onClick={() => toggleColor(color)}
                  className={`flex items-center gap-2 text-sm transition-colors ${
                    filters.colors.includes(color) ? "text-stone-900 font-medium" : "text-stone-500 hover:text-stone-700"
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full border ${filters.colors.includes(color) ? "border-stone-900 ring-2 ring-stone-200" : "border-stone-200"}`} />
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Price */}
          <div>
            <h3 className="text-sm font-medium text-stone-900 mb-3">Prix</h3>
            <div className="space-y-2">
              {priceRanges.map((range) => (
                <button
                  key={range.label}
                  onClick={() => setFilters((f) => ({ ...f, priceRange: [range.min, range.max] }))}
                  className={`block text-sm transition-colors ${
                    filters.priceRange[0] === range.min && filters.priceRange[1] === range.max
                      ? "text-stone-900 font-medium"
                      : "text-stone-500 hover:text-stone-700"
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reset */}
          {activeFilterCount > 0 && (
            <button
              onClick={() => setFilters({ sizes: [], colors: [], priceRange: [0, Infinity], sort: "newest" })}
              className="text-sm text-rose-600 hover:text-rose-700"
            >
              Effacer les filtres
            </button>
          )}
        </aside>

        {/* Products grid */}
        <div className="flex-1">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-stone-500">Aucun produit ne correspond à vos filtres.</p>
              <button
                onClick={() => setFilters({ sizes: [], colors: [], priceRange: [0, Infinity], sort: "newest" })}
                className="mt-4 text-sm text-rose-600 hover:text-rose-700"
              >
                Effacer les filtres
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filters drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFiltersOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-xl overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-stone-100">
              <h2 className="font-medium text-stone-900">Filtres</h2>
              <button onClick={() => setMobileFiltersOpen(false)} className="p-1 text-stone-400 hover:text-stone-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 space-y-6">
              {/* Same filters as desktop */}
              <div>
                <h3 className="text-sm font-medium text-stone-900 mb-3">Pointure</h3>
                <div className="flex flex-wrap gap-2">
                  {allSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => toggleSize(size)}
                      className={`w-10 h-10 rounded-lg text-sm border transition-colors ${
                        filters.sizes.includes(size)
                          ? "bg-stone-900 text-white border-stone-900"
                          : "bg-white text-stone-700 border-stone-200"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-stone-900 mb-3">Couleur</h3>
                <div className="space-y-2">
                  {allColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => toggleColor(color)}
                      className={`flex items-center gap-2 text-sm ${
                        filters.colors.includes(color) ? "text-stone-900 font-medium" : "text-stone-500"
                      }`}
                    >
                      <span className={`w-4 h-4 rounded-full border ${filters.colors.includes(color) ? "border-stone-900 ring-2 ring-stone-200" : "border-stone-200"}`} />
                      {color}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-stone-900 mb-3">Prix</h3>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <button
                      key={range.label}
                      onClick={() => setFilters((f) => ({ ...f, priceRange: [range.min, range.max] }))}
                      className={`block text-sm ${
                        filters.priceRange[0] === range.min && filters.priceRange[1] === range.max
                          ? "text-stone-900 font-medium"
                          : "text-stone-500"
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>
              {activeFilterCount > 0 && (
                <button
                  onClick={() => setFilters({ sizes: [], colors: [], priceRange: [0, Infinity], sort: "newest" })}
                  className="text-sm text-rose-600"
                >
                  Effacer les filtres
                </button>
              )}
            </div>
            <div className="p-4 border-t border-stone-100">
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full bg-stone-900 text-white py-3 rounded-full text-sm font-medium"
              >
                Voir {filteredProducts.length} produits
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
