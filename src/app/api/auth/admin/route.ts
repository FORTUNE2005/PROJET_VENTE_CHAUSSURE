import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { password } = body;

  if (!password) {
    return NextResponse.json({ success: false, error: "Mot de passe requis" }, { status: 400 });
  }

  const valid = password === process.env.ADMIN_PASSWORD;

  if (!valid) {
    return NextResponse.json({ success: false, error: "Mot de passe incorrect" }, { status: 401 });
  }

  return NextResponse.json({ success: true });
}
