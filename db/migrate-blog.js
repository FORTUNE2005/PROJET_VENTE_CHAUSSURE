const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(path.join(__dirname, "lucia.db"));

db.exec(`
  CREATE TABLE IF NOT EXISTS blog_posts (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    image TEXT,
    category TEXT NOT NULL DEFAULT 'Conseils',
    author TEXT NOT NULL DEFAULT 'Lucia',
    published INTEGER NOT NULL DEFAULT 1,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  );
`);

const samplePosts = [
  {
    title: "Comment choisir la bonne pointure ?",
    slug: "choisir-bonne-pointure",
    excerpt: "Découvrez nos conseils pour trouver la taille idéale et éviter les mauvaises surprises.",
    content: `Le choix de la bonne pointure est essentiel pour le confort au quotidien. Voici quelques conseils :

**Mesurer ses pieds le soir**
Les pieds gonflent légèrement en fin de journée. C'est le moment idéal pour mesurer sa pointure.

**Utiliser un goniomètre**
Cet outil simple permet de mesurer précisément la longueur et la largeur du pied.

**Consulter le guide des tailles**
Chaque marque a ses propres normes. Consultez toujours notre guide des tailles avant de commander.

**Ne pas hésiter à essayer**
Si vous hésitez entre deux tailles, choisissez la plus grande pour plus de confort.`,
    category: "Conseils",
    author: "Lucia",
  },
  {
    title: "Les tendances chaussures de cette saison",
    slug: "tendances-chaussures-saison",
    excerpt: "Les couleurs, matériaux et styles qui font sensation cette saison.",
    content: `Cette saison, les tendances chaussures sont riches et variées :

**Les couleurs vives**
Le rose poudré, le vert sauge et le bleu ciel dominent les collections.

**Les matériaux naturels**
Le cuir verné, la toile et le raphia sont à l'honneur.

**Les plateformes**
Elles font un retour spectaculaire, offrant style et confort.

**Les sandales à lanières**
Élégantes et pratiques, elles accompagnent toutes les tenues.`,
    category: "Tendances",
    author: "Lucia",
  },
  {
    title: "Entretien de vos chaussures en cuir",
    slug: "entretien-chaussures-cuir",
    excerpt: "Les gestes essentiels pour prolonger la durée de vie de vos chaussures en cuir.",
    content: `Le cuir est un matériau noble qui nécessite un entretien régulier :

**Le nettoyage**
Utilisez une brosse à poils doux pour enlever la poussière. Passez un chiffon légèrement humide pour les taches.

**Le cirage**
Appliquez un cirage adapté à la couleur du cuir. Laissez sécher puis brossez pour obtenir le brillant souhaité.

**L'imperméabilisation**
Spray un protecteur imperméable avant la première utilisation et régulièrement ensuite.

**Le stockage**
Conservez vos chaussures à l'abri de l'humidité et de la chaleur directe.`,
    category: "Entretien",
    author: "Lucia",
  },
  {
    title: "Guide des tailles : comment lire notre tableau ?",
    slug: "guide-tailles-tableau",
    excerpt: "Explication détaillée de notre tableau de correspondance des tailles.",
    content: `Notre guide des tailles vous aide à trouver la bonne pointure :

**Comment mesurer son pied ?**
1. Placez une feuille contre un mur
2. Mettez votre pied contre le mur
3. Marquez l'extrémité de votre pied sur la feuille
4. Mesurez la distance entre le bord de la feuille et le trait

**Notre tableau de correspondance**
- Pointure 36 = 23 cm
- Pointure 37 = 23,5 cm
- Pointure 38 = 24 cm
- Pointure 39 = 24,5 cm
- Pointure 40 = 25 cm
- Pointure 41 = 25,5 cm

**Conseil**
Si vous êtes entre deux tailles, choisissez la plus grande.`,
    category: "Guide",
    author: "Lucia",
  },
];

const insert = db.prepare(`
  INSERT OR IGNORE INTO blog_posts (id, title, slug, excerpt, content, image, category, author, published, createdAt, updatedAt)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
`);

const now = new Date().toISOString();

for (const post of samplePosts) {
  const id = `blog-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  insert.run(id, post.title, post.slug, post.excerpt, post.content, "/blog/default.jpg", post.category, post.author, now, now);
}

console.log("Blog migration completed successfully!");
db.close();
