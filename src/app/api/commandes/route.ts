import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get("clientId");

  let rows;
  if (clientId) {
    rows = await sql`SELECT * FROM orders WHERE clientid = ${clientId} ORDER BY date DESC`;
  } else {
    rows = await sql`SELECT * FROM orders ORDER BY date DESC`;
  }
  return NextResponse.json(rows);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const id = `LC-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`;
  const items = body.items || [];
  const itemsJson = JSON.stringify(items);

  await sql`
    INSERT INTO orders (id, clientid, customer, email, phone, address, total, status, date, items)
    VALUES (${id}, ${body.clientId || ""}, ${body.clientName || ""}, ${body.clientEmail || ""},
      ${body.clientPhone || ""}, ${body.address || ""}, ${body.total || 0}, 'En attente',
      ${new Date().toISOString().split("T")[0]}, ${itemsJson})
  `;

  for (const item of items) {
    if (item.productId && item.quantity) {
      await sql`UPDATE products SET stock = GREATEST(0, stock - ${item.quantity}) WHERE id = ${item.productId}`;
    }
  }

  const [order] = await sql`SELECT * FROM orders WHERE id = ${id}`;
  return NextResponse.json({ success: true, orderId: id, order }, { status: 201 });
}
