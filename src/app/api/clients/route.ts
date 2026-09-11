import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
  const rows = await sql`SELECT * FROM clients ORDER BY joindate DESC`;
  return NextResponse.json(rows);
}
