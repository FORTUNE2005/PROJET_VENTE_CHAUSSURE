"use client";

import { useState } from "react";
import Link from "next/link";

const footerLinks = {
  shop: [
    { href: "/nouveautes", label: "Nouveautés" },
    { href: "/categories/baskets", label: "Baskets" },
    { href: "/categories/escarpins-talons", label: "Escarpins & Talons" },
    { href: "/categories/sandales", label: "Sandales" },
    { href: "/categories/bottes-bottines", label: "Bottes & Bottines" },
    { href: "/promotions", label: "Promotions" },
  ],
  help: [
    { href: "/contact", label: "Contact" },
    { href: "/faq", label: "FAQ" },
    { href: "/livraison", label: "Livraison" },
    { href: "/retours", label: "Retours & Échanges" },
    { href: "/guide-tailles", label: "Guide des tailles" },
  ],
  legal: [
    { href: "/mentions-legales", label: "Mentions légales" },
    { href: "/cgv", label: "CGV" },
    { href: "/politique-confidentialite", label: "Politique de confidentialité" },
    { href: "/politique-retour", label: "Politique de retour" },
  ],
};

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState("");

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (res.ok) {
      setSubscribed(true);
      setEmail("");
    } else {
      const data = await res.json();
      setError(data.error || "Erreur");
    }
  };

  return (
    <footer className="bg-stone-900 text-stone-300">
      {/* Newsletter */}
      <div className="border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="text-xl font-serif text-white mb-2">Restez inspirée</h3>
            <p className="text-sm text-stone-400 mb-6">
              Inscrivez-vous à notre newsletter et recevez -10% sur votre première commande.
            </p>
            <form className="flex gap-2" onSubmit={handleNewsletter}>
              {subscribed ? (
                <p className="text-sm text-green-400">Merci ! Vous êtes inscrit(e) à notre newsletter.</p>
              ) : (
                <>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Votre adresse email"
                    className="flex-1 bg-stone-800 border border-stone-700 rounded-full px-5 py-3 text-sm text-white placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-600"
                  />
                  <button type="submit" className="bg-white text-stone-900 px-6 py-3 rounded-full text-sm font-medium hover:bg-stone-100 transition-colors">
                    S&apos;inscrire
                  </button>
                </>
              )}
            </form>
            {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-serif font-bold text-white tracking-tight">LUCIA</span>
            </Link>
            <p className="mt-4 text-sm text-stone-400 leading-relaxed">
              Chaussures de qualité pour femmes qui allient style, confort et élégance.
            </p>
            {/* Social */}
            <div className="flex items-center gap-4 mt-6">
              <a href="https://instagram.com/lucia.chaussures" target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-white transition-colors" aria-label="Instagram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a href="https://tiktok.com/@lucia.chaussures" target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-white transition-colors" aria-label="TikTok">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.48v-7.1a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-.81-.07 4.81 4.81 0 01-.38-.02v-.01z" />
                </svg>
              </a>
              <a href="https://facebook.com/lucia.chaussures" target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-white transition-colors" aria-label="Facebook">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-white text-sm font-medium mb-4">Boutique</h4>
            <ul className="space-y-2.5">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-stone-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-white text-sm font-medium mb-4">Aide</h4>
            <ul className="space-y-2.5">
              {footerLinks.help.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-stone-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Payment & Security */}
          <div>
            <h4 className="text-white text-sm font-medium mb-4">Moyens de paiement</h4>
            <div className="flex flex-wrap gap-3 mb-4">
              <div className="bg-stone-800 rounded px-3 py-1.5 text-xs text-stone-300">Visa</div>
              <div className="bg-stone-800 rounded px-3 py-1.5 text-xs text-stone-300">Mastercard</div>
              <div className="bg-stone-800 rounded px-3 py-1.5 text-xs text-stone-300">PayPal</div>
              <div className="bg-stone-800 rounded px-3 py-1.5 text-xs text-stone-300">Apple Pay</div>
            </div>
            <div className="flex items-center gap-2 text-sm text-stone-300">
              <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              Paiement à la livraison disponible
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-stone-500">
              &copy; 2026 Lucia Chaussures. Tous droits réservés.
            </p>
            <div className="flex items-center gap-4">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs text-stone-500 hover:text-stone-300 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
