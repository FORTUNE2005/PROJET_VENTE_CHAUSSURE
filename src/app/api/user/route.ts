import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import crypto from "crypto";
import { userUpdateSchema, validateBody } from "@/lib/validation";

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const validation = validateBody(userUpdateSchema, body);

  if (!validation.success) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const { id, name, email, phone, currentPassword, newPassword } = validation.data;

  const fields: string[] = [];
  const values: (string | number)[] = [];

  if (name !== undefined) { fields.push("name"); values.push(name); }
  if (email !== undefined) { fields.push("email"); values.push(email); }
  if (phone !== undefined) { fields.push("phone"); values.push(phone); }

  if (currentPassword && newPassword) {
    const currentHash = crypto.createHash("sha256").update(currentPassword).digest("hex");
    const [user] = await sql`SELECT id, password FROM clients WHERE id = ${id} AND password = ${currentHash}` as { id: string }[];
    if (!user) {
      return NextResponse.json({ error: "Mot de passe actuel incorrect" }, { status: 400 });
    }
    const newHash = crypto.createHash("sha256").update(newPassword).digest("hex");
    fields.push("password");
    values.push(newHash);
  }

  if (fields.length === 0) {
    return NextResponse.json({ error: "Aucun champ à modifier" }, { status: 400 });
  }

  values.push(id);
  const setClause = fields.map((f, i) => `${f} = $${i + 1}`).join(", ");
  const query = `UPDATE clients SET ${setClause} WHERE id = $${fields.length + 1}`;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (sql.unsafe as any)(query, values);

  const [updated] = await sql`SELECT id, name, email, phone, address FROM clients WHERE id = ${id}`;
  return NextResponse.json({ success: true, user: updated });
}
