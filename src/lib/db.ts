import Database from "better-sqlite3";
import { join } from "path";

const DB_PATH = join(process.cwd(), "db", "lucia.db");

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!_db) {
    _db = new Database(DB_PATH, { readonly: false });
    _db.pragma("journal_mode = WAL");
    _db.pragma("foreign_keys = ON");
  }
  return _db;
}

export interface DbProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice: number | null;
  category: string;
  colors: string;
  sizes: string;
  images: string;
  stock: number;
  rating: number;
  reviewCount: number;
  isNew: number;
  isBestSeller: number;
  description: string;
  material: string;
  createdAt: string;
}

export interface DbOrder {
  id: string;
  customer: string;
  email: string;
  phone: string;
  address: string;
  total: number;
  status: string;
  date: string;
  items: string;
  createdAt: string;
}

export interface DbClient {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  joinDate: string;
}

export function jsonToArray(val: string): string[] {
  try { return JSON.parse(val); } catch { return []; }
}

export function jsonToNumbers(val: string): number[] {
  try { return JSON.parse(val); } catch { return []; }
}

export function jsonToItems(val: string): { name: string; qty: number; size: number }[] {
  try { return JSON.parse(val); } catch { return []; }
}
