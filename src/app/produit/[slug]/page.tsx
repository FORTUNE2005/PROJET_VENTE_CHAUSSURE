import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductDetail from "@/components/ProductDetail";
import { getAllProducts, getProductBySlug } from "@/lib/products";

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return {
    title: `${product?.name ?? "Produit"} | Lucia Chaussures`,
    description: product?.description,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return (
      <>
        <Header />
        <main className="flex-1 max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-serif font-bold text-stone-900">Produit introuvable</h1>
          <p className="mt-2 text-stone-500">Ce produit n&apos;existe pas.</p>
        </main>
        <Footer />
      </>
    );
  }

  const allProducts = await getAllProducts();
  const similarProducts = allProducts
    .filter((p) => p.category.slug === product.category.slug && p.id !== product.id)
    .slice(0, 4);

  return (
    <>
      <Header />
      <main className="flex-1">
        <ProductDetail product={product} similarProducts={similarProducts} />
      </main>
      <Footer />
    </>
  );
}
