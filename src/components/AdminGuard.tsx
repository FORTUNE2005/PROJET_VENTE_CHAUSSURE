"use client";

import { useState, useEffect, ReactNode } from "react";

export default function AdminGuard({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    const ok = sessionStorage.getItem("lucia_admin_ok");
    if (ok === "1") setUnlocked(true);
    setLoading(false);
  }, []);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setChecking(true);
    setError("");
    try {
      const res = await fetch("/api/auth/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success) {
        sessionStorage.setItem("lucia_admin_ok", "1");
        setUnlocked(true);
      } else {
        setError("Mot de passe incorrect");
        setPassword("");
      }
    } catch {
      setError("Erreur de connexion");
    }
    setChecking(false);
  };

  if (loading) return null;

  if (unlocked) return <>{children}</>;

  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white font-serif">LUCIA Admin</h1>
          <p className="text-stone-400 text-sm mt-1">Accès restreint — mot de passe requis</p>
        </div>

        <form onSubmit={handleUnlock} className="bg-stone-900 rounded-2xl p-6 space-y-4">
          <div>
            <label className="text-xs text-stone-400 mb-1 block">Mot de passe administrateur</label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              className="w-full bg-stone-800 border border-stone-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-rose-500 transition-colors"
              placeholder="••••••••"
              autoFocus
            />
          </div>
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <button
            type="submit"
            disabled={checking}
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-medium py-3 rounded-xl transition-colors disabled:opacity-50"
          >
            {checking ? "Vérification..." : "Déverrouiller"}
          </button>
        </form>
      </div>
    </div>
  );
}
