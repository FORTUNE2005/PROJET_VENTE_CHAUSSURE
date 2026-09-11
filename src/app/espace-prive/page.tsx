export const metadata = {
  title: "Dashboard | Admin Lucia Chaussures",
};

import { sql } from "@/lib/db";
import DashboardClient from "./DashboardClient";

async function getDashboardData() {
  const now = new Date();
  const thisMonthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split("T")[0];
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split("T")[0];

  const thisMonthResult = await sql`SELECT COALESCE(SUM(total), 0) as ca, COUNT(*) as orders FROM orders WHERE date >= ${thisMonthStart}`;
  const thisMonth = { ca: Number(thisMonthResult[0].ca), orders: Number(thisMonthResult[0].orders) };

  const lastMonthResult = await sql`SELECT COALESCE(SUM(total), 0) as ca, COUNT(*) as orders FROM orders WHERE date >= ${lastMonthStart} AND date <= ${lastMonthEnd}`;
  const lastMonth = { ca: Number(lastMonthResult[0].ca), orders: Number(lastMonthResult[0].orders) };

  const totalClientsResult = await sql`SELECT COUNT(*) as c FROM clients`;
  const totalClients = Number(totalClientsResult[0].c);

  const totalCAResult = await sql`SELECT COALESCE(SUM(total), 0) as ca FROM orders`;
  const totalCA = Number(totalCAResult[0].ca);

  const totalOrdersResult = await sql`SELECT COUNT(*) as c FROM orders`;
  const totalOrders = Number(totalOrdersResult[0].c);

  const avgCart = totalOrders > 0 ? Math.round(totalCA / totalOrders) : 0;

  const caTrend = lastMonth.ca > 0 ? Math.round(((thisMonth.ca - lastMonth.ca) / lastMonth.ca) * 100) : 0;
  const ordersTrend = lastMonth.orders > 0 ? Math.round(((thisMonth.orders - lastMonth.orders) / lastMonth.orders) * 100) : 0;

  const chart30 = await sql`SELECT date, SUM(total) as ca FROM orders WHERE date >= CURRENT_DATE - INTERVAL '30 days' GROUP BY date ORDER BY date ASC`;

  const topProducts = await sql`
    SELECT p.name, p.price, p.images, SUM((j.value->>'qty')::int) as sold
    FROM orders o, jsonb_array_elements(o.items::jsonb) AS j
    JOIN products p ON p.name = j.value->>'name'
    GROUP BY p.id
    ORDER BY sold DESC
    LIMIT 5
  `;

  const lowStock = await sql`SELECT id, name, slug, stock, images FROM products WHERE stock <= 5 ORDER BY stock ASC LIMIT 5`;

  const recentOrders = await sql`SELECT id, customer, total, status, date FROM orders ORDER BY date DESC LIMIT 5`;

  return {
    stats: { totalCA, totalOrders, totalClients, avgCart, caTrend, ordersTrend },
    chart30: chart30 as unknown as { date: string; ca: number }[],
    topProducts: topProducts as unknown as { name: string; price: number; images: string; sold: number }[],
    lowStock: lowStock as unknown as { id: string; name: string; slug: string; stock: number; images: string }[],
    recentOrders: recentOrders as unknown as { id: string; customer: string; total: number; status: string; date: string }[],
  };
}

export default async function AdminDashboard() {
  const data = await getDashboardData();

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
