"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import MiniCart from "./MiniCart";

export default function FloatingCartButton() {
  const [cartOpen, setCartOpen] = useState(false);
  const [pulse, setPulse] = useState(false);
  const { totalItems, justAdded, resetJustAdded } = useCart();

  useEffect(() => {
    if (justAdded) {
      setPulse(true);
      resetJustAdded();
      const timer = setTimeout(() => setPulse(false), 800);
      return () => clearTimeout(timer);
    }
  }, [justAdded, resetJustAdded]);

  return (
    <>
      {/* Floating cart button */}
      <button
        onClick={() => setCartOpen(true)}
        className={`fixed bottom-6 right-6 z-[55] bg-stone-900 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-stone-800 transition-all hover:scale-105 ${pulse ? "animate-cart-bounce" : ""}`}
        aria-label="Ouvrir le panier"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
        </svg>
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </button>

      <MiniCart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
