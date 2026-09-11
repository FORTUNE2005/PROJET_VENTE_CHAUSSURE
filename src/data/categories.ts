import { Category } from "./types";
import { sql } from "@/lib/db";

async function getCategoryCounts(): Promise<Record<string, number>> {
  try {
    const rows = await sql`SELECT category, COUNT(*)::int as count FROM products GROUP BY category`;
    const counts: Record<string, number> = {};
    for (const row of rows) {
      counts[row.category] = row.count;
    }
    return counts;
  } catch {
    return {};
  }
}

let cachedCounts: Record<string, number> | null = null;

async function getCounts(): Promise<Record<string, number>> {
  if (!cachedCounts) {
    cachedCounts = await getCategoryCounts();
  }
  return cachedCounts;
}

export async function getCategories(): Promise<Category[]> {
  const counts = await getCounts();
  return [
    { id: "baskets", name: "Baskets", slug: "baskets", image: "/categories/baskets.jpg", productCount: counts["baskets"] || 0 },
    { id: "escarpins", name: "Escarpins & Talons", slug: "escarpins-talons", image: "/categories/escarpins.jpg", productCount: counts["escarpins"] || 0 },
    { id: "sandales", name: "Sandales", slug: "sandales", image: "/categories/sandales.jpg", productCount: counts["sandales"] || 0 },
    { id: "bottes", name: "Bottes & Bottines", slug: "bottes-bottines", image: "/categories/bottes.jpg", productCount: counts["bottes"] || 0 },
    { id: "ballerines", name: "Ballerines & Mocassins", slug: "ballerines-mocassins", image: "/categories/ballerines.jpg", productCount: counts["ballerines"] || 0 },
  ];
}

// Sync fallback for pages that can't await (used in search page)
export const categories: Category[] = [
  { id: "baskets", name: "Baskets", slug: "baskets", image: "/categories/baskets.jpg", productCount: 0 },
  { id: "escarpins", name: "Escarpins & Talons", slug: "escarpins-talons", image: "/categories/escarpins.jpg", productCount: 0 },
  { id: "sandales", name: "Sandales", slug: "sandales", image: "/categories/sandales.jpg", productCount: 0 },
  { id: "bottes", name: "Bottes & Bottines", slug: "bottes-bottines", image: "/categories/bottes.jpg", productCount: 0 },
  { id: "ballerines", name: "Ballerines & Mocassins", slug: "ballerines-mocassins", image: "/categories/ballerines.jpg", productCount: 0 },
];
