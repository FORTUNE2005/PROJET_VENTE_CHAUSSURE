export const metadata = {
  title: "Dashboard | Admin Lucia Chaussures",
};

import { getDb } from "@/lib/db";
import DashboardClient from "./DashboardClient";

function getDashboardData() {
  const db = getDb();

  const now = new Date();
  const thisMonthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split("T")[0];
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split("T")[0];

  const thisMonth = db.prepare(`
    SELECT COALESCE(SUM(total), 0) as ca, COUNT(*) as orders
    FROM orders WHERE date >= ?
  `).get(thisMonthStart) as { ca: number; orders: number };

  const lastMonth = db.prepare(`
    SELECT COALESCE(SUM(total), 0) as ca, COUNT(*) as orders
    FROM orders WHERE date >= ? AND date <= ?
  `).get(lastMonthStart, lastMonthEnd) as { ca: number; orders: number };

  const totalClients = (db.prepare("SELECT COUNT(*) as c FROM clients").get() as { c: number }).c;

  const totalCA = (db.prepare("SELECT COALESCE(SUM(total), 0) as ca FROM orders").get() as { ca: number }).ca;
  const totalOrders = (db.prepare("SELECT COUNT(*) as c FROM orders").get() as { c: number }).c;
  const avgCart = totalOrders > 0 ? Math.round(totalCA / totalOrders) : 0;

  const caTrend = lastMonth.ca > 0 ? Math.round(((thisMonth.ca - lastMonth.ca) / lastMonth.ca) * 100) : 0;
  const ordersTrend = lastMonth.orders > 0 ? Math.round(((thisMonth.orders - lastMonth.orders) / lastMonth.orders) * 100) : 0;

  const chart30 = db.prepare(`
    SELECT date, SUM(total) as ca
    FROM orders
    WHERE date >= date('now', '-30 days')
    GROUP BY date ORDER BY date ASC
  `).all() as { date: string; ca: number }[];

  const topProducts = db.prepare(`
    SELECT p.name, p.price, p.images, SUM(json_extract(j.value, '$.qty')) as sold
    FROM orders o, json_each(o.items) j
    JOIN products p ON p.name = json_extract(j.value, '$.name')
    GROUP BY p.id
    ORDER BY sold DESC
    LIMIT 5
  `).all() as { name: string; price: number; images: string; sold: number }[];

  const lowStock = db.prepare(`
    SELECT id, name, slug, stock, images
    FROM products WHERE stock <= 5
    ORDER BY stock ASC
    LIMIT 5
  `).all() as { id: string; name: string; slug: string; stock: number; images: string }[];

  const recentOrders = db.prepare(`
    SELECT id, customer, total, status, date
    FROM orders ORDER BY date DESC LIMIT 5
  `).all() as { id: string; customer: string; total: number; status: string; date: string }[];

  return {
    stats: { totalCA, totalOrders, totalClients, avgCart, caTrend, ordersTrend },
    chart30,
    topProducts,
    lowStock,
    recentOrders,
  };
}

export default function AdminDashboard() {
  const data = getDashboardData();

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-bold text-stone-900">Dashboard</h1>
        <p className="text-sm text-stone-500 mt-1">Vue d&apos;ensemble de votre boutique</p>
      </div>
      <DashboardClient {...data} />
    </div>
  );
}
