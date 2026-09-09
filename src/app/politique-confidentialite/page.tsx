import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Politique de confidentialité | Lucia Chaussures",
};

export default function PolitiqueConfidentialitePage() {
  return (
    <>
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <nav className="flex items-center gap-2 text-xs text-stone-400 mb-6">
          <Link href="/" className="hover:text-stone-600">Accueil</Link>
          <span>/</span>
          <span className="text-stone-700">Confidentialité</span>
        </nav>
        <h1 className="text-2xl lg:text-3xl font-serif font-bold text-stone-900 mb-8">Politique de confidentialité</h1>

        <div className="prose prose-stone prose-sm max-w-none space-y-8">
          <section>
            <h2 className="text-lg font-serif font-bold text-stone-900">1. Collecte des données</h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              Nous collectons les données personnelles suivantes dans le cadre de nos activités :
            </p>
            <ul className="text-sm text-stone-600 leading-relaxed list-disc pl-5 space-y-2">
              <li>Nom et prénom</li>
              <li>Adresse email</li>
              <li>Adresse postale</li>
              <li>Numéro de téléphone</li>
              <li>Historique des commandes</li>
              <li>Données de connexion (adresse IP, navigateur)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-serif font-bold text-stone-900">2. Finalité du traitement</h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              Vos données sont collectées pour les finalités suivantes :
            </p>
            <ul className="text-sm text-stone-600 leading-relaxed list-disc pl-5 space-y-2">
              <li>Traitement et suivi de vos commandes</li>
              <li>Création et gestion de votre compte client</li>
              <li>Communication relative à vos commandes</li>
              <li>Envoi de newsletters et offres promotionnelles (avec votre consentement)</li>
              <li>Amélioration de nos services et de votre expérience utilisateur</li>
              <li>Respect de nos obligations légales</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-serif font-bold text-stone-900">3. Durée de conservation</h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              Vos données personnelles sont conservées pendant une durée de 3 ans à compter de votre dernière interaction avec nos services. Les données relatives à vos commandes sont conservées pendant 5 ans pour des raisons comptables et légales.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-bold text-stone-900">4. Sécurité des données</h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              Nous mettons en place toutes les mesures techniques et organisationnelles nécessaires pour protéger vos données personnelles contre tout accès non autorisé, modification, divulgation ou destruction.
            </p>
            <p className="text-sm text-stone-600 leading-relaxed">
              Le site utilise un certificat SSL (HTTPS) pour sécuriser les échanges de données entre votre navigateur et nos serveurs.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-bold text-stone-900">5. Vos droits</h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              Conformément à la législation en vigueur, vous disposez des droits suivants :
            </p>
            <ul className="text-sm text-stone-600 leading-relaxed list-disc pl-5 space-y-2">
              <li><strong>Droit d&apos;accès</strong> : obtenir une copie de vos données personnelles</li>
              <li><strong>Droit de rectification</strong> : corriger des données inexactes</li>
              <li><strong>Droit de suppression</strong> : demander la suppression de vos données</li>
              <li><strong>Droit d&apos;opposition</strong> : vous opposer au traitement de vos données</li>
              <li><strong>Droit à la portabilité</strong> : recevoir vos données dans un format structuré</li>
            </ul>
            <p className="text-sm text-stone-600 leading-relaxed mt-3">
              Pour exercer ces droits, contactez-nous à : contact@lucia-chaussures.ci
            </p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-bold text-stone-900">6. Cookies</h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              Notre site utilise des cookies pour améliorer votre expérience de navigation. Vous pouvez configurer votre navigateur pour refuser les cookies ou être alerté lorsqu&apos;un cookie est déposé.
            </p>
            <p className="text-sm text-stone-600 leading-relaxed">
              Les cookies utilisés sont :
            </p>
            <ul className="text-sm text-stone-600 leading-relaxed list-disc pl-5 space-y-2">
              <li>Cookies de session (indispensables au fonctionnement du site)</li>
              <li>Cookies de préférence (langue, devise)</li>
              <li>Cookies analytiques (mesure d&apos;audience)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-serif font-bold text-stone-900">7. Contact</h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              Pour toute question relative à cette politique de confidentialité ou pour exercer vos droits, contactez-nous :
            </p>
            <ul className="text-sm text-stone-600 leading-relaxed list-disc pl-5 space-y-1">
              <li>Email : contact@lucia-chaussures.ci</li>
              <li>Téléphone : +225 07 08 09 10</li>
              <li>Adresse : Abidjan, Plateau, Côte d&apos;Ivoire</li>
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
