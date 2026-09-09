const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

const DB_PATH = path.join(__dirname, "lucia.db");
const db = new Database(DB_PATH);

const colors = {
  baskets: { bg: "#e8e4e0", accent: "#c4b5a8" },
  escarpins: { bg: "#f3e8e8", accent: "#d4a0a0" },
  sandales: { bg: "#f5f0e8", accent: "#d4c4a0" },
  bottes: { bg: "#e8e0d8", accent: "#b8a898" },
  ballerines: { bg: "#f0e8f0", accent: "#c8a8c8" },
};

const products = db.prepare("SELECT id, name, slug, category, images FROM products").all();
const update = db.prepare("UPDATE products SET images = ? WHERE id = ?");
const uploadsDir = path.join(__dirname, "..", "public", "uploads");

for (const p of products) {
  const existing = JSON.parse(p.images || "[]");
  const hasRealImage = existing.some(img => img.startsWith("/uploads/") && img.endsWith(".png"));
  if (hasRealImage) {
    console.log(`⏭ ${p.name} (a déjà une vraie image)`);
    continue;
  }

  const c = colors[p.category] || colors.baskets;
  const initials = p.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800">
  <rect width="600" height="800" fill="${c.bg}"/>
  <rect x="50" y="50" width="500" height="700" rx="20" fill="white" opacity="0.3"/>
  <text x="300" y="360" font-family="Arial, sans-serif" font-size="80" font-weight="bold" fill="${c.accent}" text-anchor="middle" opacity="0.6">${initials}</text>
  <text x="300" y="460" font-family="Arial, sans-serif" font-size="24" fill="${c.accent}" text-anchor="middle" opacity="0.5">${p.name}</text>
  <circle cx="300" cy="560" r="40" fill="${c.accent}" opacity="0.2"/>
  <path d="M280 560 L300 540 L320 560 L310 560 L310 580 L290 580 L290 560 Z" fill="${c.accent}" opacity="0.3"/>
</svg>`;

  const filename = `${p.slug}.svg`;
  const filepath = path.join(uploadsDir, filename);
  fs.writeFileSync(filepath, svg);

  update.run(JSON.stringify([`/uploads/${filename}`]), p.id);
  console.log(`✓ ${p.name} → /uploads/${filename}`);
}

db.close();
console.log("Terminé !");
