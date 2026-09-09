import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = getDb();
  const row = db.prepare("SELECT * FROM products WHERE id = ?").get(id);

  if (!row) {
    return NextResponse.json({ error: "Produit non trouvé" }, { status: 404 });
  }

  return NextResponse.json(row);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const db = getDb();

  const existing = db.prepare("SELECT * FROM products WHERE id = ?").get(id);
  if (!existing) {
    return NextResponse.json({ error: "Produit non trouvé" }, { status: 404 });
  }

  const fields: string[] = [];
  const values: unknown[] = [];

  if (body.name !== undefined) { fields.push("name = ?"); values.push(body.name); }
  if (body.slug !== undefined) { fields.push("slug = ?"); values.push(body.slug); }
  if (body.price !== undefined) { fields.push("price = ?"); values.push(body.price); }
  if (body.originalPrice !== undefined) { fields.push("originalPrice = ?"); values.push(body.originalPrice); }
  if (body.category !== undefined) { fields.push("category = ?"); values.push(body.category); }
  if (body.colors !== undefined) { fields.push("colors = ?"); values.push(JSON.stringify(body.colors)); }
  if (body.sizes !== undefined) { fields.push("sizes = ?"); values.push(JSON.stringify(body.sizes)); }
  if (body.images !== undefined) { fields.push("images = ?"); values.push(JSON.stringify(body.images)); }
  if (body.stock !== undefined) { fields.push("stock = ?"); values.push(body.stock); }
  if (body.isNew !== undefined) { fields.push("isNew = ?"); values.push(body.isNew ? 1 : 0); }
  if (body.isBestSeller !== undefined) { fields.push("isBestSeller = ?"); values.push(body.isBestSeller ? 1 : 0); }
  if (body.description !== undefined) { fields.push("description = ?"); values.push(body.description); }
  if (body.material !== undefined) { fields.push("material = ?"); values.push(body.material); }

  if (fields.length > 0) {
    values.push(id);
    db.prepare(`UPDATE products SET ${fields.join(", ")} WHERE id = ?`).run(...values);
  }

  const updated = db.prepare("SELECT * FROM products WHERE id = ?").get(id);
  return NextResponse.json(updated);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = getDb();

  const existing = db.prepare("SELECT * FROM products WHERE id = ?").get(id) as { images: string } | undefined;
  if (!existing) {
    return NextResponse.json({ error: "Produit non trouvé" }, { status: 404 });
  }

  // Delete image files
  try {
    const images = JSON.parse(existing.images || "[]") as string[];
    const { unlinkSync } = require("fs");
    const { join } = require("path");
    for (const img of images) {
      if (img.startsWith("/uploads/")) {
        const filepath = join(process.cwd(), "public", img);
        try { unlinkSync(filepath); } catch {}
      }
    }
  } catch {}

  db.prepare("DELETE FROM products WHERE id = ?").run(id);
  return NextResponse.json({ success: true });
}
