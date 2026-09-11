"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/data/types";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetch(`/api/favoris?clientId=${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setIsFavorite(data.some((f: { productId: string }) => f.productId === product.id));
        }
      })
      .catch(() => {});
  }, [user, product.id]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      size: product.sizes[0],
      color: product.colors[0],
      price: product.price,
      image: product.images?.[0] || undefined,
    });
  };

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      router.push("/auth/login");
      return;
    }
    try {
      if (isFavorite) {
        await fetch("/api/favoris", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ clientId: user.id, productId: product.id }),
        });
        setIsFavorite(false);
      } else {
        await fetch("/api/favoris", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ clientId: user.id, productId: product.id }),
        });
        setIsFavorite(true);
      }
    } catch {}
  };

  return (
    <Link href={`/produit/${product.slug}`} className="group block">
      {/* Image container */}
      <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-stone-100 mb-3">
        {product.images && product.images.length > 0 ? (
          <img src={product.images[0]} alt={product.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-stone-200 to-stone-100 flex items-center justify-center">
            <svg className="w-12 h-12 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
            </svg>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isNew && (
            <span className="bg-stone-900 text-white text-[10px] font-medium uppercase tracking-wider px-2.5 py-1 rounded-full">
              Nouveau
            </span>
          )}
          {product.originalPrice && (
            <span className="bg-rose-600 text-white text-[10px] font-medium uppercase tracking-wider px-2.5 py-1 rounded-full">
              -{Math.round((1 - product.price / product.originalPrice) * 100)}%
            </span>
          )}
          {product.isBestSeller && !product.isNew && (
            <span className="bg-amber-500 text-white text-[10px] font-medium uppercase tracking-wider px-2.5 py-1 rounded-full">
              Best-seller
            </span>
          )}
        </div>

        {/* Quick add button */}
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={handleAddToCart}
            className="w-full bg-white/95 backdrop-blur-sm text-stone-900 text-sm font-medium py-2.5 rounded-lg hover:bg-white transition-colors shadow-lg"
          >
            Ajouter au panier
          </button>
        </div>

        {/* Favorite button */}
        <button
          className={`absolute top-3 right-3 p-2 backdrop-blur-sm rounded-full transition-colors shadow-sm ${
            isFavorite
              ? "bg-rose-500 text-white"
              : "bg-white/80 text-stone-400 hover:text-rose-500"
          }`}
          onClick={handleToggleFavorite}
          aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
          <svg className="w-4 h-4" fill={isFavorite ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
          </svg>
        </button>
      </div>

      {/* Info */}
      <div className="space-y-1">
        <p className="text-xs text-stone-400 uppercase tracking-wider">{product.category.name}</p>
        <h3 className="text-sm font-medium text-stone-800 group-hover:text-stone-950 transition-colors line-clamp-1">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-stone-900">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="text-xs text-stone-400 line-through">{formatPrice(product.originalPrice)}</span>
          )}
        </div>
        {/* Rating */}
        <div className="flex items-center gap-1 pt-0.5">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-3 h-3 ${i < Math.floor(product.rating) ? "text-amber-400" : "text-stone-200"}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-[11px] text-stone-400">({product.reviewCount})</span>
        </div>
        {/* Colors */}
        <div className="flex items-center gap-1.5 pt-1">
          {product.colors.map((color) => (
            <span key={color} className="text-[11px] text-stone-400">
              {color}
              {product.colors.indexOf(color) < product.colors.length - 1 && " ·"}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
