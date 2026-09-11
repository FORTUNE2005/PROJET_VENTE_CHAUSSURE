"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  category: string;
  author: string;
  createdAt: string;
}

export default function BlogPage() {
  const [articles, setArticles] = useState<BlogPost[]>([]);

  useEffect(() => {
    fetch("/api/blog")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setArticles(data); })
      .catch(() => {});
  }, []);

  return (
    <>
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-900 mb-6">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          Retour à l&apos;accueil
        </Link>
        <nav className="flex items-center gap-2 text-xs text-stone-400 mb-6">
          <Link href="/" className="hover:text-stone-600">Accueil</Link>
          <span>/</span>
          <span className="text-stone-700">Blog</span>
        </nav>
        <h1 className="text-2xl lg:text-3xl font-serif font-bold text-stone-900 mb-2">Blog</h1>
        <p className="text-sm text-stone-500 mb-10">Tendances, conseils et guides pour sublimer votre style.</p>

        {articles.length === 0 ? (
          <p className="text-sm text-stone-500 text-center py-10">Aucun article pour le moment.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/blog/${article.slug}`}
                className="group bg-white border border-stone-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="aspect-video bg-stone-100 flex items-center justify-center overflow-hidden">
                  {article.image && article.image !== "/blog/default.jpg" ? (
                    <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
                  ) : (
                    <svg className="w-10 h-10 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                    </svg>
                  )}
                </div>
                <div className="p-5">
                  <span className="text-[10px] uppercase tracking-wider text-rose-600 font-medium">{article.category}</span>
                  <h2 className="text-sm font-medium text-stone-900 mt-1.5 group-hover:text-stone-600 transition-colors line-clamp-2">
                    {article.title}
                  </h2>
                  <p className="text-xs text-stone-500 mt-2 line-clamp-2">{article.excerpt}</p>
                  <p className="text-[11px] text-stone-400 mt-3">{new Date(article.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
