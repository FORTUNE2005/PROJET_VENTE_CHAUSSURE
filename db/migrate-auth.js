const Database = require("better-sqlite3");
const path = require("path");
const crypto = require("crypto");

const DB_PATH = path.join(__dirname, "lucia.db");
const db = new Database(DB_PATH);

const cols = db.prepare("PRAGMA table_info(clients)").all().map(c => c.name);
if (!cols.includes("password")) {
  db.exec("ALTER TABLE clients ADD COLUMN password TEXT NOT NULL DEFAULT ''");
}

db.exec(`
  CREATE TABLE IF NOT EXISTS favorites (
    id TEXT PRIMARY KEY,
    clientId TEXT NOT NULL,
    productId TEXT NOT NULL,
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(clientId, productId)
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS newsletter (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    createdAt TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL DEFAULT '',
    message TEXT NOT NULL,
    createdAt TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

const clients = db.prepare("SELECT id, password FROM clients").all();
const updatePassword = db.prepare("UPDATE clients SET password = ? WHERE id = ?");
for (const c of clients) {
  if (!c.password) {
    const hash = crypto.createHash("sha256").update("password123").digest("hex");
    updatePassword.run(hash, c.id);
  }
}

db.close();
