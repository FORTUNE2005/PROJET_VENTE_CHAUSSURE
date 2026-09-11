const { neon } = require("@neondatabase/serverless");
const sql = neon("postgresql://neondb_owner:npg_2Yd1mfZlavtR@ep-aged-rain-acodpf2x-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require");

async function check() {
  const tables = await sql`SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename`;
  console.log("Tables:", tables.map(t => t.tablename));
  
  try {
    const p = await sql`SELECT COUNT(*)::int as c FROM products`;
    console.log("products:", p[0].c);
  } catch(e) { console.log("products err:", e.message?.substring(0,80)); }
  
  try {
    const c = await sql`SELECT COUNT(*)::int as c FROM clients`;
    console.log("clients:", c[0].c);
  } catch(e) { console.log("clients err:", e.message?.substring(0,80)); }
  
  process.exit(0);
}
check();
