const { neon } = require("@neondatabase/serverless");

const sql = neon(process.env.DATABASE_URL || "postgresql://neondb_owner:npg_2Yd1mfZlavtR@ep-aged-rain-acodpf2x-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require");

const imageMapping = {
  "p1": '["/uploads/baskets-flyknit-grises.jpg"]',
  "p2": '["/uploads/escarpin-rouge-fetice.jpg"]',
  "p3": '["/uploads/sandale-plateforme-ete.jpg"]',
  "p4": '["/uploads/bottine-cuir-marron.jpg"]',
  "p5": '["/uploads/ballerine-nude-confort.jpg"]',
  "p6": '["/uploads/baskets-chunky-blanches.jpg"]',
  "p7": '["/uploads/escarpin-velvet-noir.jpg"]',
  "p8": '["/uploads/sandale-nude-talon.jpg"]',
};

async function fixImages() {
  console.log("Correction des chemins d'images...");

  for (const [id, images] of Object.entries(imageMapping)) {
    await sql`UPDATE products SET images = ${images} WHERE id = ${id}`;
    console.log(`  Produit ${id} → ${images}`);
  }

  console.log("Terminé !");
}

fixImages().catch(console.error);
