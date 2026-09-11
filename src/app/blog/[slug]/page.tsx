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
  content: string;
  image: string;
  category: string;
  author: string;
  createdAt: string;
}

export default function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const [article, setArticle] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then(({ slug }) => {
      fetch(`/api/blog?slug=${slug}`)
        .then((r) => r.json())
        .then((data) => { setArticle(data); setLoading(false); })
        .catch(() => setLoading(false));
    });
  }, [params]);

  if (loading) {
    return (
      <>
        <Header />
        <main className="flex-1 max-w-7xl mx-auto px-4 py-16 text-center">
          <p className="text-stone-500">Chargement...</p>
        </main>
        <Footer />
      </>
    );
  }

  if (!article) {
    return (
      <>
        <Header />
        <main className="flex-1 max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-serif font-bold text-stone-900">Article introuvable</h1>
          <Link href="/blog" className="text-sm text-stone-500 hover:text-stone-700 mt-4 inline-block">Retour au blog</Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <nav className="flex items-center gap-2 text-xs text-stone-400 mb-6">
          <Link href="/" className="hover:text-stone-600">Accueil</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-stone-600">Blog</Link>
          <span>/</span>
          <span className="text-stone-700">{article.title}</span>
        </nav>

        <article className="max-w-3xl mx-auto">
          <div className="mb-8">
            <span className="inline-block bg-rose-100 text-rose-700 text-xs font-medium px-3 py-1 rounded-full mb-3 tracking-wide uppercase">
              {article.category}
            </span>
            <h1 className="text-2xl lg:text-3xl font-serif font-bold text-stone-900 mb-3">{article.title}</h1>
            <p className="text-sm text-stone-400">{new Date(article.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</p>
          </div>

          <div className="aspect-video bg-stone-100 rounded-2xl mb-8 flex items-center justify-center overflow-hidden">
            {article.image && article.image !== "/blog/default.jpg" ? (
              <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
            ) : (
              <svg className="w-16 h-16 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
              </svg>
            )}
          </div>

          <div className="prose prose-stone max-w-none">
            {article.content.split("\n\n").map((paragraph, i) => (
              <p key={i} className="text-stone-600 leading-relaxed mb-4">{paragraph}</p>
            ))}
          </div>

          <div className="border-t border-stone-100 mt-10 pt-8">
            <Link href="/blog" className="text-sm text-stone-600 hover:text-stone-900">
              ← Retour au blog
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
