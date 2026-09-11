import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { getAllProducts } from "@/lib/products";

export const metadata = {
  title: "Nouveautés | Lucia Chaussures",
};

export default async function NouveautesPage() {
  const allProducts = await getAllProducts();
  const newProducts = allProducts.filter((p) => p.isNew);

  return (
    <>
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <nav className="flex items-center gap-2 text-xs text-stone-400 mb-6">
          <Link href="/" className="hover:text-stone-600">Accueil</Link>
          <span>/</span>
          <span className="text-stone-700">Nouveautés</span>
        </nav>
        <div className="mb-8">
          <span className="inline-block bg-rose-100 text-rose-700 text-xs font-medium px-3 py-1 rounded-full mb-3 tracking-wide uppercase">
            Nouvelle collection
          </span>
          <h1 className="text-2xl lg:text-3xl font-serif font-bold text-stone-900">Nouveautés</h1>
          <p className="mt-2 text-sm text-stone-500">Découvrez nos dernières arrivées</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {newProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
