const { neon } = require("@neondatabase/serverless");

const sql = neon("postgresql://neondb_owner:npg_2Yd1mfZlavtR@ep-aged-rain-acodpf2x-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require");

async function migrate() {
  try {
    await sql`CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      price NUMERIC NOT NULL DEFAULT 0,
      originalprice NUMERIC,
      category TEXT NOT NULL DEFAULT 'baskets',
      colors TEXT NOT NULL DEFAULT '[]',
      sizes TEXT NOT NULL DEFAULT '[]',
      images TEXT NOT NULL DEFAULT '[]',
      stock INTEGER NOT NULL DEFAULT 0,
      rating NUMERIC NOT NULL DEFAULT 0,
      reviewcount INTEGER NOT NULL DEFAULT 0,
      isnew BOOLEAN NOT NULL DEFAULT false,
      isbestseller BOOLEAN NOT NULL DEFAULT false,
      description TEXT NOT NULL DEFAULT '',
      material TEXT NOT NULL DEFAULT '',
      createdat TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`;
    console.log("Table products créée !");
  } catch (e) {
    console.log("products:", e.message);
  }
}

migrate().then(() => process.exit(0));
