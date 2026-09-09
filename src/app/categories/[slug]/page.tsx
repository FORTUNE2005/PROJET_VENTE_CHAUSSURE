import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CategoryFilters from "@/components/CategoryFilters";
import { getAllProducts } from "@/lib/products";
import { categories } from "@/data/categories";

export function generateStaticParams() {
  return categories.map((cat) => ({ slug: cat.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = categories.find((c) => c.slug === slug);
  return {
    title: `${category?.name ?? "Catégorie"} | Lucia Chaussures`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = categories.find((c) => c.slug === slug);
  const allProducts = getAllProducts();
  const categoryProducts = allProducts.filter((p) => p.category.slug === slug);

  if (!category) {
    return (
      <>
        <Header />
        <main className="flex-1 max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-serif font-bold text-stone-900">Catégorie introuvable</h1>
          <p className="mt-2 text-stone-500">Cette catégorie n&apos;existe pas.</p>
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
          <Link href="/categories" className="hover:text-stone-600">Catégories</Link>
          <span>/</span>
          <span className="text-stone-700">{category.name}</span>
        </nav>
        <CategoryFilters products={categoryProducts} categoryName={category.name} />
      </main>
      <Footer />
    </>
  );
}
