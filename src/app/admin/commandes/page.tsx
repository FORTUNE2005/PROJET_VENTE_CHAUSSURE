"use client";

import { useState, useEffect, useMemo } from "react";

interface Order {
  id: string;
  customer: string;
  email: string;
  total: number;
  status: string;
  date: string;
  items: { name: string; qty: number; size: number }[];
}

const statusOptions = ["En attente", "En cours", "Expédiée", "Livrée", "Annulée"];
const statusColors: Record<string, string> = {
  "En attente": "bg-amber-100 text-amber-700",
  "En cours": "bg-blue-100 text-blue-700",
  "Expédiée": "bg-purple-100 text-purple-700",
  "Livrée": "bg-green-100 text-green-700",
  "Annulée": "bg-red-100 text-red-700",
};

const PER_PAGE = 10;

export default function AdminCommandesPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState("Toutes");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetch("/api/commandes")
      .then((r) => r.json())
      .then((data) => { setOrders(data); setLoading(false); });
  }, []);

  const filtered = filter === "Toutes" ? orders : orders.filter((o) => o.status === filter);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const counts = useMemo(() => {
    const c: Record<string, number> = { Toutes: orders.length };
    for (const o of orders) c[o.status] = (c[o.status] || 0) + 1;
    return c;
  }, [orders]);

  const handleFilter = (s: string) => { setFilter(s); setPage(1); };

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/commandes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o));
    }
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-bold text-stone-900">Commandes</h1>
        <p className="text-sm text-stone-500 mt-1">{orders.length} commandes au total</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {["Toutes", ...statusOptions].map((s) => (
          <button key={s} onClick={() => handleFilter(s)} className={`px-4 py-2 rounded-full text-sm transition-colors flex items-center gap-1.5 ${filter === s ? "bg-stone-900 text-white" : "bg-white border border-stone-200 text-stone-600 hover:border-stone-300"}`}>
            {s}
            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${filter === s ? "bg-white/20 text-white" : "bg-stone-100 text-stone-500"}`}>
              {counts[s] || 0}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-stone-400 py-8 text-center">Chargement...</p>
      ) : paginated.length === 0 ? (
        <p className="text-sm text-stone-400 py-8 text-center">Aucune commande pour ce filtre.</p>
      ) : (
        <>
          <div className="space-y-3">
            {paginated.map((order) => (
              <div key={order.id} className="bg-white rounded-xl border border-stone-100 overflow-hidden">
                <button onClick={() => setExpandedId(expandedId === order.id ? null : order.id)} className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-stone-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-sm font-medium text-stone-900">{order.id}</p>
                      <p className="text-xs text-stone-400">{order.date}</p>
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-sm text-stone-700">{order.customer}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[order.status] || ""}`}>{order.status}</span>
                    <span className="text-sm font-semibold text-stone-900">{order.total.toLocaleString("fr-FR")} F</span>
                    <svg className={`w-5 h-5 text-stone-400 transition-transform ${expandedId === order.id ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>
                </button>

                {expandedId === order.id && (
                  <div className="px-6 pb-6 border-t border-stone-100 pt-4">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-xs font-medium text-stone-400 uppercase tracking-wider mb-3">Articles</h3>
                        {order.items.map((item, i) => (
                          <div key={i} className="flex items-center justify-between py-2">
                            <span className="text-sm text-stone-700">{item.name} (Taille {item.size})</span>
                            <span className="text-sm text-stone-500">x{item.qty}</span>
                          </div>
                        ))}
                      </div>
                      <div>
                        <h3 className="text-xs font-medium text-stone-400 uppercase tracking-wider mb-3">Changer le statut</h3>
                        <select defaultValue={order.status} onChange={(e) => updateStatus(order.id, e.target.value)} className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200">
                          {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-xs text-stone-400">
                {filtered.length} résultat{filtered.length > 1 ? "s" : ""} — Page {page}/{totalPages}
              </p>
              <div className="flex gap-2">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 text-xs rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed">
                  ← Précédent
                </button>
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1.5 text-xs rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed">
                  Suivant →
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
