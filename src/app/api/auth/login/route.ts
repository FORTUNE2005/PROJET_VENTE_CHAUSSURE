import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import crypto from "crypto";
import { loginSchema, validateBody } from "@/lib/validation";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = validateBody(loginSchema, body);

  if (!validation.success) {
    return NextResponse.json({ success: false, error: validation.error }, { status: 400 });
  }

  const { email, password } = validation.data;
  const db = getDb();
  const hash = crypto.createHash("sha256").update(password).digest("hex");
  const user = db.prepare("SELECT id, name, email, phone, address FROM clients WHERE email = ? AND password = ?").get(email, hash) as { id: string; name: string; email: string; phone: string; address: string } | undefined;

  if (!user) {
    return NextResponse.json({ success: false, error: "Email ou mot de passe incorrect" }, { status: 401 });
  }

  return NextResponse.json({ success: true, user });
}
