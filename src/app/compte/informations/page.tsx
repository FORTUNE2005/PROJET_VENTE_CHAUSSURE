"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function InformationsPage() {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [password, setPassword] = useState({ current: "", new: "", confirm: "" });
  const [passwordMsg, setPasswordMsg] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || "", email: user.email || "", phone: user.phone || "" });
    }
  }, [user]);

  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setError("");
    setSaved(false);
    const res = await fetch("/api/user", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: user.id, name: form.name, email: form.email, phone: form.phone }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.success) {
      setSaved(true);
      localStorage.setItem("lucia_user", JSON.stringify(data.user));
    } else {
      setError(data.error || "Erreur lors de la sauvegarde");
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setPasswordMsg("");
    if (password.new !== password.confirm) {
      setPasswordMsg("Les mots de passe ne correspondent pas");
      return;
    }
    if (password.new.length < 6) {
      setPasswordMsg("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }
    setPasswordLoading(true);
    const res = await fetch("/api/user", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: user.id, currentPassword: password.current, newPassword: password.new }),
    });
    const data = await res.json();
    setPasswordLoading(false);
    if (data.success) {
      setPasswordMsg("Mot de passe modifié avec succès");
      setPassword({ current: "", new: "", confirm: "" });
    } else {
      setPasswordMsg(data.error || "Erreur lors du changement de mot de passe");
    }
  };

  return (
    <div>
      <nav className="flex items-center gap-2 text-xs text-stone-400 mb-6">
        <Link href="/" className="hover:text-stone-600">Accueil</Link>
        <span>/</span>
        <Link href="/compte" className="hover:text-stone-600">Mon compte</Link>
        <span>/</span>
        <span className="text-stone-700">Mes informations</span>
      </nav>
      <h2 className="font-medium text-stone-900 mb-6">Mes informations</h2>

      {saved && (
        <div className="bg-green-50 text-green-700 text-sm px-4 py-3 rounded-xl mb-6">
          Informations mises à jour avec succès.
        </div>
      )}
      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-6">
          {error}
        </div>
      )}

      {!user ? (
        <div className="text-center py-12 bg-stone-50 rounded-xl">
          <p className="text-sm text-stone-500 mb-4">Connectez-vous pour gérer vos informations.</p>
          <Link href="/auth/login" className="text-sm text-stone-900 underline hover:no-underline">Se connecter</Link>
        </div>
      ) : (
        <>
          <form onSubmit={handleSaveInfo} className="space-y-4 mb-10">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Nom complet</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-white border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-white border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Téléphone</label>
              <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full bg-white border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200" />
            </div>
            <button type="submit" disabled={loading} className="bg-stone-900 text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-stone-800 transition-colors disabled:opacity-50">
              {loading ? "Enregistrement..." : "Enregistrer"}
            </button>
          </form>

          <div className="border-t border-stone-100 pt-8">
            <h3 className="font-medium text-stone-900 mb-4">Changer le mot de passe</h3>
            {passwordMsg && (
              <div className={`text-sm px-4 py-3 rounded-xl mb-4 ${passwordMsg.includes("succès") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                {passwordMsg}
              </div>
            )}
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Mot de passe actuel</label>
                <input type="password" required value={password.current} onChange={(e) => setPassword({ ...password, current: e.target.value })}
                  className="w-full bg-white border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">Nouveau mot de passe</label>
                  <input type="password" required minLength={6} value={password.new} onChange={(e) => setPassword({ ...password, new: e.target.value })}
                    className="w-full bg-white border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">Confirmer</label>
                  <input type="password" required value={password.confirm} onChange={(e) => setPassword({ ...password, confirm: e.target.value })}
                    className="w-full bg-white border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200" />
                </div>
              </div>
              <button type="submit" disabled={passwordLoading} className="border border-stone-200 text-stone-700 px-6 py-2.5 rounded-full text-sm font-medium hover:bg-stone-50 transition-colors disabled:opacity-50">
                {passwordLoading ? "Modification..." : "Modifier le mot de passe"}
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
