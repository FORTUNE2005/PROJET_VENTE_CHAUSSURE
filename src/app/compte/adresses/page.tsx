"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

interface Address {
  id: string;
  label: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  isDefault: number;
}

export default function AdressesPage() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ label: "", name: "", phone: "", address: "", city: "Abidjan", isDefault: false });

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    fetch(`/api/adresses?clientId=${user.id}`)
      .then((r) => r.json())
      .then((data) => { setAddresses(Array.isArray(data) ? data : []); setLoading(false); });
  }, [user]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const res = await fetch("/api/adresses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId: user.id, ...form }),
    });
    if (res.ok) {
      const newAddr = await res.json();
      setAddresses((prev) => {
        const updated = form.isDefault ? prev.map((a) => ({ ...a, isDefault: 0 })) : prev;
        return [newAddr, ...updated];
      });
      setForm({ label: "", name: user.name || "", phone: user.phone || "", address: "", city: "Abidjan", isDefault: false });
      setShowForm(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    await fetch("/api/adresses", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, clientId: user.id }),
    });
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSetDefault = async (id: string) => {
    if (!user) return;
    await fetch("/api/adresses", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: "__set_default__", clientId: user.id }),
    });
    await fetch("/api/adresses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId: user.id, label: "", name: "", phone: "", address: "", city: "", isDefault: false }),
    });
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id ? 1 : 0 })));
  };

  return (
    <div>
      <nav className="flex items-center gap-2 text-xs text-stone-400 mb-6">
        <Link href="/" className="hover:text-stone-600">Accueil</Link>
        <span>/</span>
        <Link href="/compte" className="hover:text-stone-600">Mon compte</Link>
        <span>/</span>
        <span className="text-stone-700">Mes adresses</span>
      </nav>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-medium text-stone-900">Mes adresses</h2>
        <button onClick={() => setShowForm(!showForm)} className="text-sm text-stone-600 hover:text-stone-900 underline">
          {showForm ? "Annuler" : "+ Ajouter une adresse"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-stone-50 rounded-xl p-6 mb-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Label</label>
            <input type="text" required value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })}
              placeholder="Ex: Domicile, Bureau..." className="w-full bg-white border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Nom complet</label>
              <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-white border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Téléphone</label>
              <input type="tel" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full bg-white border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Adresse</label>
            <input type="text" required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full bg-white border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Ville</label>
              <select value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full bg-white border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200">
                <option>Abidjan</option>
                <option>Bouaké</option>
                <option>Daloa</option>
                <option>Korhogo</option>
                <option>Yamoussoukro</option>
                <option>San-Pédro</option>
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm text-stone-700 cursor-pointer pb-2.5">
                <input type="checkbox" checked={form.isDefault} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} className="rounded border-stone-300" />
                Adresse par défaut
              </label>
            </div>
          </div>
          <button type="submit" className="bg-stone-900 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-stone-800 transition-colors">
            Enregistrer
          </button>
        </form>
      )}

      {!user ? (
        <div className="text-center py-12 bg-stone-50 rounded-xl">
          <p className="text-sm text-stone-500 mb-4">Connectez-vous pour gérer vos adresses.</p>
          <Link href="/auth/login" className="text-sm text-stone-900 underline hover:no-underline">Se connecter</Link>
        </div>
      ) : loading ? (
        <p className="text-sm text-stone-400 text-center py-8">Chargement...</p>
      ) : addresses.length === 0 ? (
        <div className="text-center py-12 bg-stone-50 rounded-xl">
          <p className="text-sm text-stone-500 mb-4">Vous n&apos;avez pas encore d&apos;adresse enregistrée.</p>
          <button onClick={() => setShowForm(true)} className="text-sm text-stone-900 underline hover:no-underline">
            Ajouter une adresse
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div key={addr.id} className={`border rounded-xl p-5 ${addr.isDefault ? "border-stone-900" : "border-stone-100"}`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-stone-900">{addr.label}</span>
                {addr.isDefault ? (
                  <span className="text-[10px] uppercase tracking-wider bg-stone-900 text-white px-2 py-0.5 rounded-full">Par défaut</span>
                ) : (
                  <button onClick={() => handleSetDefault(addr.id)} className="text-[10px] uppercase tracking-wider text-stone-400 hover:text-stone-700">
                    Définir par défaut
                  </button>
                )}
              </div>
              <p className="text-sm text-stone-600">{addr.name}</p>
              <p className="text-sm text-stone-500">{addr.address}</p>
              <p className="text-sm text-stone-500">{addr.city}</p>
              <p className="text-sm text-stone-500 mt-2">{addr.phone}</p>
              <div className="flex gap-4 mt-4 pt-3 border-t border-stone-50">
                <button onClick={() => handleDelete(addr.id)} className="text-xs text-stone-500 hover:text-red-600">Supprimer</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
