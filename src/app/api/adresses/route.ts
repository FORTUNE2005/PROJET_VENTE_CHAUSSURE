import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { adressesSchema, validateBody } from "@/lib/validation";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get("clientId");
  if (!clientId) return NextResponse.json([]);

  const db = getDb();
  const rows = db.prepare("SELECT * FROM adresses WHERE clientId = ? ORDER BY isDefault DESC, createdAt DESC").all(clientId);
  return NextResponse.json(rows);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = validateBody(adressesSchema, body);

  if (!validation.success) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const { clientId, label, name, phone, address, city, isDefault } = validation.data;
  const db = getDb();

  if (isDefault) {
    db.prepare("UPDATE adresses SET isDefault = 0 WHERE clientId = ?").run(clientId);
  }

  const id = String(Date.now());
  db.prepare("INSERT INTO adresses (id, clientId, label, name, phone, address, city, isDefault) VALUES (?, ?, ?, ?, ?, ?, ?, ?)").run(id, clientId, label, name, phone, address, city, isDefault ? 1 : 0);

  const row = db.prepare("SELECT * FROM adresses WHERE id = ?").get(id);
  return NextResponse.json(row, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const body = await request.json();
  if (!body.id || !body.clientId) {
    return NextResponse.json({ error: "id et clientId requis" }, { status: 400 });
  }

  const db = getDb();
  db.prepare("DELETE FROM adresses WHERE id = ? AND clientId = ?").run(body.id, body.clientId);
  return NextResponse.json({ success: true });
}
