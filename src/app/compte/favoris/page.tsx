"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { formatPrice } from "@/lib/format";

interface FavProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string;
  category: string;
}

export default function FavorisPage() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<FavProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    fetch(`/api/favoris?clientId=${user.id}`)
      .then((r) => r.json())
      .then((data) => { setFavorites(Array.isArray(data) ? data : []); setLoading(false); });
  }, [user]);

  const removeFavorite = async (productId: string) => {
    if (!user) return;
    await fetch("/api/favoris", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId: user.id, productId }),
    });
    setFavorites((prev) => prev.filter((f) => f.id !== productId));
  };

  const parseImages = (val: string): string[] => {
    try { return JSON.parse(val); } catch { return []; }
  };

  return (
    <div>
      <nav className="flex items-center gap-2 text-xs text-stone-400 mb-6">
        <Link href="/" className="hover:text-stone-600">Accueil</Link>
        <span>/</span>
        <Link href="/compte" className="hover:text-stone-600">Mon compte</Link>
        <span>/</span>
        <span className="text-stone-700">Favoris</span>
      </nav>
      <h2 className="font-medium text-stone-900 mb-6">Mes favoris</h2>

      {!user ? (
        <div className="text-center py-12 bg-stone-50 rounded-xl">
          <p className="text-sm text-stone-500 mb-4">Connectez-vous pour voir vos favoris.</p>
          <Link href="/auth/login" className="text-sm text-stone-900 underline hover:no-underline">Se connecter</Link>
        </div>
      ) : loading ? (
        <p className="text-sm text-stone-400 text-center py-8">Chargement...</p>
      ) : favorites.length === 0 ? (
        <div className="text-center py-12 bg-stone-50 rounded-xl">
          <p className="text-sm text-stone-500 mb-4">Vous n&apos;avez pas encore de favoris.</p>
          <Link href="/" className="text-sm text-stone-900 underline hover:no-underline">Découvrir nos produits</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {favorites.map((product) => {
            const images = parseImages(product.images);
            return (
              <div key={product.id} className="flex gap-4 bg-white border border-stone-100 rounded-xl p-4">
                <Link href={`/produit/${product.slug}`} className="w-20 h-20 bg-stone-100 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                  {images[0] ? (
                    <img src={images[0]} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <svg className="w-8 h-8 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                    </svg>
                  )}
                </Link>
                <div className="flex-1 min-w-0 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-stone-400 uppercase tracking-wider">{product.category}</p>
                    <Link href={`/produit/${product.slug}`} className="text-sm font-medium text-stone-900 hover:text-stone-700">{product.name}</Link>
                    <p className="text-sm font-semibold text-stone-900 mt-1">{formatPrice(product.price)}</p>
                  </div>
                  <button onClick={() => removeFavorite(product.id)} className="text-rose-400 hover:text-rose-500 p-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
