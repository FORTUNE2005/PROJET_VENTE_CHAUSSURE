import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { orderStatusSchema, validateBody } from "@/lib/validation";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id || typeof id !== "string" || id.length > 50) {
    return NextResponse.json({ error: "ID invalide" }, { status: 400 });
  }

  const body = await request.json();

  const [existing] = await sql`SELECT * FROM orders WHERE id = ${id}`;
  if (!existing) {
    return NextResponse.json({ error: "Commande non trouvée" }, { status: 404 });
  }

  if (body.status !== undefined) {
    const validation = validateBody(orderStatusSchema, body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }
    await sql`UPDATE orders SET status = ${validation.data.status} WHERE id = ${id}`;
  }

  const [updated] = await sql`SELECT * FROM orders WHERE id = ${id}`;
  return NextResponse.json(updated);
}
