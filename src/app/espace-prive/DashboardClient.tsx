"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/format";
import Link from "next/link";

interface Stats {
  totalCA: number;
  totalOrders: number;
  totalClients: number;
  avgCart: number;
  caTrend: number;
  ordersTrend: number;
}

interface Order {
  id: string;
  customer: string;
  total: number;
  status: string;
  date: string;
}

interface TopProduct {
  name: string;
  price: number;
  images: string;
  sold: number;
}

interface LowStock {
  id: string;
  name: string;
  slug: string;
  stock: number;
  images: string;
}

interface ChartPoint {
  date: string;
  ca: number;
}

const statusColors: Record<string, string> = {
  "En attente": "bg-amber-100 text-amber-700",
  "En cours": "bg-blue-100 text-blue-700",
  "Expédiée": "bg-purple-100 text-purple-700",
  "Livrée": "bg-green-100 text-green-700",
};

function Trend({ value }: { value: number }) {
  if (value === 0) return <span className="text-xs text-stone-400">—</span>;
  const up = value > 0;
  return (
    <span className={`text-xs font-medium ${up ? "text-green-600" : "text-red-500"}`}>
      {up ? "↑" : "↓"} {Math.abs(value)}%
    </span>
  );
}

function MiniChart({ data }: { data: ChartPoint[] }) {
  const [active, setActive] = useState<number>(-1);
  const svgRef = useState<SVGSVGElement | null>(null);

  if (data.length === 0) return <div className="h-48 flex items-center justify-center text-xs text-stone-400">Pas encore de données</div>;

  const W = 800;
  const H = 220;
  const padTop = 30;
  const padBot = 30;
  const chartH = H - padTop - padBot;
  const chartW = W;

  const max = Math.max(...data.map((d) => d.ca), 1);

  const points = data.map((d, i) => ({
    x: data.length === 1 ? chartW / 2 : (i / (data.length - 1)) * chartW,
    y: padTop + chartH - (d.ca / max) * chartH,
    ...d,
  }));

  const line = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const area = `${line} L${points[points.length - 1].x},${padTop + chartH} L${points[0].x},${padTop + chartH} Z`;

  const activeIdx = active >= 0 ? active : data.length - 1;
  const ap = points[activeIdx];

  const handleMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const scaleX = W / rect.width;
    const mx = (e.clientX - rect.left) * scaleX;
    let closest = 0;
    let minDist = Infinity;
    points.forEach((p, i) => {
      const dist = Math.abs(p.x - mx);
      if (dist < minDist) { minDist = dist; closest = i; }
    });
    setActive(closest);
  };

  return (
    <div>
      {/* Active value header */}
      <div className="flex items-baseline gap-3 mb-2">
        <span className="text-2xl font-bold text-stone-900">{formatPrice(ap.ca)}</span>
        <span className="text-sm text-stone-400">{ap.date}</span>
      </div>

      <svg
        ref={(el) => { (svgRef as unknown as { current: SVGSVGElement | null }).current = el; }}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full cursor-crosshair"
        preserveAspectRatio="none"
        onMouseMove={handleMove}
        onMouseLeave={() => setActive(-1)}
      >
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fb7185" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#fb7185" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct) => (
          <line key={pct} x1={0} y1={padTop + chartH - pct * chartH} x2={W} y2={padTop + chartH - pct * chartH} stroke="#e7e5e4" strokeWidth="1" />
        ))}

        {/* Area */}
        <path d={area} fill="url(#areaGrad)" />

        {/* Line */}
        <path d={line} fill="none" stroke="#fb7185" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

        {/* Crosshair */}
        {active >= 0 && (
          <>
            <line x1={ap.x} y1={padTop} x2={ap.x} y2={padTop + chartH} stroke="#d6d3d1" strokeWidth="1" strokeDasharray="4 4" />
            <circle cx={ap.x} cy={ap.y} r="8" fill="#fb7185" fillOpacity="0.2" />
            <circle cx={ap.x} cy={ap.y} r="5" fill="white" stroke="#fb7185" strokeWidth="3" />
          </>
        )}

        {/* Default dot when no hover */}
        {active < 0 && (
          <circle cx={ap.x} cy={ap.y} r="5" fill="white" stroke="#fb7185" strokeWidth="3" />
        )}

        {/* Y-axis labels */}
        {[0, 0.5, 1].map((pct) => (
          <text key={pct} x={W - 4} y={padTop + chartH - pct * chartH - 4} textAnchor="end" className="fill-stone-400 text-[11px]">
            {formatPrice(Math.round(max * pct))}
          </text>
        ))}
      </svg>

      {/* X-axis labels */}
      <div className="flex justify-between mt-1 text-[10px] text-stone-400 px-1">
        <span>{data[0].date}</span>
        {data.length > 2 && <span>{data[Math.floor(data.length / 2)].date}</span>}
        <span>{data[data.length - 1].date}</span>
      </div>
    </div>
  );
}

function parseImages(val: string): string[] {
  try { return JSON.parse(val); } catch { return []; }
}

function Thumb({ images, size = "w-10 h-10" }: { images: string; size?: string }) {
  const imgs = parseImages(images);
  if (imgs[0]) return <img src={imgs[0]} alt="" className={`${size} object-cover`} />;
  return (
    <div className={`${size} flex items-center justify-center bg-stone-100`}>
      <svg className="w-5 h-5 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
      </svg>
    </div>
  );
}

export default function DashboardClient({
  stats,
  chart30,
  topProducts,
  lowStock,
  recentOrders,
}: {
  stats: Stats;
  chart30: ChartPoint[];
  topProducts: TopProduct[];
  lowStock: LowStock[];
  recentOrders: Order[];
}) {
  const [hoveredOrder, setHoveredOrder] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      {/* Stat Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-rose-600 text-white rounded-xl p-5 lg:col-span-1">
          <div className="flex items-center justify-between mb-3">
            <svg className="w-5 h-5 text-rose-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659 1.171-1.671-1.171-1.671M12 18.25l-3.75-3.75M12 18.25l3.75-3.75" />
            </svg>
            <Trend value={stats.caTrend} />
          </div>
          <p className="text-2xl font-bold">{formatPrice(stats.totalCA)}</p>
          <p className="text-xs text-rose-200 mt-1">Chiffre d&apos;affaires</p>
        </div>
        {[
          { label: "Commandes", value: String(stats.totalOrders), trend: stats.ordersTrend, icon: "M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" },
          { label: "Clients", value: String(stats.totalClients), trend: 0, icon: "M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" },
          { label: "Panier moyen", value: formatPrice(stats.avgCart), trend: 0, icon: "M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-5 border border-stone-100">
            <div className="flex items-center justify-between mb-3">
              <svg className="w-5 h-5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
              </svg>
              <Trend value={s.trend} />
            </div>
            <p className="text-2xl font-bold text-stone-900">{s.value}</p>
            <p className="text-xs text-stone-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Chart + Low Stock */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-stone-100 p-6">
          <h2 className="font-medium text-stone-900 mb-4">Chiffre d&apos;affaires — 30 derniers jours</h2>
          <MiniChart data={chart30} />
        </div>

        <div className="bg-white rounded-xl border border-stone-100 p-6">
          <h2 className="font-medium text-stone-900 mb-4">Stock faible</h2>
          {lowStock.length === 0 ? (
            <p className="text-xs text-stone-400 py-4 text-center">Tous les stocks sont OK</p>
          ) : (
            <div className="space-y-3">
              {lowStock.map((p) => (
                <div key={p.id} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                    <Thumb images={p.images} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-stone-900 truncate">{p.name}</p>
                    <p className={`text-xs font-medium ${p.stock === 0 ? "text-red-600" : "text-amber-600"}`}>
                      {p.stock === 0 ? "Rupture de stock" : `${p.stock} restant${p.stock > 1 ? "s" : ""}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-xl border border-stone-100 p-6">
        <h2 className="font-medium text-stone-900 mb-4">Produits les plus vendus</h2>
        {topProducts.length === 0 ? (
          <p className="text-xs text-stone-400 py-4 text-center">Pas encore de ventes</p>
        ) : (
          <div className="space-y-3">
            {topProducts.map((p, i) => (
              <div key={i} className="flex items-center gap-4">
                <span className="text-sm font-bold text-stone-300 w-5 text-center">{i + 1}</span>
                <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                  <Thumb images={p.images} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-stone-900 truncate">{p.name}</p>
                  <p className="text-xs text-stone-400">{formatPrice(p.price)}</p>
                </div>
                <span className="text-xs font-medium text-stone-500 bg-stone-100 px-2.5 py-1 rounded-full">{p.sold} vendus</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border border-stone-100">
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
          <h2 className="font-medium text-stone-900">Commandes récentes</h2>
          <Link href="/espace-prive/commandes" className="bg-stone-900 text-white text-xs font-medium px-4 py-2 rounded-full hover:bg-stone-800 transition-colors">
            Tout voir
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-stone-100">
                <th className="text-left text-xs font-medium text-stone-500 uppercase tracking-wider px-6 py-3">Commande</th>
                <th className="text-left text-xs font-medium text-stone-500 uppercase tracking-wider px-6 py-3">Client</th>
                <th className="text-left text-xs font-medium text-stone-500 uppercase tracking-wider px-6 py-3">Date</th>
                <th className="text-left text-xs font-medium text-stone-500 uppercase tracking-wider px-6 py-3">Total</th>
                <th className="text-left text-xs font-medium text-stone-500 uppercase tracking-wider px-6 py-3">Statut</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-stone-50 last:border-0 hover:bg-stone-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-stone-900">{order.id}</td>
                  <td className="px-6 py-4 text-sm text-stone-600">{order.customer}</td>
                  <td className="px-6 py-4 text-sm text-stone-500">{order.date}</td>
                  <td className="px-6 py-4 text-sm font-medium text-stone-900">{formatPrice(order.total)}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[order.status] || "bg-stone-100 text-stone-600"}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
