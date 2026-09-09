import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
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
  const db = getDb();

  const existing = db.prepare("SELECT * FROM orders WHERE id = ?").get(id);
  if (!existing) {
    return NextResponse.json({ error: "Commande non trouvée" }, { status: 404 });
  }

  if (body.status !== undefined) {
    const validation = validateBody(orderStatusSchema, body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }
    db.prepare("UPDATE orders SET status = ? WHERE id = ?").run(validation.data.status, id);
  }

  const updated = db.prepare("SELECT * FROM orders WHERE id = ?").get(id);
  return NextResponse.json(updated);
}
