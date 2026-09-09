"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      router.push("/compte");
    } else {
      setError(result.error || "Erreur de connexion");
    }
  };

  return (
    <>
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <nav className="flex items-center gap-2 text-xs text-stone-400 mb-6">
          <Link href="/" className="hover:text-stone-600">Accueil</Link>
          <span>/</span>
          <span className="text-stone-700">Connexion</span>
        </nav>
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-serif font-bold text-stone-900 mb-2">Connexion</h1>
          <p className="text-sm text-stone-500 mb-8">Accédez à votre espace personnel</p>

          {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-6">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Mot de passe</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200" />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-stone-900 text-white py-3.5 rounded-full text-sm font-medium hover:bg-stone-800 transition-colors disabled:opacity-50">
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          <p className="text-sm text-stone-500 text-center mt-6">
            Pas encore de compte ?{" "}
            <Link href="/auth/register" className="text-stone-900 font-medium hover:underline">Créer un compte</Link>
          </p>

          <div className="mt-8 p-4 bg-stone-50 rounded-lg">
            <p className="text-xs text-stone-400 text-center">
              <strong>Compte de test :</strong> aya.kone@email.com / password123
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
