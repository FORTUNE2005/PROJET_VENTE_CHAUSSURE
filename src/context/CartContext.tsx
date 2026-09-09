"use client";

import { createContext, useContext, useState, useCallback, useRef, ReactNode } from "react";

export interface CartItem {
  id: string;
  name: string;
  slug: string;
  size: number;
  color: string;
  price: number;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string, size: number, color: string) => void;
  updateQuantity: (id: string, size: number, color: string, delta: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  justAdded: boolean;
  resetJustAdded: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [justAdded, setJustAdded] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const addItem = useCallback((newItem: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existing = prev.find(
        (item) => item.id === newItem.id && item.size === newItem.size && item.color === newItem.color
      );
      if (existing) {
        return prev.map((item) =>
          item.id === newItem.id && item.size === newItem.size && item.color === newItem.color
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...newItem, quantity: 1 }];
    });

    if (timerRef.current) clearTimeout(timerRef.current);
    setJustAdded(true);
    timerRef.current = setTimeout(() => setJustAdded(false), 3000);
  }, []);

  const removeItem = useCallback((id: string, size: number, color: string) => {
    setItems((prev) => prev.filter((item) => !(item.id === id && item.size === size && item.color === color)));
  }, []);

  const updateQuantity = useCallback((id: string, size: number, color: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) =>
          item.id === id && item.size === size && item.color === color
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const resetJustAdded = useCallback(() => setJustAdded(false), []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice, justAdded, resetJustAdded }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
