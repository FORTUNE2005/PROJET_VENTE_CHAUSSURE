import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const articles: Record<string, { title: string; date: string; category: string; content: string }> = {
  "tendances-automne-2026": {
    title: "Les tendances chaussures automne-hiver 2026",
    date: "3 Septembre 2026",
    category: "Tendances",
    content: `L'automne 2026 s'annonce riche en tendances footwear. Les bottines en cuir dominent les défilés, accompagnées de色彩 vives comme le bordeaux et le vert forêt.\n\nLes escarpins à talon bloc font leur grand retour, offrant confort et élégance pour les journées de travail. Les baskets chunky continuent leur ascension, devenant un incontournable du quotidien.\n\nCôté matières, le velours et le cuir souple sont à l'honneur, apportant une touche de luxe à chaque paire. Les couleurs nude restent un classique intemporel, parfaites pour sublimer toutes les tenues.`,
  },
  "comment-choisir-pointure": {
    title: "Comment bien choisir sa pointure ?",
    date: "28 Août 2026",
    category: "Conseils",
    content: `Choisir la bonne pointure est essentiel pour le confort au quotidien. Voici nos conseils pour trouver la paire idéale.\n\nMesurez vos pieds le soir, car ils gonflent légèrement au cours de la journée. Utilisez un ruban mesureur et comparez avec notre guide des tailles.\n\nPour les escarpins, envisagez une taille au-dessus de votre taille habituelle. Les ballerines et sneakers suivent généralement votre taille naturelle.\n\nN'hésitez pas à essayer plusieurs paires avant de vous décider. Chaque marque peut avoir des légères variations de taille.`,
  },
  "entretien-cuir": {
    title: "Comment entretenir ses chaussures en cuir ?",
    date: "20 Août 2026",
    category: "Entretien",
    content: `Le cuir est une matière noble qui nécessite des soins appropriés pour garder tout son éclat.\n\nNettoyez régulièrement vos chaussures avec un chiffon doux légèrement humide. Appliquez une crème nourrissante adaptée à la couleur du cuir une fois par mois.\n\nProtégez vos chaussures des intempéries avec un spray imperméabilisant. Évitez de les exposer directement au soleil pour préserver la couleur.\n\nRangez-les avec des embouts en bois pour maintenir leur forme. Alternez les portees pour prolonger leur durée de vie.`,
  },
  "guide-tailles-afrique": {
    title: "Guide des tailles : comment convertir en Europe ?",
    date: "15 Août 2026",
    category: "Guide",
    content: `Vous commandez depuis la Côte d'Ivoire ou l'Afrique de l'Ouest ? Voici comment convertir vos tailles habituelles en tailles européennes.\n\nEn Afrique de l'Ouest, les tailles US et UK sont souvent utilisées. Pour convertir en tailles EU : ajoutez 31 à votre taille US femme (ex: US 8 = EU 39).\n\nUtilisez toujours notre guide des tailles interactif pour trouver la taille parfaite. Mesurez votre pied en cm pour plus de précision.\n\nEn cas de doute, contactez notre service client qui se fera un plaisir de vous conseiller.`,
  },
};

export function generateStaticParams() {
  return Object.keys(articles).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = articles[slug];
  return { title: article ? `${article.title} | Blog Lucia` : "Article introuvable" };
}

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = articles[slug];

  if (!article) {
    return (
      <>
        <Header />
        <main className="flex-1 max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-serif font-bold text-stone-900">Article introuvable</h1>
          <Link href="/blog" className="text-sm text-stone-500 hover:text-stone-700 mt-4 inline-block">Retour au blog</Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <nav className="flex items-center gap-2 text-xs text-stone-400 mb-6">
          <Link href="/" className="hover:text-stone-600">Accueil</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-stone-600">Blog</Link>
          <span>/</span>
          <span className="text-stone-700">{article.title}</span>
        </nav>

        <article className="max-w-3xl mx-auto">
          <div className="mb-8">
            <span className="inline-block bg-rose-100 text-rose-700 text-xs font-medium px-3 py-1 rounded-full mb-3 tracking-wide uppercase">
              {article.category}
            </span>
            <h1 className="text-2xl lg:text-3xl font-serif font-bold text-stone-900 mb-3">{article.title}</h1>
            <p className="text-sm text-stone-400">{article.date}</p>
          </div>

          <div className="aspect-video bg-stone-100 rounded-2xl mb-8 flex items-center justify-center">
            <svg className="w-16 h-16 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
            </svg>
          </div>

          <div className="prose prose-stone max-w-none">
            {article.content.split("\n\n").map((paragraph, i) => (
              <p key={i} className="text-stone-600 leading-relaxed mb-4">{paragraph}</p>
            ))}
          </div>

          <div className="border-t border-stone-100 mt-10 pt-8">
            <Link href="/blog" className="text-sm text-stone-600 hover:text-stone-900">
              ← Retour au blog
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
