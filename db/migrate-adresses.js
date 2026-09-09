const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(path.join(__dirname, "lucia.db"));

db.exec(`
  CREATE TABLE IF NOT EXISTS adresses (
    id TEXT PRIMARY KEY,
    clientId TEXT NOT NULL,
    label TEXT NOT NULL,
    name TEXT NOT NULL,
    phone TEXT NOT NULL DEFAULT '',
    address TEXT NOT NULL,
    city TEXT NOT NULL DEFAULT 'Abidjan',
    isDefault INTEGER NOT NULL DEFAULT 0,
    createdAt TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

db.close();
