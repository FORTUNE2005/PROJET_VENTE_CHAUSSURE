const { neon } = require("@neondatabase/serverless");
const sql = neon("postgresql://neondb_owner:npg_2Yd1mfZlavtR@ep-aged-rain-acodpf2x-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require");

async function run() {
  try {
    await sql`CREATE TABLE IF NOT EXISTS clients (id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT NOT NULL DEFAULT '', address TEXT NOT NULL DEFAULT '', password TEXT NOT NULL, joindate DATE NOT NULL DEFAULT CURRENT_DATE)`;
    console.log("clients OK");
  } catch(e) { console.log("clients ERR:", e.message?.substring(0,100)); }

  try {
    await sql`CREATE TABLE IF NOT EXISTS orders (id TEXT PRIMARY KEY, clientid TEXT NOT NULL DEFAULT '', customer TEXT NOT NULL DEFAULT '', email TEXT NOT NULL DEFAULT '', phone TEXT NOT NULL DEFAULT '', address TEXT NOT NULL DEFAULT '', total NUMERIC NOT NULL DEFAULT 0, status TEXT NOT NULL DEFAULT 'En attente', date DATE NOT NULL DEFAULT CURRENT_DATE, items TEXT NOT NULL DEFAULT '[]', createdat TIMESTAMPTZ NOT NULL DEFAULT NOW())`;
    console.log("orders OK");
  } catch(e) { console.log("orders ERR:", e.message?.substring(0,100)); }

  try {
    await sql`CREATE TABLE IF NOT EXISTS favorites (id TEXT PRIMARY KEY, clientid TEXT NOT NULL, productid TEXT NOT NULL, createdat TIMESTAMPTZ NOT NULL DEFAULT NOW())`;
    console.log("favorites OK");
  } catch(e) { console.log("favorites ERR:", e.message?.substring(0,100)); }

  try {
    await sql`CREATE TABLE IF NOT EXISTS adresses (id TEXT PRIMARY KEY, clientid TEXT NOT NULL, label TEXT NOT NULL DEFAULT '', name TEXT NOT NULL DEFAULT '', phone TEXT NOT NULL DEFAULT '', address TEXT NOT NULL DEFAULT '', city TEXT NOT NULL DEFAULT 'Abidjan', isdefault BOOLEAN NOT NULL DEFAULT false, createdat TIMESTAMPTZ NOT NULL DEFAULT NOW())`;
    console.log("adresses OK");
  } catch(e) { console.log("adresses ERR:", e.message?.substring(0,100)); }

  try {
    await sql`CREATE TABLE IF NOT EXISTS newsletter (id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, createdat TIMESTAMPTZ NOT NULL DEFAULT NOW())`;
    console.log("newsletter OK");
  } catch(e) { console.log("newsletter ERR:", e.message?.substring(0,100)); }

  try {
    await sql`CREATE TABLE IF NOT EXISTS messages (id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL, subject TEXT NOT NULL DEFAULT '', message TEXT NOT NULL, createdat TIMESTAMPTZ NOT NULL DEFAULT NOW())`;
    console.log("messages OK");
  } catch(e) { console.log("messages ERR:", e.message?.substring(0,100)); }

  try {
    await sql`CREATE TABLE IF NOT EXISTS reviews (id TEXT PRIMARY KEY, productid TEXT NOT NULL, clientid TEXT NOT NULL, clientname TEXT NOT NULL, rating INTEGER NOT NULL, comment TEXT NOT NULL, createdat TIMESTAMPTZ NOT NULL DEFAULT NOW())`;
    console.log("reviews OK");
  } catch(e) { console.log("reviews ERR:", e.message?.substring(0,100)); }

  try {
    await sql`CREATE TABLE IF NOT EXISTS blog_posts (id TEXT PRIMARY KEY, title TEXT NOT NULL, slug TEXT NOT NULL UNIQUE, excerpt TEXT NOT NULL, content TEXT NOT NULL, image TEXT, category TEXT NOT NULL DEFAULT 'Conseils', author TEXT NOT NULL DEFAULT 'Lucia', published BOOLEAN NOT NULL DEFAULT true, createdat TIMESTAMPTZ NOT NULL DEFAULT NOW(), updatedat TIMESTAMPTZ NOT NULL DEFAULT NOW())`;
    console.log("blog_posts OK");
  } catch(e) { console.log("blog_posts ERR:", e.message?.substring(0,100)); }

  process.exit(0);
}
run();
