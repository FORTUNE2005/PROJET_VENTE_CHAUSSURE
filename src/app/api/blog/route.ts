import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (slug) {
    const [post] = await sql`SELECT * FROM blog_posts WHERE slug = ${slug} AND published = true`;
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(post);
  }

  const posts = await sql`SELECT id, title, slug, excerpt, image, category, author, createdat FROM blog_posts WHERE published = true ORDER BY createdat DESC`;
  return NextResponse.json(posts);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const id = `blog-${Date.now()}`;
  const slug = body.title?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "";
  const now = new Date().toISOString();

  await sql`
    INSERT INTO blog_posts (id, title, slug, excerpt, content, image, category, author, published, createdat, updatedat)
    VALUES (${id}, ${body.title || ""}, ${slug}, ${body.excerpt || ""}, ${body.content || ""},
      ${body.image || "/blog/default.jpg"}, ${body.category || "Conseils"},
      ${body.author || "Lucia"}, ${body.published !== false}, ${now}, ${now})
  `;

  const [post] = await sql`SELECT * FROM blog_posts WHERE id = ${id}`;
  return NextResponse.json(post, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  if (!body.id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const now = new Date().toISOString();

  await sql`
    UPDATE blog_posts SET title = ${body.title || ""}, excerpt = ${body.excerpt || ""}, content = ${body.content || ""}, image = ${body.image || "/blog/default.jpg"},
    category = ${body.category || "Conseils"}, published = ${body.published !== false}, updatedat = ${now} WHERE id = ${body.id}
  `;

  const [post] = await sql`SELECT * FROM blog_posts WHERE id = ${body.id}`;
  return NextResponse.json(post);
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  await sql`DELETE FROM blog_posts WHERE id = ${id}`;
  return NextResponse.json({ success: true });
}
