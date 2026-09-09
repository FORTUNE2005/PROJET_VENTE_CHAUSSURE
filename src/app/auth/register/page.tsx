"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }
    setLoading(true);
    const result = await register(name, email, password, phone);
    setLoading(false);
    if (result.success) {
      router.push("/compte");
    } else {
      setError(result.error || "Erreur d'inscription");
    }
  };

  return (
    <>
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <nav className="flex items-center gap-2 text-xs text-stone-400 mb-6">
          <Link href="/" className="hover:text-stone-600">Accueil</Link>
          <span>/</span>
          <span className="text-stone-700">Inscription</span>
        </nav>
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-serif font-bold text-stone-900 mb-2">Créer un compte</h1>
          <p className="text-sm text-stone-500 mb-8">Rejoignez Lucia Chaussures</p>

          {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-6">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Nom complet *</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Email *</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Téléphone</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+225 07 08 09 10" className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Mot de passe *</label>
              <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200" />
              <p className="text-xs text-stone-400 mt-1">Minimum 6 caractères</p>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-stone-900 text-white py-3.5 rounded-full text-sm font-medium hover:bg-stone-800 transition-colors disabled:opacity-50">
              {loading ? "Création..." : "Créer mon compte"}
            </button>
          </form>

          <p className="text-sm text-stone-500 text-center mt-6">
            Déjà un compte ?{" "}
            <Link href="/auth/login" className="text-stone-900 font-medium hover:underline">Se connecter</Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
