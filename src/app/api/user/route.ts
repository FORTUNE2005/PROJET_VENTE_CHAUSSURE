import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import crypto from "crypto";
import { userUpdateSchema, validateBody } from "@/lib/validation";

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const validation = validateBody(userUpdateSchema, body);

  if (!validation.success) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const { id, name, email, phone, currentPassword, newPassword } = validation.data;
  const db = getDb();

  const fields: string[] = [];
  const values: (string | number)[] = [];

  if (name !== undefined) { fields.push("name = ?"); values.push(name); }
  if (email !== undefined) { fields.push("email = ?"); values.push(email); }
  if (phone !== undefined) { fields.push("phone = ?"); values.push(phone); }

  if (currentPassword && newPassword) {
    const currentHash = crypto.createHash("sha256").update(currentPassword).digest("hex");
    const user = db.prepare("SELECT id, password FROM clients WHERE id = ? AND password = ?").get(id, currentHash) as { id: string } | undefined;
    if (!user) {
      return NextResponse.json({ error: "Mot de passe actuel incorrect" }, { status: 400 });
    }
    const newHash = crypto.createHash("sha256").update(newPassword).digest("hex");
    fields.push("password = ?");
    values.push(newHash);
  }

  if (fields.length === 0) {
    return NextResponse.json({ error: "Aucun champ à modifier" }, { status: 400 });
  }

  values.push(id);
  db.prepare(`UPDATE clients SET ${fields.join(", ")} WHERE id = ?`).run(...values);

  const updated = db.prepare("SELECT id, name, email, phone, address FROM clients WHERE id = ?").get(id);
  return NextResponse.json({ success: true, user: updated });
}
