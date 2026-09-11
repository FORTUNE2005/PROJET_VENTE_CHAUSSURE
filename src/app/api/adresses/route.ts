import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { adressesSchema, validateBody } from "@/lib/validation";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get("clientId");
  if (!clientId) return NextResponse.json([]);

  const rows = await sql`SELECT * FROM adresses WHERE clientid = ${clientId} ORDER BY isdefault DESC, createdat DESC`;
  return NextResponse.json(rows);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = validateBody(adressesSchema, body);

  if (!validation.success) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const { clientId, label, name, phone, address, city, isDefault } = validation.data;

  if (isDefault) {
    await sql`UPDATE adresses SET isdefault = false WHERE clientid = ${clientId}`;
  }

  const id = String(Date.now());
  await sql`INSERT INTO adresses (id, clientid, label, name, phone, address, city, isdefault) VALUES (${id}, ${clientId}, ${label}, ${name}, ${phone}, ${address}, ${city}, ${isDefault ? true : false})`;

  const [row] = await sql`SELECT * FROM adresses WHERE id = ${id}`;
  return NextResponse.json(row, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const body = await request.json();
  if (!body.id || !body.clientId) {
    return NextResponse.json({ error: "id et clientId requis" }, { status: 400 });
  }

  await sql`DELETE FROM adresses WHERE id = ${body.id} AND clientid = ${body.clientId}`;
  return NextResponse.json({ success: true });
}
