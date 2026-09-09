import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import crypto from "crypto";
import { registerSchema, validateBody } from "@/lib/validation";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = validateBody(registerSchema, body);

  if (!validation.success) {
    return NextResponse.json({ success: false, error: validation.error }, { status: 400 });
  }

  const { name, email, password, phone } = validation.data;
  const db = getDb();

  const existing = db.prepare("SELECT id FROM clients WHERE email = ?").get(email);
  if (existing) {
    return NextResponse.json({ success: false, error: "Cet email est déjà utilisé" }, { status: 409 });
  }

  const id = String(Date.now());
  const hash = crypto.createHash("sha256").update(password).digest("hex");
  const joinDate = new Date().toISOString().split("T")[0];

  db.prepare("INSERT INTO clients (id, name, email, phone, password, joinDate) VALUES (?, ?, ?, ?, ?, ?)").run(id, name, email, phone, hash, joinDate);

  return NextResponse.json({
    success: true,
    user: { id, name, email, phone, address: "" },
  });
}
