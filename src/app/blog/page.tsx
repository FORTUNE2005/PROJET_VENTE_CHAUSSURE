import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Blog | Lucia Chaussures",
};

const articles = [
  {
    id: 1,
    slug: "tendances-chaussures-automne-2026",
    title: "Les tendances chaussures automne-hiver 2026",
    excerpt: "Découvrez les couleurs, matières et styles qui vont dominer cette saison.",
    date: "28 Août 2026",
    category: "Tendances",
    image: "/blog/tendances.jpg",
  },
  {
    id: 2,
    slug: "comment-entretenir-cuir",
    title: "Comment entretenir ses chaussures en cuir",
    excerpt: "Nos conseils pour prolonger la durée de vie de vos paires en cuir.",
    date: "20 Août 2026",
    category: "Conseils",
    image: "/blog/cuir.jpg",
  },
  {
    id: 3,
    slug: "guide-couleurs-chaussures",
    title: "Comment associer les couleurs de chaussures",
    excerpt: "Le guide ultime pour harmoniser vos chaussures avec votre garde-robe.",
    date: "12 Août 2026",
    category: "Style",
    image: "/blog/couleurs.jpg",
  },
  {
    id: 4,
    slug: "escarpins-confort",
    title: "Escarpins confort : comment choisir ?",
    excerpt: "Tout savoir pour trouver des escarpins élégants tout en confort.",
    date: "5 Août 2026",
    category: "Guide",
    image: "/blog/escarpins.jpg",
  },
];

export default function BlogPage() {
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/blog/${article.slug}`}
              className="group bg-white border border-stone-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="aspect-video bg-stone-100 flex items-center justify-center">
                <svg className="w-10 h-10 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                </svg>
              </div>
              <div className="p-5">
                <span className="text-[10px] uppercase tracking-wider text-rose-600 font-medium">{article.category}</span>
                <h2 className="text-sm font-medium text-stone-900 mt-1.5 group-hover:text-stone-600 transition-colors line-clamp-2">
                  {article.title}
                </h2>
                <p className="text-xs text-stone-500 mt-2 line-clamp-2">{article.excerpt}</p>
                <p className="text-[11px] text-stone-400 mt-3">{article.date}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
