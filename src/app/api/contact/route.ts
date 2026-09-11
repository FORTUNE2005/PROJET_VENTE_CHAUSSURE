import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { contactSchema, validateBody } from "@/lib/validation";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = validateBody(contactSchema, body);

  if (!validation.success) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const { name, email, subject, message } = validation.data;
  const id = String(Date.now());
  await sql`INSERT INTO messages (id, name, email, subject, message) VALUES (${id}, ${name}, ${email}, ${subject}, ${message})`;
  return NextResponse.json({ success: true }, { status: 201 });
}
