import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
  const rows = await sql`SELECT * FROM products ORDER BY createdat DESC`;
  return NextResponse.json(rows);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const id = String(Date.now());
  const slug = body.slug || body.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "";
  const colors = JSON.stringify(body.colors || []);
  const sizes = JSON.stringify(body.sizes || []);
  const images = JSON.stringify(body.images || []);

  await sql`
    INSERT INTO products (id, name, slug, price, originalprice, category, colors, sizes, images, stock, rating, reviewcount, isnew, isbestseller, description, material)
    VALUES (${id}, ${body.name || ""}, ${slug}, ${body.price || 0}, ${body.originalPrice || null},
      ${body.category || "baskets"}, ${colors}, ${sizes}, ${images}, ${body.stock || 0},
      0, 0, ${body.isNew ? true : false}, false, ${body.description || ""}, ${body.material || ""})
  `;

  const [product] = await sql`SELECT * FROM products WHERE id = ${id}`;
  return NextResponse.json(product, { status: 201 });
}
