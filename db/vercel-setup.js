const { execSync } = require("child_process");

const DB_URL = "postgresql://neondb_owner:npg_2Yd1mfZlavtR@ep-aged-rain-acodpf2x-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require";

// Use vercel project ls to find the project ID
try {
  const output = execSync("npx vercel project ls --yes --token=", { encoding: "utf8", timeout: 15000 });
  console.log(output);
} catch (e) {
  console.log("Error:", e.message?.substring(0, 200));
}
