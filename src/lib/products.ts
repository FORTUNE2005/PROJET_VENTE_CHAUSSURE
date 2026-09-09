import { getDb, DbProduct } from "@/lib/db";
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

function rowToProduct(row: DbProduct): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    price: row.price,
    originalPrice: row.originalPrice ?? undefined,
    category: resolveCategory(row.category),
    images: (() => { try { return JSON.parse(row.images); } catch { return []; } })(),
    stock: row.stock,
    colors: (() => { try { return JSON.parse(row.colors); } catch { return []; } })(),
    sizes: (() => { try { return JSON.parse(row.sizes); } catch { return []; } })(),
    rating: row.rating,
    reviewCount: row.reviewCount,
    isNew: row.isNew === 1,
    isBestSeller: row.isBestSeller === 1,
    description: row.description,
    material: row.material,
  };
}

export function getAllProducts(): Product[] {
  const db = getDb();
  const rows = db.prepare("SELECT * FROM products ORDER BY createdAt DESC").all() as DbProduct[];
  return rows.map(rowToProduct);
}

export function getProductBySlug(slug: string): Product | undefined {
  const db = getDb();
  const row = db.prepare("SELECT * FROM products WHERE slug = ?").get(slug) as DbProduct | undefined;
  return row ? rowToProduct(row) : undefined;
}

export function getProductById(id: string): Product | undefined {
  const db = getDb();
  const row = db.prepare("SELECT * FROM products WHERE id = ?").get(id) as DbProduct | undefined;
  return row ? rowToProduct(row) : undefined;
}

export function getProductsByCategory(categorySlug: string): Product[] {
  const db = getDb();
  const rows = db.prepare("SELECT * FROM products WHERE category = ?").all(categorySlug) as DbProduct[];
  return rows.map(rowToProduct);
}

export function getBestSellers(): Product[] {
  const db = getDb();
  const rows = db.prepare("SELECT * FROM products WHERE isBestSeller = 1").all() as DbProduct[];
  return rows.map(rowToProduct);
}

export function getNewProducts(): Product[] {
  const db = getDb();
  const rows = db.prepare("SELECT * FROM products WHERE isNew = 1").all() as DbProduct[];
  return rows.map(rowToProduct);
}

export function getPromoProducts(): Product[] {
  const db = getDb();
  const rows = db.prepare("SELECT * FROM products WHERE originalPrice IS NOT NULL").all() as DbProduct[];
  return rows.map(rowToProduct);
}

export function searchProducts(query: string): Product[] {
  const db = getDb();
  const q = `%${query}%`;
  const rows = db.prepare(
    "SELECT * FROM products WHERE name LIKE ? OR description LIKE ? OR material LIKE ? OR category LIKE ?"
  ).all(q, q, q, q) as DbProduct[];
  return rows.map(rowToProduct);
}
