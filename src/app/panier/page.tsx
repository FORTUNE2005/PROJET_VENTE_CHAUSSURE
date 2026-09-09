"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalItems, totalPrice } = useCart();

  const shipping = totalPrice >= 45000 ? 0 : 2500;
  const total = totalPrice + shipping;

  return (
    <>
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <nav className="flex items-center gap-2 text-xs text-stone-400 mb-6">
          <Link href="/" className="hover:text-stone-600">Accueil</Link>
          <span>/</span>
          <span className="text-stone-700">Panier</span>
        </nav>
        <h1 className="text-2xl lg:text-3xl font-serif font-bold text-stone-900 mb-8">Mon panier</h1>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <svg className="w-16 h-16 text-stone-200 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            <p className="text-stone-500 mb-6">Votre panier est vide</p>
            <Link href="/" className="inline-flex bg-stone-900 text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-stone-800 transition-colors">
              Continuer mes achats
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Cart items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-4 bg-white border border-stone-100 rounded-xl p-4">
                  <Link href={`/produit/${item.slug}`} className="w-24 h-28 bg-stone-100 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                    <svg className="w-8 h-8 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                    </svg>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <Link href={`/produit/${item.slug}`} className="text-sm font-medium text-stone-900 hover:text-stone-700">{item.name}</Link>
                        <p className="text-xs text-stone-400 mt-0.5">Taille : {item.size} · {item.color}</p>
                      </div>
                      <button onClick={() => removeItem(item.id, item.size, item.color)} className="text-stone-400 hover:text-rose-500 transition-colors p-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-stone-200 rounded-full">
                        <button onClick={() => updateQuantity(item.id, item.size, item.color, -1)} className="w-8 h-8 flex items-center justify-center text-stone-500 hover:text-stone-900 text-sm">-</button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.size, item.color, 1)} className="w-8 h-8 flex items-center justify-center text-stone-500 hover:text-stone-900 text-sm">+</button>
                      </div>
                      <span className="text-sm font-semibold text-stone-900">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-stone-50 rounded-xl p-6 space-y-4 sticky top-24">
                <h2 className="font-medium text-stone-900">Récapitulatif</h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-stone-600">
                    <span>Sous-total ({totalItems} articles)</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Livraison</span>
                    <span>{shipping === 0 ? <span className="text-green-600">Gratuite</span> : formatPrice(shipping)}</span>
                  </div>
                  <div className="border-t border-stone-200 pt-3 flex justify-between font-semibold text-stone-900">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                <Link
                  href="/panier/commande"
                  className="block w-full bg-stone-900 text-white py-3.5 rounded-full text-sm font-medium text-center hover:bg-stone-800 transition-colors"
                >
                  Passer la commande
                </Link>

                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2 text-xs text-stone-500">
                    <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    Paiement à la livraison disponible
                  </div>
                  <div className="flex items-center gap-2 text-xs text-stone-500">
                    <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    Retours gratuits sous 30 jours
                  </div>
                </div>

                <Link href="/" className="block text-center text-xs text-stone-500 hover:text-stone-700 pt-2">
                  Continuer mes achats
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
