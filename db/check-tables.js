const { neon } = require("@neondatabase/serverless");

const sql = neon("postgresql://neondb_owner:npg_2Yd1mfZlavtR@ep-aged-rain-acodpf2x-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require");

async function check() {
  const tables = await sql`SELECT tablename FROM pg_tables WHERE schemaname = 'public'`;
  console.log("Tables existantes:", tables.map(t => t.tablename));
  
  const count = await sql`SELECT COUNT(*)::int as c FROM products`;
  console.log("Produits:", count[0].c);
}

check().then(() => process.exit(0));
