const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(path.join(__dirname, "lucia.db"));

db.exec(`
  CREATE TABLE IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY,
    productId TEXT NOT NULL,
    clientId TEXT NOT NULL,
    clientName TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    FOREIGN KEY (productId) REFERENCES products(id)
  );
`);

// Add some sample reviews for existing products
const products = db.prepare("SELECT id FROM products").all();

const sampleReviews = [
  { name: "Aya K.", rating: 5, comment: "Superbe produit, très confortable. La taille correspond parfaitement." },
  { name: "Fatou D.", rating: 4, comment: "Très joli modèle, la qualité est au rendez-vous. Livraison rapide." },
  { name: "Marie C.", rating: 5, comment: "J'adore ! Exactement comme sur la photo. Je recommande." },
  { name: "Aminata B.", rating: 4, comment: "Bon rapport qualité-prix. Je suis satisfaite de mon achat." },
  { name: "Koné S.", rating: 5, comment: "Magnifique, je porterai ce modèle avec plaisir." },
];

const insertReview = db.prepare(`
  INSERT INTO reviews (id, productId, clientId, clientName, rating, comment, createdAt)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

const stmt = db.transaction(() => {
  for (const product of products) {
    const numReviews = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < numReviews; i++) {
      const review = sampleReviews[Math.floor(Math.random() * sampleReviews.length)];
      const reviewId = `rev-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const date = new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString();
      insertReview.run(reviewId, product.id, "sample-client", review.name, review.rating, review.comment, date);
    }
  }

  // Update product ratings based on reviews
  const updateRating = db.prepare(`
    UPDATE products SET 
      rating = COALESCE((SELECT ROUND(AVG(rating), 1) FROM reviews WHERE productId = ?), 0),
      reviewCount = COALESCE((SELECT COUNT(*) FROM reviews WHERE productId = ?), 0)
    WHERE id = ?
  `);

  for (const product of products) {
    updateRating.run(product.id, product.id, product.id);
  }
});

stmt();

console.log("Reviews migration completed successfully!");
db.close();
