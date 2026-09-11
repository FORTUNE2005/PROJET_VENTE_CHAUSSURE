"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import MiniCart from "./MiniCart";

const navLinks = [
  { href: "/nouveautes", label: "Nouveautés" },
  { href: "/categories/baskets", label: "Baskets" },
  { href: "/categories/escarpins-talons", label: "Escarpins" },
  { href: "/categories/sandales", label: "Sandales" },
  { href: "/categories/bottes-bottines", label: "Bottes" },
  { href: "/promotions", label: "Promotions", highlight: true },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/recherche?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-stone-100">
        {/* Top bar */}
        <div className="bg-stone-900 text-white text-center text-xs py-2 px-4 tracking-wide">
          Livraison gratuite à partir de 45 000 F d&apos;achat
        </div>

        {/* Main header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 -ml-2 text-stone-700 hover:text-stone-900"
              aria-label="Menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                )}
              </svg>
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl lg:text-2xl font-serif font-bold tracking-tight text-stone-900">
                LUCIA
              </span>
              <span className="hidden sm:block text-[10px] uppercase tracking-[0.2em] text-stone-400 mt-1">
                Chaussures
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm tracking-wide transition-colors hover:text-stone-900 ${
                    link.highlight
                      ? "text-rose-600 font-medium hover:text-rose-700"
                      : "text-stone-600"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-stone-600 hover:text-stone-900 transition-colors"
                aria-label="Rechercher"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </button>

              {/* Account */}
              {user ? (
                <div className="hidden sm:block relative group">
                  <button className="p-2 text-stone-600 hover:text-stone-900 transition-colors" aria-label="Mon compte">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                  </button>
                  <div className="absolute right-0 top-full pt-1 hidden group-hover:block z-50">
                    <div className="bg-white border border-stone-100 rounded-xl shadow-lg py-2 min-w-[180px]">
                      <div className="px-4 py-2 border-b border-stone-100">
                        <p className="text-xs text-stone-400">Connecté(e) en tant que</p>
                        <p className="text-sm font-medium text-stone-900 truncate">{user.name || user.email}</p>
                      </div>
                      <Link href="/compte" className="block px-4 py-2 text-sm text-stone-700 hover:bg-stone-50">Mon compte</Link>
                      <Link href="/compte/commandes" className="block px-4 py-2 text-sm text-stone-700 hover:bg-stone-50">Mes commandes</Link>
                      <Link href="/favoris" className="block px-4 py-2 text-sm text-stone-700 hover:bg-stone-50">Mes favoris</Link>
                      <button onClick={() => { logout(); router.push("/"); }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 border-t border-stone-100 mt-1">
                        Déconnexion
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link href="/auth/login" className="hidden sm:block p-2 text-stone-600 hover:text-stone-900 transition-colors" aria-label="Connexion">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                </Link>
              )}

              {/* Favorites */}
              <Link
                href="/favoris"
                className="hidden sm:block p-2 text-stone-600 hover:text-stone-900 transition-colors"
                aria-label="Mes favoris"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                </svg>
              </Link>

              {/* Cart icon in header - opens MiniCart */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2 text-stone-600 hover:text-stone-900 transition-colors"
                aria-label="Mon panier"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-rose-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="border-t border-stone-100 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher une paire..."
                  className="w-full bg-stone-50 border border-stone-200 rounded-full px-5 py-3 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-200 focus:border-stone-300"
                  autoFocus
                />
                <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2">
                  <svg className="w-4 h-4 text-stone-400 hover:text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-stone-100 bg-white">
            <nav className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    link.highlight
                      ? "text-rose-600 font-medium bg-rose-50"
                      : "text-stone-700 hover:bg-stone-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-stone-100 mt-2 pt-2">
                {user ? (
                  <>
                    <div className="px-3 py-2">
                      <p className="text-xs text-stone-400">Connecté(e) en tant que</p>
                      <p className="text-sm font-medium text-stone-900 truncate">{user.name || user.email}</p>
                    </div>
                    <Link href="/compte" className="block px-3 py-2.5 rounded-lg text-sm text-stone-700 hover:bg-stone-50">
                      Mon compte
                    </Link>
                    <Link href="/compte/commandes" className="block px-3 py-2.5 rounded-lg text-sm text-stone-700 hover:bg-stone-50">
                      Mes commandes
                    </Link>
                    <Link href="/favoris" className="block px-3 py-2.5 rounded-lg text-sm text-stone-700 hover:bg-stone-50">
                      Mes favoris
                    </Link>
                    <button onClick={() => { logout(); setMobileOpen(false); router.push("/"); }} className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50">
                      Déconnexion
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login" className="block px-3 py-2.5 rounded-lg text-sm text-stone-700 hover:bg-stone-50">
                      Connexion
                    </Link>
                    <Link href="/auth/register" className="block px-3 py-2.5 rounded-lg text-sm text-stone-700 hover:bg-stone-50">
                      Créer un compte
                    </Link>
                    <Link href="/favoris" className="block px-3 py-2.5 rounded-lg text-sm text-stone-700 hover:bg-stone-50">
                      Mes favoris
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      <MiniCart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
