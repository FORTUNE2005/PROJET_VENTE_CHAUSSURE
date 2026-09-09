import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get("clientId");

  const db = getDb();
  let rows;
  if (clientId) {
    rows = db.prepare("SELECT * FROM orders WHERE clientId = ? ORDER BY date DESC").all(clientId);
  } else {
    rows = db.prepare("SELECT * FROM orders ORDER BY date DESC").all();
  }
  return NextResponse.json(rows);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const db = getDb();

  const id = `LC-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`;
  const items = JSON.stringify(body.items || []);

  db.prepare(`
    INSERT INTO orders (id, clientId, customer, email, phone, address, total, status, date, items)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'En attente', ?, ?)
  `).run(id, body.clientId || "", body.clientName || "", body.clientEmail || "", body.clientPhone || "", body.address || "", body.total || 0, new Date().toISOString().split("T")[0], items);

  const order = db.prepare("SELECT * FROM orders WHERE id = ?").get(id);
  return NextResponse.json({ success: true, orderId: id, order }, { status: 201 });
}
