const { neon } = require("@neondatabase/serverless");
const fs = require("fs");
const path = require("path");

async function migrate() {
  const sql = neon(process.env.DATABASE_URL || "postgresql://neondb_owner:npg_2Yd1mfZlavtR@ep-aged-rain-acodpf2x-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require");
  
  const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf-8");
  
  const statements = schema
    .split(";")
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith("--"));

  for (const stmt of statements) {
    try {
      await sql.unsafe(stmt);
      console.log("OK:", stmt.substring(0, 60) + "...");
    } catch (e) {
      console.log("SKIP:", e.message?.substring(0, 80));
    }
  }
  
  console.log("Migration terminée !");
}

migrate().catch(console.error);
