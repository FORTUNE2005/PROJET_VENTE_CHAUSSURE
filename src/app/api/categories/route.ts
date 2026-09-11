import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
  const counts = await sql`SELECT category, COUNT(*) as count FROM products GROUP BY category`;

  const countMap: Record<string, number> = {};
  for (const row of counts) {
    countMap[row.category] = Number(row.count);
  }

  return NextResponse.json(countMap);
}
