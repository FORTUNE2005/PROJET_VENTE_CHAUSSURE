const Database = require("better-sqlite3");
const path = require("path");

const DB_PATH = path.join(__dirname, "lucia.db");
const db = new Database(DB_PATH);

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    price INTEGER NOT NULL,
    originalPrice INTEGER,
    category TEXT NOT NULL,
    colors TEXT NOT NULL DEFAULT '[]',
    sizes TEXT NOT NULL DEFAULT '[]',
    rating REAL NOT NULL DEFAULT 0,
    reviewCount INTEGER NOT NULL DEFAULT 0,
    isNew INTEGER NOT NULL DEFAULT 0,
    isBestSeller INTEGER NOT NULL DEFAULT 0,
    description TEXT NOT NULL DEFAULT '',
    material TEXT NOT NULL DEFAULT '',
    createdAt TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    customer TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL DEFAULT '',
    address TEXT NOT NULL DEFAULT '',
    total INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'En attente',
    date TEXT NOT NULL,
    items TEXT NOT NULL DEFAULT '[]',
    createdAt TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS clients (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL DEFAULT '',
    address TEXT NOT NULL DEFAULT '',
    joinDate TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
  CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
  CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
  CREATE INDEX IF NOT EXISTS idx_orders_date ON orders(date);
`);

const insertProduct = db.prepare(`
  INSERT OR REPLACE INTO products (id, name, slug, price, originalPrice, category, colors, sizes, rating, reviewCount, isNew, isBestSeller, description, material)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const insertOrder = db.prepare(`
  INSERT OR REPLACE INTO orders (id, customer, email, phone, address, total, status, date, items)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const insertClient = db.prepare(`
  INSERT OR REPLACE INTO clients (id, name, email, phone, address, joinDate)
  VALUES (?, ?, ?, ?, ?, ?)
`);

const products = [
  ["1", "Escarpin Velvet Noir", "escarpin-velvet-noir", 55000, 75000, "escarpins", JSON.stringify(["Noir", "Bordeaux"]), JSON.stringify([35,36,37,38,39,40]), 4.8, 124, 0, 1, "Escarpin en velours avec talon aiguille élégant. Parfait pour les occasions spéciales.", "Velours"],
  ["2", "Baskets Chunky Blanches", "baskets-chunky-blanches", 49000, null, "baskets", JSON.stringify(["Blanc", "Rose"]), JSON.stringify([36,37,38,39,40,41]), 4.6, 89, 1, 0, "Baskets chunky tendance avec semelle épaisse. Confort et style au rendez-vous.", "Cuir synthétique"],
  ["3", "Sandale Nude Talon", "sandale-nude-talon", 42500, 55000, "sandales", JSON.stringify(["Nude", "Noir", "Doré"]), JSON.stringify([35,36,37,38,39]), 4.7, 67, 0, 1, "Sandale avec talon bloc, idéale pour l'été. Cuir souple et confortable.", "Cuir véritable"],
  ["4", "Bottine Cuir Marron", "bottine-cuir-marron", 75000, null, "bottes", JSON.stringify(["Marron", "Noir"]), JSON.stringify([36,37,38,39,40]), 4.9, 203, 0, 1, "Bottine en cuir véritable, details zippés. Style classique et intemporel.", "Cuir véritable"],
  ["5", "Ballerine Nude Confort", "ballerine-nude-confort", 30000, null, "ballerines", JSON.stringify(["Nude", "Noir", "Rose"]), JSON.stringify([35,36,37,38,39,40]), 4.5, 156, 0, 0, "Ballerine ultra-confortable avec emboîture parfaite. Idéale au quotidien.", "Cuir souple"],
  ["6", "Escarpin Rouge Fétiche", "escarpin-rouge-fetice", 60000, null, "escarpins", JSON.stringify(["Rouge"]), JSON.stringify([35,36,37,38,39]), 4.8, 78, 1, 0, "Escarpin rouge iconique, talon de 10cm. Le classique qui ne passe jamais.", "Cuir verni"],
  ["7", "Baskets Flyknit Grises", "baskets-flyknit-grises", 67000, 85000, "baskets", JSON.stringify(["Gris", "Bleu"]), JSON.stringify([36,37,38,39,40,41]), 4.7, 112, 0, 1, "Baskets légères en knit, semelle amortissante. Pour le sport et le quotidien.", "Mesh technique"],
  ["8", "Sandale Plateforme Été", "sandale-plateforme-ete", 35000, null, "sandales", JSON.stringify(["Blanc", "Corail"]), JSON.stringify([36,37,38,39,40]), 4.4, 45, 1, 0, "Sandale à plateforme tendance, idéal pour un look décontracté d'été.", "Sangle tressée"],
];

const orders = [
  ["LC-2026-0045", "Aya Koné", "aya@email.com", "+225 07 08 09 10", "Abidjan, Cocody", 75000, "En cours", "2026-09-07", JSON.stringify([{ name: "Bottine Cuir Marron", qty: 1, size: 38 }])],
  ["LC-2026-0044", "Fatou Diarra", "fatou@email.com", "+225 05 06 07 08", "Abidjan, Plateau", 55000, "Expédiée", "2026-09-06", JSON.stringify([{ name: "Escarpin Velvet Noir", qty: 1, size: 37 }])],
  ["LC-2026-0043", "Marie Camara", "marie@email.com", "+225 01 02 03 04", "Abidjan, Marcory", 130000, "Livrée", "2026-09-05", JSON.stringify([{ name: "Bottine Cuir Marron", qty: 1, size: 38 }, { name: "Baskets Chunky Blanches", qty: 1, size: 37 }])],
  ["LC-2026-0042", "Aya Koné", "aya@email.com", "+225 07 08 09 10", "Abidjan, Cocody", 130000, "Livrée", "2026-09-02", JSON.stringify([{ name: "Escarpin Velvet Noir", qty: 1, size: 37 }, { name: "Bottine Cuir Marron", qty: 1, size: 38 }])],
  ["LC-2026-0041", "Sarah Touré", "sarah@email.com", "+225 09 10 11 12", "Abidjan, Treichville", 49000, "En attente", "2026-09-01", JSON.stringify([{ name: "Baskets Chunky Blanches", qty: 1, size: 39 }])],
];

const clients = [
  ["1", "Aya Koné", "aya.kone@email.com", "+225 07 08 09 10", "Abidjan, Cocody", "2026-06-15"],
  ["2", "Fatou Diarra", "fatou.diarra@email.com", "+225 05 06 07 08", "Abidjan, Plateau", "2026-07-20"],
  ["3", "Marie Camara", "marie.camara@email.com", "+225 01 02 03 04", "Abidjan, Marcory", "2026-08-01"],
  ["4", "Sarah Touré", "sarah.toure@email.com", "+225 09 10 11 12", "Abidjan, Treichville", "2026-08-25"],
  ["5", "Aissatou Bah", "aissatou.bah@email.com", "+225 06 07 08 09", "Abidjan, Yopougon", "2026-08-28"],
];

const seed = db.transaction(() => {
  for (const p of products) insertProduct.run(...p);
  for (const o of orders) insertOrder.run(...o);
  for (const c of clients) insertClient.run(...c);
});

seed();

console.log(`✓ ${products.length} produits`);
console.log(`✓ ${orders.length} commandes`);
console.log(`✓ ${clients.length} clients`);
console.log("Base SQLite créée :", DB_PATH);

db.close();
