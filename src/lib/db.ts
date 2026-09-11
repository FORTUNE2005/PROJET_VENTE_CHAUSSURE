import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export { sql };

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
  reviewcount: number;
  isnew: number;
  isbestseller: number;
  description: string;
  material: string;
  createdat: string;
}

export interface DbOrder {
  id: string;
  clientid: string;
  customer: string;
  email: string;
  phone: string;
  address: string;
  total: number;
  status: string;
  date: string;
  items: string;
  createdat: string;
}

export interface DbClient {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  password: string;
  joindate: string;
}

export function jsonToArray(val: string): string[] {
  try { return JSON.parse(val); } catch { return []; }
}

export function jsonToNumbers(val: string): number[] {
  try { return JSON.parse(val); } catch { return []; }
}
