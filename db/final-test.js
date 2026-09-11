const { neon } = require("@neondatabase/serverless");
const sql = neon("postgresql://neondb_owner:npg_2Yd1mfZlavtR@ep-aged-rain-acodpf2x-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require");
async function test() { const r = await sql`SELECT 1 as ok`; console.log("DB OK:", r); process.exit(0); }
test();
