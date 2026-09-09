"use client";

import { useState, useEffect } from "react";

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
}

export default function AdminClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/clients")
      .then((r) => r.json())
      .then((data) => { setClients(data); setLoading(false); });
  }, []);

  const filtered = clients.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-bold text-stone-900">Clients</h1>
        <p className="text-sm text-stone-500 mt-1">{clients.length} clients enregistrés</p>
      </div>

      <div className="mb-6">
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un client..." className="w-full max-w-md bg-white border border-stone-200 rounded-full px-5 py-2.5 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-200" />
      </div>

      {loading ? (
        <p className="text-sm text-stone-400 py-8 text-center">Chargement...</p>
      ) : (
        <div className="bg-white rounded-xl border border-stone-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stone-100">
                  <th className="text-left text-xs font-medium text-stone-400 uppercase tracking-wider px-6 py-3">Client</th>
                  <th className="text-left text-xs font-medium text-stone-400 uppercase tracking-wider px-6 py-3">Contact</th>
                  <th className="text-left text-xs font-medium text-stone-400 uppercase tracking-wider px-6 py-3">Inscrit le</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((client) => (
                  <tr key={client.id} className="border-b border-stone-50 last:border-0 hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-stone-200 rounded-full flex items-center justify-center shrink-0">
                          <span className="text-sm font-medium text-stone-600">{client.name.split(" ").map((n) => n[0]).join("")}</span>
                        </div>
                        <span className="text-sm font-medium text-stone-900">{client.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-stone-600">{client.email}</p>
                      <p className="text-xs text-stone-400">{client.phone}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-stone-500">{client.joinDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
