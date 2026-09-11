import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { favorisSchema, validateBody } from "@/lib/validation";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get("clientId");
  if (!clientId) return NextResponse.json([]);

  const favs = await sql`
    SELECT p.* FROM products p
    INNER JOIN favorites f ON p.id = f.productid
    WHERE f.clientid = ${clientId}
    ORDER BY f.createdat DESC
  `;
  return NextResponse.json(favs);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = validateBody(favorisSchema, body);

  if (!validation.success) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const { clientId, productId } = validation.data;

  const [existing] = await sql`SELECT id FROM favorites WHERE clientid = ${clientId} AND productid = ${productId}`;
  if (existing) {
    return NextResponse.json({ error: "Déjà en favoris" }, { status: 409 });
  }

  const id = String(Date.now());
  await sql`INSERT INTO favorites (id, clientid, productid) VALUES (${id}, ${clientId}, ${productId})`;
  return NextResponse.json({ success: true }, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const body = await request.json();
  const validation = validateBody(favorisSchema, body);

  if (!validation.success) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const { clientId, productId } = validation.data;
  await sql`DELETE FROM favorites WHERE clientid = ${clientId} AND productid = ${productId}`;
  return NextResponse.json({ success: true });
}
