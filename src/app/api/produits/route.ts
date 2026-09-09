import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  const db = getDb();
  const rows = db.prepare("SELECT * FROM products ORDER BY createdAt DESC").all();
  return NextResponse.json(rows);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const db = getDb();

  const id = String(Date.now());
  const slug = body.slug || body.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "";
  const colors = JSON.stringify(body.colors || []);
  const sizes = JSON.stringify(body.sizes || []);
  const images = JSON.stringify(body.images || []);

  db.prepare(`
    INSERT INTO products (id, name, slug, price, originalPrice, category, colors, sizes, images, stock, rating, reviewCount, isNew, isBestSeller, description, material)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, ?, 0, ?, ?)
  `).run(
    id, body.name || "", slug, body.price || 0, body.originalPrice || null,
    body.category || "baskets", colors, sizes, images, body.stock || 0,
    body.isNew ? 1 : 0, body.description || "", body.material || ""
  );

  const product = db.prepare("SELECT * FROM products WHERE id = ?").get(id);
  return NextResponse.json(product, { status: 201 });
}
