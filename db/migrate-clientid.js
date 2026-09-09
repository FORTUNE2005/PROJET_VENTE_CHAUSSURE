const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(path.join(__dirname, "lucia.db"));
db.exec("ALTER TABLE orders ADD COLUMN clientId TEXT NOT NULL DEFAULT ''");
db.close();
