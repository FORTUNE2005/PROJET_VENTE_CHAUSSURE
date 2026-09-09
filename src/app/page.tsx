import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { getAllProducts } from "@/lib/products";
import { categories } from "@/data/categories";
import { readFileSync } from "fs";
import { join } from "path";

const reassurances = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H18.75m-7.5-3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
      </svg>
    ),
    title: "Livraison gratuite",
    text: "Dès 45 000 F d'achat",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
      </svg>
    ),
    title: "Retours offerts",
    text: "Sous 30 jours",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
      </svg>
    ),
    title: "Paiement à la livraison",
    text: "Payez en espèces à réception",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
      </svg>
    ),
    title: "Service client",
    text: "À votre écoute",
  },
];

function getHomepageConfig() {
  try {
    return JSON.parse(readFileSync(join(process.cwd(), "data", "homepage.json"), "utf-8"));
  } catch {
    return { heroImage: "", instagramImages: [] };
  }
}

export default function Home() {
  const allProducts = getAllProducts();
  const bestSellers = allProducts.filter((p) => p.isBestSeller).slice(0, 4);
  const newProducts = allProducts.filter((p) => p.isNew).slice(0, 4);
  const config = getHomepageConfig();

  return (
    <>
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-stone-100 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative min-h-[500px] lg:min-h-[600px] flex items-center">
              <div className="absolute inset-0 bg-gradient-to-br from-stone-100 via-stone-50 to-rose-50/30" />
              <div className="relative z-10 max-w-xl py-16 lg:py-24">
                <span className="inline-block bg-rose-100 text-rose-700 text-xs font-medium px-3 py-1 rounded-full mb-6 tracking-wide uppercase">
                  Collection Automne-Hiver
                </span>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-stone-900 leading-[1.1] mb-6">
                  Sublimez votre
                  <br />
                  <span className="text-rose-600">style</span>
                </h1>
                <p className="text-lg text-stone-600 mb-8 max-w-md leading-relaxed">
                  Découvrez notre sélection de chaussures pour femmes. Élégance, confort et qualité au rendez-vous.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/nouveautes" className="inline-flex items-center justify-center bg-stone-900 text-white px-8 py-3.5 rounded-full text-sm font-medium hover:bg-stone-800 transition-colors">
                    Découvrir
                    <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                  <Link href="/categories" className="inline-flex items-center justify-center bg-white text-stone-900 px-8 py-3.5 rounded-full text-sm font-medium border border-stone-200 hover:border-stone-300 transition-colors">
                    Nos catégories
                  </Link>
                </div>
              </div>
              <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-[45%] aspect-square">
                <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-stone-200 to-stone-100">
                  {config.heroImage ? (
                    <img src={config.heroImage} alt="Lucia Chaussures" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-32 h-32 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Reassurance bar */}
        <section className="border-b border-stone-100 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-stone-100">
              {reassurances.map((item) => (
                <div key={item.title} className="flex items-center gap-3 py-5 px-4 lg:px-6">
                  <div className="text-stone-400 shrink-0">{item.icon}</div>
                  <div>
                    <p className="text-sm font-medium text-stone-800">{item.title}</p>
                    <p className="text-xs text-stone-400">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-2xl lg:text-3xl font-serif font-bold text-stone-900">Nos catégories</h2>
                <p className="mt-2 text-sm text-stone-500">Trouvez la paire idéale pour chaque occasion</p>
              </div>
              <Link href="/categories" className="hidden sm:inline-flex items-center text-sm text-stone-600 hover:text-stone-900 transition-colors">
                Tout voir
                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {categories.map((cat) => (
                <Link key={cat.id} href={`/categories/${cat.slug}`} className="group relative aspect-[4/5] rounded-xl overflow-hidden bg-stone-100">
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/70 via-stone-900/20 to-transparent z-10" />
                  {cat.image ? (
                    <img src={cat.image} alt={cat.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-stone-200 to-stone-100 flex items-center justify-center">
                      <svg className="w-10 h-10 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 z-20 p-4">
                    <h3 className="text-white font-medium text-sm">{cat.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Best Sellers */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-2xl lg:text-3xl font-serif font-bold text-stone-900">Meilleures ventes</h2>
                <p className="mt-2 text-sm text-stone-500">Les coups de cœur de nos clientes</p>
              </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {bestSellers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* Promo Banner */}
        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative bg-stone-900 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-stone-900 via-stone-900/90 to-stone-900/60" />
              <div className="relative z-10 py-12 lg:py-16 px-8 lg:px-16">
                <div className="max-w-lg">
                  <span className="inline-block bg-rose-600 text-white text-xs font-medium px-3 py-1 rounded-full mb-4 tracking-wide uppercase">
                    -20% sur tout le site
                  </span>
                  <h2 className="text-3xl lg:text-4xl font-serif font-bold text-white mb-4 leading-tight">
                    Les soldes d&apos;été sont là
                  </h2>
                  <p className="text-stone-300 mb-8 leading-relaxed">
                    Profitez de réductions exceptionnelles sur une sélection de chaussures. Offre valable jusqu&apos;au 30 septembre.
                  </p>
                  <Link href="/promotions" className="inline-flex items-center bg-white text-stone-900 px-8 py-3.5 rounded-full text-sm font-medium hover:bg-stone-100 transition-colors">
                    Voir les offres
                    <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Nouveautés */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-2xl lg:text-3xl font-serif font-bold text-stone-900">Nouveautés</h2>
                <p className="mt-2 text-sm text-stone-500">Les dernières tendances à portée de pied</p>
              </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {newProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* Social proof / Instagram */}
        <section className="py-16 lg:py-24 border-t border-stone-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl lg:text-3xl font-serif font-bold text-stone-900">Suivez-nous</h2>
              <p className="mt-2 text-sm text-stone-500">@lucia.chaussures sur Instagram</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {config.instagramImages && config.instagramImages.length > 0 ? (
                config.instagramImages.map((img: string, i: number) => (
                  <a key={i} href="https://instagram.com/lucia.chaussures" target="_blank" rel="noopener noreferrer" className="aspect-square rounded-xl bg-stone-100 overflow-hidden group relative">
                    <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/20 transition-colors flex items-center justify-center">
                      <svg className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                      </svg>
                    </div>
                  </a>
                ))
              ) : (
                [...Array(6)].map((_, i) => (
                  <a key={i} href="https://instagram.com/lucia.chaussures" target="_blank" rel="noopener noreferrer" className="aspect-square rounded-xl bg-stone-100 overflow-hidden group relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-stone-200 to-stone-100 flex items-center justify-center">
                      <svg className="w-8 h-8 text-stone-300 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                      </svg>
                    </div>
                  </a>
                ))
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
