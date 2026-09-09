const Database = require("better-sqlite3");
const path = require("path");

const DB_PATH = path.join(__dirname, "lucia.db");
const db = new Database(DB_PATH);

const cols = db.prepare("PRAGMA table_info(products)").all().map(c => c.name);
if (!cols.includes("images")) {
  db.exec("ALTER TABLE products ADD COLUMN images TEXT NOT NULL DEFAULT '[]'");
  console.log("Colonne images ajoutée");
} else {
  console.log("Colonne images existe déjà");
}

// Update existing products with placeholder images
const products = db.prepare("SELECT id, slug FROM products").all();
const update = db.prepare("UPDATE products SET images = ? WHERE id = ?");
for (const p of products) {
  const current = db.prepare("SELECT images FROM products WHERE id = ?").get(p.id);
  if (current && current.images === "[]") {
    update.run(JSON.stringify([`/products/${p.slug}.jpg`]), p.id);
  }
}

db.close();
console.log("Migration terminée");
