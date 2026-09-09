import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { contactSchema, validateBody } from "@/lib/validation";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = validateBody(contactSchema, body);

  if (!validation.success) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const { name, email, subject, message } = validation.data;
  const db = getDb();
  const id = String(Date.now());
  db.prepare("INSERT INTO messages (id, name, email, subject, message) VALUES (?, ?, ?, ?, ?)").run(id, name, email, subject, message);
  return NextResponse.json({ success: true }, { status: 201 });
}
