import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { newsletterSchema, validateBody } from "@/lib/validation";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = validateBody(newsletterSchema, body);

  if (!validation.success) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const { email } = validation.data;
  const db = getDb();

  const existing = db.prepare("SELECT id FROM newsletter WHERE email = ?").get(email);
  if (existing) {
    return NextResponse.json({ error: "Déjà inscrit" }, { status: 409 });
  }

  const id = String(Date.now());
  db.prepare("INSERT INTO newsletter (id, email) VALUES (?, ?)").run(id, email);
  return NextResponse.json({ success: true }, { status: 201 });
}
