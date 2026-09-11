import { sql } from "@/lib/db";
import { Product, Category } from "@/data/types";

const categories: Category[] = [
  { id: "baskets", name: "Baskets", slug: "baskets", image: "/categories/baskets.jpg", productCount: 0 },
  { id: "escarpins", name: "Escarpins & Talons", slug: "escarpins-talons", image: "/categories/escarpins.jpg", productCount: 0 },
  { id: "sandales", name: "Sandales", slug: "sandales", image: "/categories/sandales.jpg", productCount: 0 },
  { id: "bottes", name: "Bottes & Bottines", slug: "bottes-bottines", image: "/categories/bottes.jpg", productCount: 0 },
  { id: "ballerines", name: "Ballerines & Mocassins", slug: "ballerines-mocassins", image: "/categories/ballerines.jpg", productCount: 0 },
];

function resolveCategory(slug: string): Category {
  return categories.find((c) => c.id === slug || c.slug === slug) || categories[0];
}

function rowToProduct(row: Record<string, unknown>): Product {
  return {
    id: row.id as string,
    name: row.name as string,
    slug: row.slug as string,
    price: row.price as number,
    originalPrice: (row.originalprice as number) ?? undefined,
    category: resolveCategory(row.category as string),
    images: (() => { try { return JSON.parse(row.images as string); } catch { return []; } })(),
    stock: row.stock as number,
    colors: (() => { try { return JSON.parse(row.colors as string); } catch { return []; } })(),
    sizes: (() => { try { return JSON.parse(row.sizes as string); } catch { return []; } })(),
    rating: row.rating as number,
    reviewCount: row.reviewcount as number,
    isNew: row.isnew as boolean,
    isBestSeller: row.isbestseller as boolean,
    description: row.description as string,
    material: row.material as string,
  };
}

export async function getAllProducts(): Promise<Product[]> {
  const rows = await sql`SELECT * FROM products ORDER BY createdat DESC`;
  return rows.map(rowToProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const rows = await sql`SELECT * FROM products WHERE slug = ${slug}`;
  return rows[0] ? rowToProduct(rows[0]) : undefined;
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const rows = await sql`SELECT * FROM products WHERE id = ${id}`;
  return rows[0] ? rowToProduct(rows[0]) : undefined;
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  const rows = await sql`SELECT * FROM products WHERE category = ${categorySlug}`;
  return rows.map(rowToProduct);
}

export async function getBestSellers(): Promise<Product[]> {
  const rows = await sql`SELECT * FROM products WHERE isbestseller = true`;
  return rows.map(rowToProduct);
}

export async function getNewProducts(): Promise<Product[]> {
  const rows = await sql`SELECT * FROM products WHERE isnew = true`;
  return rows.map(rowToProduct);
}

export async function getPromoProducts(): Promise<Product[]> {
  const rows = await sql`SELECT * FROM products WHERE originalprice IS NOT NULL`;
  return rows.map(rowToProduct);
}

export async function searchProducts(query: string): Promise<Product[]> {
  const q = `%${query}%`;
  const rows = await sql`SELECT * FROM products WHERE name ILIKE ${q} OR description ILIKE ${q} OR material ILIKE ${q} OR category ILIKE ${q}`;
  return rows.map(rowToProduct);
}
