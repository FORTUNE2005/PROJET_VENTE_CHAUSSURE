import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { favorisSchema, validateBody } from "@/lib/validation";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get("clientId");
  if (!clientId) return NextResponse.json([]);

  const db = getDb();
  const favs = db.prepare(`
    SELECT p.* FROM products p
    INNER JOIN favorites f ON p.id = f.productId
    WHERE f.clientId = ?
    ORDER BY f.createdAt DESC
  `).all(clientId);
  return NextResponse.json(favs);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = validateBody(favorisSchema, body);

  if (!validation.success) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const { clientId, productId } = validation.data;
  const db = getDb();

  const existing = db.prepare("SELECT id FROM favorites WHERE clientId = ? AND productId = ?").get(clientId, productId);
  if (existing) {
    return NextResponse.json({ error: "Déjà en favoris" }, { status: 409 });
  }

  const id = String(Date.now());
  db.prepare("INSERT INTO favorites (id, clientId, productId) VALUES (?, ?, ?)").run(id, clientId, productId);
  return NextResponse.json({ success: true }, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const body = await request.json();
  const validation = validateBody(favorisSchema, body);

  if (!validation.success) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const { clientId, productId } = validation.data;
  const db = getDb();
  db.prepare("DELETE FROM favorites WHERE clientId = ? AND productId = ?").run(clientId, productId);
  return NextResponse.json({ success: true });
}
