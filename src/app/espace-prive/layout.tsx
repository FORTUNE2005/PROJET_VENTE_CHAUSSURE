"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AdminGuard from "@/components/AdminGuard";

const boutiqueLinks = [
  { href: "/espace-prive", label: "Dashboard", icon: "M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z" },
  { href: "/espace-prive/produits", label: "Produits", icon: "M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" },
  { href: "/espace-prive/commandes", label: "Commandes", icon: "M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" },
  { href: "/espace-prive/clients", label: "Clients", icon: "M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" },
];

const contenuLinks = [
  { href: "/espace-prive/homepage", label: "Images Accueil", icon: "M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();

  const renderLinks = (links: typeof boutiqueLinks) =>
    links.map((link) => (
      <Link
        key={link.href}
        href={link.href}
        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-colors ${
          pathname === link.href
            ? "bg-white/10 text-white"
            : "text-stone-400 hover:bg-white/5 hover:text-white"
        }`}
      >
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d={link.icon} />
        </svg>
        {link.label}
      </Link>
    ));

  return (
    <AdminGuard>
    <div className="min-h-screen flex bg-stone-50">
      <aside className="w-64 bg-stone-900 text-white shrink-0 flex flex-col">
        <div className="p-6 border-b border-stone-800">
          <Link href="/espace-prive" className="flex items-center gap-2">
            <span className="text-lg font-serif font-bold">LUCIA</span>
            <span className="text-[10px] bg-rose-600 text-white px-2 py-0.5 rounded-full font-medium">Admin</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
          <div>
            <p className="text-[10px] font-medium text-stone-500 uppercase tracking-widest px-4 mb-2">Boutique</p>
            <div className="space-y-0.5">{renderLinks(boutiqueLinks)}</div>
          </div>
          <div>
            <p className="text-[10px] font-medium text-stone-500 uppercase tracking-widest px-4 mb-2">Contenu</p>
            <div className="space-y-0.5">{renderLinks(contenuLinks)}</div>
          </div>
        </nav>

        <div className="p-4 border-t border-stone-800">
          <div className="flex items-center gap-3 px-4 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-rose-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {user?.name?.[0]?.toUpperCase() || "A"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name || "Admin"}</p>
              <p className="text-[11px] text-stone-500 truncate">{user?.email || ""}</p>
            </div>
          </div>
          <Link href="/" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-stone-400 hover:bg-white/5 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
            </svg>
            Retour au site
          </Link>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
    </AdminGuard>
  );
}
