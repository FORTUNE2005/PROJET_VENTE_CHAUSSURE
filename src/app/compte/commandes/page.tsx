"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { formatPrice } from "@/lib/format";

interface Order {
  id: string;
  total: number;
  status: string;
  date: string;
  items: string;
}

export default function CommandesPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    fetch(`/api/commandes?clientId=${user.id}`)
      .then((r) => r.json())
      .then((data) => { setOrders(Array.isArray(data) ? data : []); setLoading(false); });
  }, [user]);

  return (
    <div>
      <nav className="flex items-center gap-2 text-xs text-stone-400 mb-6">
        <Link href="/" className="hover:text-stone-600">Accueil</Link>
        <span>/</span>
        <Link href="/compte" className="hover:text-stone-600">Mon compte</Link>
        <span>/</span>
        <span className="text-stone-700">Mes commandes</span>
      </nav>
      <h2 className="font-medium text-stone-900 mb-6">Mes commandes</h2>

      {!user ? (
        <div className="text-center py-12 bg-stone-50 rounded-xl">
          <p className="text-sm text-stone-500 mb-4">Connectez-vous pour voir vos commandes.</p>
          <Link href="/auth/login" className="text-sm text-stone-900 underline hover:no-underline">Se connecter</Link>
        </div>
      ) : loading ? (
        <p className="text-sm text-stone-400 text-center py-8">Chargement...</p>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 bg-stone-50 rounded-xl">
          <p className="text-sm text-stone-500 mb-4">Vous n&apos;avez pas encore de commande.</p>
          <Link href="/" className="text-sm text-stone-900 underline hover:no-underline">Commencer vos achats</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            let itemCount = 0;
            try { itemCount = JSON.parse(order.items).length; } catch {}
            return (
              <div key={order.id} className="bg-white border border-stone-100 rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-medium text-stone-900">Commande #{order.id}</p>
                    <p className="text-xs text-stone-400 mt-0.5">
                      {new Date(order.date).toLocaleDateString("fr-FR")} · {itemCount} article{itemCount > 1 ? "s" : ""}
                    </p>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    order.status === "Livrée" ? "bg-green-100 text-green-700" :
                    order.status === "En cours" ? "bg-blue-100 text-blue-700" :
                    "bg-amber-100 text-amber-700"
                  }`}>
                    {order.status}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-stone-50">
                  <span className="text-sm text-stone-500">Total</span>
                  <span className="text-sm font-semibold text-stone-900">{formatPrice(order.total)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
