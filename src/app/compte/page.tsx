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

export default function ComptePage() {
  const { user } = useAuth();
  const firstName = user?.name?.split(" ")[0] || "Client";
  const [orders, setOrders] = useState<Order[]>([]);
  const [favCount, setFavCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    fetch(`/api/commandes?clientId=${user.id}`)
      .then((r) => r.json())
      .then((data) => setOrders(Array.isArray(data) ? data : []));
    fetch(`/api/favoris?clientId=${user.id}`)
      .then((r) => r.json())
      .then((data) => setFavCount(Array.isArray(data) ? data.length : 0));
  }, [user]);

  const lastOrder = orders[0];
  const lastOrderItems = lastOrder ? (() => { try { return JSON.parse(lastOrder.items); } catch { return []; } })() : [];

  return (
    <div className="space-y-6">
      <nav className="flex items-center gap-2 text-xs text-stone-400 mb-6">
        <Link href="/" className="hover:text-stone-600">Accueil</Link>
        <span>/</span>
        <span className="text-stone-700">Mon compte</span>
      </nav>
      <div className="bg-stone-50 rounded-2xl p-6">
        <h2 className="font-medium text-stone-900 mb-1">Bonjour, {firstName} !</h2>
        <p className="text-sm text-stone-500">Bienvenue dans votre espace client.</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-white border border-stone-100 rounded-xl p-5">
          <p className="text-2xl font-bold text-stone-900">{orders.length}</p>
          <p className="text-sm text-stone-500 mt-1">Commande{orders.length > 1 ? "s" : ""}</p>
        </div>
        <div className="bg-white border border-stone-100 rounded-xl p-5">
          <p className="text-2xl font-bold text-stone-900">{favCount}</p>
          <p className="text-sm text-stone-500 mt-1">Favori{favCount > 1 ? "s" : ""}</p>
        </div>
        <div className="bg-white border border-stone-100 rounded-xl p-5">
          <p className="text-2xl font-bold text-stone-900">{orders.length > 0 ? formatPrice(orders.reduce((s, o) => s + o.total, 0)) : "0 F"}</p>
          <p className="text-sm text-stone-500 mt-1">Total dépensé</p>
        </div>
      </div>

      {lastOrder ? (
        <div className="bg-white border border-stone-100 rounded-xl p-6">
          <h3 className="font-medium text-stone-900 mb-4">Dernière commande</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-stone-700">Commande #{lastOrder.id}</p>
              <p className="text-xs text-stone-400 mt-0.5">
                {new Date(lastOrder.date).toLocaleDateString("fr-FR")} · {lastOrderItems.length} article{lastOrderItems.length > 1 ? "s" : ""} · {formatPrice(lastOrder.total)}
              </p>
            </div>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
              lastOrder.status === "Livrée" ? "bg-green-100 text-green-700" :
              lastOrder.status === "En cours" ? "bg-blue-100 text-blue-700" :
              "bg-amber-100 text-amber-700"
            }`}>
              {lastOrder.status}
            </span>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-stone-100 rounded-xl p-6 text-center">
          <p className="text-sm text-stone-400">Aucune commande pour l&apos;instant.</p>
          <Link href="/" className="text-sm text-stone-900 font-medium hover:underline mt-2 inline-block">
            Découvrir nos produits
          </Link>
        </div>
      )}
    </div>
  );
}
