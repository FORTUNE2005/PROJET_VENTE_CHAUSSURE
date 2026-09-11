import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { unlinkSync } from "fs";
import { join } from "path";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const [row] = await sql`SELECT * FROM products WHERE id = ${id}`;

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

  const [existing] = await sql`SELECT * FROM products WHERE id = ${id}`;
  if (!existing) {
    return NextResponse.json({ error: "Produit non trouvé" }, { status: 404 });
  }

  const fields: string[] = [];
  const values: unknown[] = [];

  if (body.name !== undefined) { fields.push("name"); values.push(body.name); }
  if (body.slug !== undefined) { fields.push("slug"); values.push(body.slug); }
  if (body.price !== undefined) { fields.push("price"); values.push(body.price); }
  if (body.originalPrice !== undefined) { fields.push("originalprice"); values.push(body.originalPrice); }
  if (body.category !== undefined) { fields.push("category"); values.push(body.category); }
  if (body.colors !== undefined) { fields.push("colors"); values.push(JSON.stringify(body.colors)); }
  if (body.sizes !== undefined) { fields.push("sizes"); values.push(JSON.stringify(body.sizes)); }
  if (body.images !== undefined) { fields.push("images"); values.push(JSON.stringify(body.images)); }
  if (body.stock !== undefined) { fields.push("stock"); values.push(body.stock); }
  if (body.isNew !== undefined) { fields.push("isnew"); values.push(body.isNew ? true : false); }
  if (body.isBestSeller !== undefined) { fields.push("isbestseller"); values.push(body.isBestSeller ? true : false); }
  if (body.description !== undefined) { fields.push("description"); values.push(body.description); }
  if (body.material !== undefined) { fields.push("material"); values.push(body.material); }

  if (fields.length > 0) {
    values.push(id);
    const setClause = fields.map((f, i) => `${f} = $${i + 1}`).join(", ");
    const query = `UPDATE products SET ${setClause} WHERE id = $${fields.length + 1}`;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (sql.unsafe as any)(query, values);
  }

  const [updated] = await sql`SELECT * FROM products WHERE id = ${id}`;
  return NextResponse.json(updated);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const [existing] = await sql`SELECT * FROM products WHERE id = ${id}` as { images: string }[];
  if (!existing) {
    return NextResponse.json({ error: "Produit non trouvé" }, { status: 404 });
  }

  try {
    const images = JSON.parse(existing.images || "[]") as string[];
    for (const img of images) {
      if (img.startsWith("/uploads/")) {
        const filepath = join(process.cwd(), "public", img);
        try { unlinkSync(filepath); } catch {}
      }
    }
  } catch {}

  await sql`DELETE FROM products WHERE id = ${id}`;
  return NextResponse.json({ success: true });
}
