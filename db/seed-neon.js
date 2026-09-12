const { neon } = require("@neondatabase/serverless");

const sql = neon(process.env.DATABASE_URL || "postgresql://neondb_owner:npg_2Yd1mfZlavtR@ep-aged-rain-acodpf2x-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require");

const categories = [
  { id: "baskets", slug: "baskets" },
  { id: "escarpins", slug: "escarpins-talons" },
  { id: "sandales", slug: "sandales" },
  { id: "bottes", slug: "bottes-bottines" },
  { id: "ballerines", slug: "ballerines-mocassins" },
];

const products = [
  {
    id: "p1", name: "Sneakers Élégance", slug: "sneakers-elegance",
    price: 25000, originalprice: 32000, category: "baskets",
    colors: '["Blanc","Noir","Rose"]', sizes: '[36,37,38,39,40]',
    images: '["/uploads/baskets-flyknit-grises.jpg"]', stock: 15, rating: 4.8, reviewcount: 24,
    isnew: true, isbestseller: true,
    description: "Sneakers tendance avec un design épuré et confortable au quotidien.",
    material: "Cuir synthétique et mesh"
  },
  {
    id: "p2", name: "Escarpin Rosé", slug: "escarpin-rose",
    price: 28000, category: "escarpins",
    colors: '["Rose","Nude","Noir"]', sizes: '[36,37,38,39]',
    images: '["/uploads/escarpin-rouge-fetice.jpg"]', stock: 10, rating: 4.6, reviewcount: 18,
    isnew: true, isbestseller: false,
    description: "Escarpin féminin pour sublimer vos tenues de soirée.",
    material: "Cuir véritable"
  },
  {
    id: "p3", name: "Sandale Platform", slug: "sandale-platform",
    price: 18000, originalprice: 22000, category: "sandales",
    colors: '["Doré","Argent","Noir"]', sizes: '[36,37,38,39,40]',
    images: '["/uploads/sandale-plateforme-ete.jpg"]', stock: 20, rating: 4.5, reviewcount: 32,
    isnew: false, isbestseller: true,
    description: "Sandale à plateforme pour un look décontracté et tendance.",
    material: "Souple synthétique"
  },
  {
    id: "p4", name: "Bottine Cuir", slug: "bottine-cuir",
    price: 35000, category: "bottes",
    colors: '["Marron","Noir","Camel"]', sizes: '[37,38,39,40]',
    images: '["/uploads/bottine-cuir-marron.jpg"]', stock: 8, rating: 4.9, reviewcount: 15,
    isnew: false, isbestseller: true,
    description: "Bottine en cuir véritable, élégance et confort réunis.",
    material: "Cuir véritable"
  },
  {
    id: "p5", name: "Ballerine Fine", slug: "ballerine-fine",
    price: 15000, category: "ballerines",
    colors: '["Noir","Béige","Rouge"]', sizes: '[36,37,38,39,40]',
    images: '["/uploads/ballerine-nude-confort.jpg"]', stock: 25, rating: 4.4, reviewcount: 40,
    isnew: false, isbestseller: false,
    description: "Ballerine fine et légère pour un confort toute la journée.",
    material: "Daim synthétique"
  },
  {
    id: "p6", name: "Basket Chunky", slug: "basket-chunky",
    price: 30000, originalprice: 38000, category: "baskets",
    colors: '["Blanc","Gris","Beige"]', sizes: '[37,38,39,40]',
    images: '["/uploads/baskets-chunky-blanches.jpg"]', stock: 12, rating: 4.7, reviewcount: 20,
    isnew: true, isbestseller: false,
    description: "Basket chunky tendance pour un look streetwear affirmé.",
    material: "Mesh et cuir synthétique"
  },
  {
    id: "p7", name: "Escarpin Talon Bloc", slug: "escarpin-talon-bloc",
    price: 26000, category: "escarpins",
    colors: '["Noir","Bordeaux","Vert"]', sizes: '[36,37,38,39]',
    images: '["/uploads/escarpin-velvet-noir.jpg"]', stock: 7, rating: 4.8, reviewcount: 12,
    isnew: true, isbestseller: false,
    description: "Escarpin à talon bloc pour plus de stabilité et de style.",
    material: "Cuir véritable"
  },
  {
    id: "p8", name: "Sandale Lanières", slug: "sandale-lanieres",
    price: 20000, category: "sandales",
    colors: '["Noir","Doré","Bronze"]', sizes: '[36,37,38,39,40]',
    images: '["/uploads/sandale-nude-talon.jpg"]', stock: 18, rating: 4.3, reviewcount: 28,
    isnew: false, isbestseller: false,
    description: "Sandale à lanières élégante pour toutes les occasions.",
    material: "Cuir synthétique"
  },
];

const clients = [
  { id: "c1", name: "Aya Koné", email: "aya@example.com", phone: "+225 07 08 09 10", address: "Plateau, Abidjan", joindate: "2026-01-15", password: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8" },
  { id: "c2", name: "Fatou Diallo", email: "fatou@example.com", phone: "+225 05 06 07 08", address: "Cocody, Abidjan", joindate: "2026-02-20", password: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8" },
  { id: "c3", name: "Marie Coulibaly", email: "marie@example.com", phone: "+225 01 02 03 04", address: "Marcory, Abidjan", joindate: "2026-03-10", password: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8" },
];

const orders = [
  { id: "LC-2026-0001", clientid: "c1", customer: "Aya Koné", email: "aya@example.com", phone: "+225 07 08 09 10", address: "Plateau, Abidjan", total: 53000, status: "Livrée", date: "2026-08-20", items: JSON.stringify([{ name: "Sneakers Élégance", price: 25000, quantity: 1, size: 38, color: "Blanc" }, { name: "Sandale Platform", price: 18000, quantity: 1, size: 37, color: "Doré" }]) },
  { id: "LC-2026-0002", clientid: "c2", customer: "Fatou Diallo", email: "fatou@example.com", phone: "+225 05 06 07 08", address: "Cocody, Abidjan", total: 28000, status: "En cours", date: "2026-09-01", items: JSON.stringify([{ name: "Escarpin Rosé", price: 28000, quantity: 1, size: 39, color: "Rose" }]) },
  { id: "LC-2026-0003", clientid: "c3", customer: "Marie Coulibaly", email: "marie@example.com", phone: "+225 01 02 03 04", address: "Marcory, Abidjan", total: 35000, status: "En attente", date: "2026-09-10", items: JSON.stringify([{ name: "Bottine Cuir", price: 35000, quantity: 1, size: 38, color: "Noir" }]) },
];

const reviews = [
  { productid: "p1", clientid: "c1", clientname: "Aya K.", rating: 5, comment: "Superbe sneaker, très confortable ! La taille correspond parfaitement." },
  { productid: "p1", clientid: "c2", clientname: "Fatou D.", rating: 4, comment: "Très joli modèle, la qualité est au rendez-vous." },
  { productid: "p2", clientid: "c1", clientname: "Aya K.", rating: 5, comment: "J'adore cet escarpin, exactement comme sur la photo." },
  { productid: "p3", clientid: "c3", clientname: "Marie C.", rating: 4, comment: "Belle sandale, je la porte tout le temps cet été." },
  { productid: "p4", clientid: "c2", clientname: "Fatou D.", rating: 5, comment: "La meilleure bottine que j'ai eue, cuir de qualité." },
];

async function seed() {
  console.log("Insertion des produits...");
  for (const p of products) {
    await sql`INSERT INTO products (id, name, slug, price, originalprice, category, colors, sizes, images, stock, rating, reviewcount, isnew, isbestseller, description, material)
      VALUES (${p.id}, ${p.name}, ${p.slug}, ${p.price}, ${p.originalprice || null}, ${p.category}, ${p.colors}, ${p.sizes}, ${p.images}, ${p.stock}, ${p.rating}, ${p.reviewcount}, ${p.isnew}, ${p.isbestseller}, ${p.description}, ${p.material})
      ON CONFLICT (id) DO NOTHING`;
  }
  console.log(`${products.length} produits insérés.`);

  console.log("Insertion des clients...");
  for (const c of clients) {
    await sql`INSERT INTO clients (id, name, email, phone, address, joindate, password)
      VALUES (${c.id}, ${c.name}, ${c.email}, ${c.phone}, ${c.address}, ${c.joindate}, ${c.password})
      ON CONFLICT (id) DO NOTHING`;
  }
  console.log(`${clients.length} clients insérés.`);

  console.log("Insertion des commandes...");
  for (const o of orders) {
    await sql`INSERT INTO orders (id, clientid, customer, email, phone, address, total, status, date, items)
      VALUES (${o.id}, ${o.clientid}, ${o.customer}, ${o.email}, ${o.phone}, ${o.address}, ${o.total}, ${o.status}, ${o.date}, ${o.items})
      ON CONFLICT (id) DO NOTHING`;
  }
  console.log(`${orders.length} commandes insérées.`);

  console.log("Insertion des avis...");
  for (const r of reviews) {
    const id = `rev-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    await sql`INSERT INTO reviews (id, productid, clientid, clientname, rating, comment)
      VALUES (${id}, ${r.productid}, ${r.clientid}, ${r.clientname}, ${r.rating}, ${r.comment})`;
  }
  console.log(`${reviews.length} avis insérés.`);

  // Update product ratings
  console.log("Mise à jour des ratings...");
  for (const p of products) {
    await sql`UPDATE products SET rating = COALESCE((SELECT ROUND(AVG(rating)::numeric, 1) FROM reviews WHERE productid = ${p.id}), 0),
      reviewcount = COALESCE((SELECT COUNT(*)::int FROM reviews WHERE productid = ${p.id}), 0)
      WHERE id = ${p.id}`;
  }

  console.log("Seed terminé avec succès !");
}

seed().catch(console.error);
