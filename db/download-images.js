const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path");

const uploadsDir = path.join(__dirname, "..", "public", "uploads");

const images = [
  // Escarpin Velvet Noir - black heels
  { slug: "escarpin-velvet-noir", url: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&h=800&fit=crop&q=80" },
  // Baskets Chunky Blanches - white chunky sneakers
  { slug: "baskets-chunky-blanches", url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=800&fit=crop&q=80" },
  // Sandale Nude Talon - nude heeled sandals
  { slug: "sandale-nude-talon", url: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&h=800&fit=crop&q=80" },
  // Bottine Cuir Marron - brown leather boots
  { slug: "bottine-cuir-marron", url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=800&fit=crop&q=80" },
  // Ballerine Nude Confort - nude flats
  { slug: "ballerine-nude-confort", url: "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&h=800&fit=crop&q=80" },
  // Escarpin Rouge Fétiche - red heels
  { slug: "escarpin-rouge-fetice", url: "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=600&h=800&fit=crop&q=80" },
  // Baskets Flyknit Grises - grey knit sneakers
  { slug: "baskets-flyknit-grises", url: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=600&h=800&fit=crop&q=80" },
  // Sandale Plateforme Été - platform sandals
  { slug: "sandale-plateforme-ete", url: "https://images.unsplash.com/photo-1562183241-b937e95585b6?w=600&h=800&fit=crop&q=80" },
];

function download(url, filepath) {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith("https") ? https : http;
    const req = proto.get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return download(res.headers.location, filepath).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        return;
      }
      const file = fs.createWriteStream(filepath);
      res.pipe(file);
      file.once("finish", () => { file.close(); resolve(); });
      file.once("error", reject);
    });
    req.on("error", reject);
    req.setTimeout(15000, () => { req.destroy(); reject(new Error("Timeout")); });
  });
}

async function main() {
  const Database = require("better-sqlite3");
  const db = new Database(path.join(__dirname, "lucia.db"));
  const update = db.prepare("UPDATE products SET images = ? WHERE slug = ?");

  for (const img of images) {
    const filepath = path.join(uploadsDir, `${img.slug}.jpg`);
    try {
      await download(img.url, filepath);
      const stat = fs.statSync(filepath);
      if (stat.size > 1000) {
        update.run(JSON.stringify([`/uploads/${img.slug}.jpg`]), img.slug);
        console.log(`✓ ${img.slug} (${Math.round(stat.size / 1024)} KB)`);
      } else {
        console.log(`✗ ${img.slug} — fichier trop petit, ignoré`);
      }
    } catch (e) {
      console.log(`✗ ${img.slug} — ${e.message}`);
    }
  }

  db.close();
}

main();
