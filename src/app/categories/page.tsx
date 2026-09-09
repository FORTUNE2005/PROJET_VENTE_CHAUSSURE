import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getAllProducts } from "@/lib/products";

export const metadata = {
  title: "Nos catégories | Lucia Chaussures",
};

const categoryImages: Record<string, string> = {
  baskets: "/categories/baskets.jpg",
  escarpins: "/categories/escarpins.jpg",
  sandales: "/categories/sandales.jpg",
  bottes: "/categories/bottes.jpg",
  ballerines: "/categories/ballerines.jpg",
};

const categoryNames: Record<string, string> = {
  baskets: "Baskets",
  escarpins: "Escarpins & Talons",
  sandales: "Sandales",
  bottes: "Bottes & Bottines",
  ballerines: "Ballerines & Mocassins",
};

const categorySlugs: Record<string, string> = {
  baskets: "baskets",
  escarpins: "escarpins-talons",
  sandales: "sandales",
  bottes: "bottes-bottines",
  ballerines: "ballerines-mocassins",
};

export default function CategoriesPage() {
  const products = getAllProducts();

  const counts: Record<string, number> = {};
  for (const p of products) {
    const catId = p.category.id;
    counts[catId] = (counts[catId] || 0) + 1;
  }

  const cats = Object.keys(categoryNames).map((key) => ({
    id: key,
    name: categoryNames[key],
    slug: categorySlugs[key],
    image: categoryImages[key],
    count: counts[key] || 0,
  }));

  return (
    <>
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <nav className="flex items-center gap-2 text-xs text-stone-400 mb-6">
          <Link href="/" className="hover:text-stone-600">Accueil</Link>
          <span>/</span>
          <span className="text-stone-700">Catégories</span>
        </nav>

        <h1 className="text-2xl lg:text-3xl font-serif font-bold text-stone-900 mb-2">Nos catégories</h1>
        <p className="text-sm text-stone-500 mb-10">{products.length} produits au catalogue</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {cats.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />
              <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
                <h2 className="text-lg font-serif font-bold text-white">{cat.name}</h2>
                <p className="text-sm text-white/80 mt-1">{cat.count} produit{cat.count !== 1 ? "s" : ""}</p>
              </div>
              <div className="absolute top-3 right-3 z-20">
                <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
                  Voir →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
