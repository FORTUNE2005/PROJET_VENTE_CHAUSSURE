"use client";

import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import FloatingCartButton from "./FloatingCartButton";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        {children}
        <FloatingCartButton />
      </CartProvider>
    </AuthProvider>
  );
}
