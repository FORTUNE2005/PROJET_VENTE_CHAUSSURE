import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");

  if (!productId) {
    return NextResponse.json({ error: "productId required" }, { status: 400 });
  }

  const reviews = await sql`SELECT * FROM reviews WHERE productid = ${productId} ORDER BY createdat DESC`;
  return NextResponse.json(reviews);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!body.productId || !body.clientId || !body.clientName || !body.rating || !body.comment) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (body.rating < 1 || body.rating > 5) {
    return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
  }

  const id = `rev-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const createdAt = new Date().toISOString();

  await sql`
    INSERT INTO reviews (id, productid, clientid, clientname, rating, comment, createdat)
    VALUES (${id}, ${body.productId}, ${body.clientId}, ${body.clientName}, ${body.rating}, ${body.comment}, ${createdAt})
  `;

  const [stats] = await sql`SELECT ROUND(AVG(rating), 1) as "avgRating", COUNT(*) as count FROM reviews WHERE productid = ${body.productId}`;

  await sql`UPDATE products SET rating = ${stats.avgRating}, reviewcount = ${stats.count} WHERE id = ${body.productId}`;

  const [review] = await sql`SELECT * FROM reviews WHERE id = ${id}`;
  return NextResponse.json(review, { status: 201 });
}
