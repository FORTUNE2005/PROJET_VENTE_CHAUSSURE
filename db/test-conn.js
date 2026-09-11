const { neon } = require("@neondatabase/serverless");
const sql = neon("postgresql://neondb_owner:npg_2Yd1mfZlavtR@ep-aged-rain-acodpf2x-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require");

sql`SELECT 1 as ok`.then(r => {
  console.log("Connection OK:", r);
  process.exit(0);
}).catch(e => {
  console.log("ERR:", e.message?.substring(0, 200));
  process.exit(1);
});
