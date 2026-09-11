import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { newsletterSchema, validateBody } from "@/lib/validation";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = validateBody(newsletterSchema, body);

  if (!validation.success) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const { email } = validation.data;

  const [existing] = await sql`SELECT id FROM newsletter WHERE email = ${email}`;
  if (existing) {
    return NextResponse.json({ error: "Déjà inscrit" }, { status: 409 });
  }

  const id = String(Date.now());
  await sql`INSERT INTO newsletter (id, email) VALUES (${id}, ${email})`;
  return NextResponse.json({ success: true }, { status: 201 });
}
