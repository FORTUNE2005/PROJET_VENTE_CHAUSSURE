import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Mentions légales | Lucia Chaussures",
};

export default function MentionsLegalesPage() {
  return (
    <>
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <nav className="flex items-center gap-2 text-xs text-stone-400 mb-6">
          <Link href="/" className="hover:text-stone-600">Accueil</Link>
          <span>/</span>
          <span className="text-stone-700">Mentions légales</span>
        </nav>
        <h1 className="text-2xl lg:text-3xl font-serif font-bold text-stone-900 mb-8">Mentions légales</h1>

        <div className="prose prose-stone prose-sm max-w-none space-y-8">
          <section>
            <h2 className="text-lg font-serif font-bold text-stone-900">1. Éditeur du site</h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              Le site Lucia Chaussures est édité par la société Lucia Chaussures SARU, dont le siège social est situé à Abidjan, Plateau, Côte d&apos;Ivoire.
            </p>
            <p className="text-sm text-stone-600 leading-relaxed">
              RCS Abidjan : CI-ABJ-2026-B-12345<br />
              TVA : CI202612345<br />
              Directeur de la publication : Lucia Koné
            </p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-bold text-stone-900">2. Hébergeur</h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              Le site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-bold text-stone-900">3. Propriété intellectuelle</h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              L&apos;ensemble du contenu de ce site (textes, images, vidéos, logos, marques) est la propriété exclusive de Lucia Chaussures ou de ses partenaires. Toute reproduction, même partielle, est interdite sans autorisation préalable écrite.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-bold text-stone-900">4. Données personnelles</h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              Conformément à la législation en vigueur en Côte d&apos;Ivoire, vous disposez d&apos;un droit d&apos;accès, de rectification et de suppression de vos données personnelles. Pour exercer ce droit, contactez-nous à : contact@lucia-chaussures.ci
            </p>
            <p className="text-sm text-stone-600 leading-relaxed">
              Les données collectées sont utilisées uniquement pour le traitement de vos commandes et l&apos;amélioration de nos services. Elles ne sont jamais revendues à des tiers.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-bold text-stone-900">5. Cookies</h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              Ce site utilise des cookies pour améliorer l&apos;expérience utilisateur et mesurer l&apos;audience. Vous pouvez configurer votre navigateur pour refuser les cookies.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
