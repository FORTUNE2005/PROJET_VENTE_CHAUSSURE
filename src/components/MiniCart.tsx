"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";

interface MiniCartProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MiniCart({ isOpen, onClose }: MiniCartProps) {
  const { items, removeItem, updateQuantity, totalItems, totalPrice } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/30 z-[60]" onClick={onClose} />

      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-[70] flex flex-col animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
          <h2 className="font-medium text-stone-900">
            Mon panier {totalItems > 0 && <span className="text-stone-400 font-normal">({totalItems})</span>}
          </h2>
          <button onClick={onClose} className="p-1 text-stone-400 hover:text-stone-600 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <svg className="w-16 h-16 text-stone-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
              <p className="text-sm text-stone-500 mb-4">Votre panier est vide</p>
              <button onClick={onClose} className="text-sm text-stone-900 underline hover:no-underline">
                Continuer mes achats
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-4">
                  {/* Image */}
                  <Link href={`/produit/${item.slug}`} onClick={onClose} className="w-20 h-24 bg-stone-100 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <svg className="w-6 h-6 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                      </svg>
                    )}
                  </Link>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <Link
                          href={`/produit/${item.slug}`}
                          onClick={onClose}
                          className="text-sm font-medium text-stone-900 hover:text-stone-600 transition-colors line-clamp-1"
                        >
                          {item.name}
                        </Link>
                        <p className="text-xs text-stone-400 mt-0.5">
                          Taille {item.size} · {item.color}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id, item.size, item.color)}
                        className="text-stone-300 hover:text-rose-500 transition-colors p-0.5"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-stone-200 rounded-full">
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.color, -1)}
                          className="w-7 h-7 flex items-center justify-center text-stone-500 hover:text-stone-900 text-xs"
                        >
                          -
                        </button>
                        <span className="w-7 text-center text-xs font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.color, 1)}
                          className="w-7 h-7 flex items-center justify-center text-stone-500 hover:text-stone-900 text-xs"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-sm font-semibold text-stone-900">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-stone-100 px-6 py-4 space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-stone-500">Sous-total</span>
              <span className="font-semibold text-stone-900">{formatPrice(totalPrice)}</span>
            </div>
            <p className="text-xs text-stone-400">Livraison calculée à l&apos;étape suivante</p>
            <Link
              href="/panier"
              onClick={onClose}
              className="block w-full bg-stone-900 text-white py-3 rounded-full text-sm font-medium text-center hover:bg-stone-800 transition-colors"
            >
              Voir le panier
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
