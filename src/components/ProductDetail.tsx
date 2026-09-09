"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Product } from "@/data/types";
import { formatPrice } from "@/lib/format";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

interface ProductDetailProps {
  product: Product;
  similarProducts: Product[];
}

const reviews = [
  { id: 1, name: "Aya K.", rating: 5, date: "15 Août 2026", comment: "Superbe escarpin, très confortable même pour une longue soirée. La taille correspond parfaitement." },
  { id: 2, name: "Fatou D.", rating: 4, date: "10 Août 2026", comment: "Très joli modèle, la qualité est au rendez-vous. Livraison rapide." },
  { id: 3, name: "Marie C.", rating: 5, date: "2 Août 2026", comment: "J'adore ! Exactement comme sur la photo. Je recommande." },
];

export default function ProductDetail({ product, similarProducts }: ProductDetailProps) {
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "avis">("description");
  const [isFavorite, setIsFavorite] = useState(false);
  const { addItem } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    fetch(`/api/favoris?clientId=${user.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setIsFavorite(data.some((f: { id: string }) => f.id === product.id));
        }
      });
  }, [user, product.id]);

  const toggleFavorite = async () => {
    if (!user) return;
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
  };

  const handleAddToCart = () => {
    if (!selectedSize) return;
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        slug: product.slug,
        size: selectedSize,
        color: selectedColor,
        price: product.price,
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-stone-400 mb-8">
        <Link href="/" className="hover:text-stone-600">Accueil</Link>
        <span>/</span>
        <Link href={`/categories/${product.category.slug}`} className="hover:text-stone-600">{product.category.name}</Link>
        <span>/</span>
        <span className="text-stone-700">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-square rounded-2xl bg-stone-100 flex items-center justify-center overflow-hidden">
            {product.images && product.images.length > 0 ? (
              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <svg className="w-24 h-24 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
              </svg>
            )}
          </div>
          <div className="grid grid-cols-4 gap-3">
            {(product.images && product.images.length > 0 ? product.images.slice(0, 4) : [1, 2, 3, 4]).map((img, i) => (
              <div key={i} className="aspect-square rounded-lg bg-stone-100 flex items-center justify-center cursor-pointer border-2 border-stone-200 hover:border-stone-400 transition-colors overflow-hidden">
                {typeof img === "string" && img.startsWith("/") ? (
                  <img src={img} alt="" className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-6 h-6 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Product info */}
        <div className="space-y-6">
          <div>
            <p className="text-xs text-stone-400 uppercase tracking-wider mb-2">{product.category.name}</p>
            <h1 className="text-2xl lg:text-3xl font-serif font-bold text-stone-900">{product.name}</h1>
            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? "text-amber-400" : "text-stone-200"}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-stone-500">{product.rating} ({product.reviewCount} avis)</span>
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-bold text-stone-900">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <>
                <span className="text-lg text-stone-400 line-through">{formatPrice(product.originalPrice)}</span>
                <span className="bg-rose-100 text-rose-700 text-xs font-medium px-2 py-0.5 rounded-full">
                  -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                </span>
              </>
            )}
          </div>

          {/* Colors */}
          <div>
            <h3 className="text-sm font-medium text-stone-900 mb-3">Couleur : <span className="text-stone-500">{selectedColor}</span></h3>
            <div className="flex gap-2">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                    selectedColor === color
                      ? "bg-stone-900 text-white border-stone-900"
                      : "bg-white text-stone-700 border-stone-200 hover:border-stone-300"
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-stone-900">Pointure</h3>
              <button className="text-xs text-rose-600 hover:text-rose-700 underline">Guide des tailles</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-12 h-12 rounded-lg text-sm border font-medium transition-colors ${
                    selectedSize === size
                      ? "bg-stone-900 text-white border-stone-900"
                      : "bg-white text-stone-700 border-stone-200 hover:border-stone-300"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity & Add to cart */}
          <div className="flex items-center gap-4">
            <div className="flex items-center border border-stone-200 rounded-full">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center text-stone-600 hover:text-stone-900"
              >
                -
              </button>
              <span className="w-10 text-center text-sm font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 flex items-center justify-center text-stone-600 hover:text-stone-900"
              >
                +
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={!selectedSize}
              className="flex-1 bg-stone-900 text-white py-3.5 rounded-full text-sm font-medium hover:bg-stone-800 transition-colors disabled:bg-stone-300 disabled:cursor-not-allowed"
            >
              {selectedSize ? "Ajouter au panier" : "Choisissez une taille"}
            </button>
            <button onClick={toggleFavorite} className={`p-3 border rounded-full transition-colors ${isFavorite ? "bg-rose-50 border-rose-200 text-rose-500" : "border-stone-200 text-stone-400 hover:text-rose-500 hover:border-rose-200"}`}>
              <svg className="w-5 h-5" fill={isFavorite ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
            </button>
          </div>

          {/* Reassurance */}
          <div className="border-t border-stone-100 pt-6 space-y-3">
            <div className="flex items-center gap-3 text-sm text-stone-600">
              <svg className="w-5 h-5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H18.75m-7.5-3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
              Livraison gratuite dès 45 000 F
            </div>
            <div className="flex items-center gap-3 text-sm text-stone-600">
              <svg className="w-5 h-5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
              </svg>
              Retours gratuits sous 30 jours
            </div>
            <div className="flex items-center gap-3 text-sm text-stone-600">
              <svg className="w-5 h-5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
              </svg>
              Paiement à la livraison disponible
            </div>
          </div>

          {/* Tabs */}
          <div className="border-t border-stone-100 pt-6">
            <div className="flex gap-6 border-b border-stone-100">
              <button
                onClick={() => setActiveTab("description")}
                className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "description"
                    ? "border-stone-900 text-stone-900"
                    : "border-transparent text-stone-400 hover:text-stone-600"
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab("avis")}
                className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "avis"
                    ? "border-stone-900 text-stone-900"
                    : "border-transparent text-stone-400 hover:text-stone-600"
                }`}
              >
                Avis ({reviews.length})
              </button>
            </div>

            {activeTab === "description" ? (
              <div className="py-6 space-y-4">
                <p className="text-sm text-stone-600 leading-relaxed">{product.description}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-stone-400">Matière</span>
                    <p className="text-stone-700 mt-0.5">{product.material}</p>
                  </div>
                  <div>
                    <span className="text-stone-400">Catégorie</span>
                    <p className="text-stone-700 mt-0.5">{product.category.name}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-6 space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-stone-50 pb-4 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-stone-900">{review.name}</span>
                      <span className="text-xs text-stone-400">{review.date}</span>
                    </div>
                    <div className="flex gap-0.5 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-3 h-3 ${i < review.rating ? "text-amber-400" : "text-stone-200"}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-sm text-stone-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Similar products */}
      {similarProducts.length > 0 && (
        <section className="mt-16 lg:mt-24">
          <h2 className="text-xl lg:text-2xl font-serif font-bold text-stone-900 mb-8">Vous aimerez aussi</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {similarProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
