import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { getAllProducts } from "@/lib/products";
import { formatPrice } from "@/lib/format";

export const metadata = {
  title: "Promotions | Lucia Chaussures",
};

export default function PromotionsPage() {
  const promoProducts = getAllProducts().filter((p) => p.originalPrice);

  return (
    <>
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <nav className="flex items-center gap-2 text-xs text-stone-400 mb-6">
          <Link href="/" className="hover:text-stone-600">Accueil</Link>
          <span>/</span>
          <span className="text-stone-700">Promotions</span>
        </nav>
        {/* Promo banner */}
        <div className="bg-stone-900 rounded-2xl overflow-hidden mb-10">
          <div className="relative py-10 px-8 lg:px-12">
            <span className="inline-block bg-rose-600 text-white text-xs font-medium px-3 py-1 rounded-full mb-4 tracking-wide uppercase">
              Offre spéciale
            </span>
            <h1 className="text-2xl lg:text-3xl font-serif font-bold text-white mb-2">Promotions</h1>
            <p className="text-stone-300 max-w-md">
              Profitez de réductions exceptionnelles sur une sélection de chaussures. Offre valable dans la limite des stocks disponibles.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {promoProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
