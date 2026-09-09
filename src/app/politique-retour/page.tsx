import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Politique de retour | Lucia Chaussures",
};

export default function PolitiqueRetourPage() {
  return (
    <>
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <nav className="flex items-center gap-2 text-xs text-stone-400 mb-6">
          <Link href="/" className="hover:text-stone-600">Accueil</Link>
          <span>/</span>
          <span className="text-stone-700">Politique de retour</span>
        </nav>
        <h1 className="text-2xl lg:text-3xl font-serif font-bold text-stone-900 mb-8">Politique de retour</h1>

        <div className="prose prose-stone prose-sm max-w-none space-y-8">
          <section>
            <h2 className="text-lg font-serif font-bold text-stone-900">Droit de rétractation</h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              Conformément à la législation en vigueur en Côte d&apos;Ivoire, vous disposez d&apos;un délai de <strong>30 jours</strong> à compter de la réception de votre commande pour exercer votre droit de rétractation, sans avoir à justifier de motif.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-bold text-stone-900">Conditions de retour</h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              Pour être accepté, le retour doit respecter les conditions suivantes :
            </p>
            <ul className="text-sm text-stone-600 leading-relaxed list-disc pl-5 space-y-2">
              <li>Le produit doit être dans son <strong>emballage d&apos;origine</strong></li>
              <li>Le produit ne doit pas avoir été <strong>utilisé</strong> ni porté</li>
              <li>Le produit doit être en <strong>parfait état</strong> (non endommagé, non taché)</li>
              <li>Les étiquettes doivent être encore attaches</li>
              <li>Le produit doit être accompagné de la <strong>facture d&apos;achat</strong></li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-serif font-bold text-stone-900">Comment retourner un article ?</h2>
            <ol className="text-sm text-stone-600 leading-relaxed list-decimal pl-5 space-y-2">
              <li>Contactez notre service client par email à contact@lucia-chaussures.ci ou par téléphone au +225 07 08 09 10</li>
              <li>Indiquez votre numéro de commande et le motif du retour</li>
              <li>Nous vous confirmerons la procédure de retour</li>
              <li>Emballez soigneusement le produit et envoyez-le à l&apos;adresse indiquée</li>
              <li>Le remboursement sera effectué dans un délai de 14 jours après réception du retour</li>
            </ol>
          </section>

          <section>
            <h2 className="text-lg font-serif font-bold text-stone-900">Frais de retour</h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              Les frais de retour sont à la charge du client, sauf en cas de produit défectueux ou non conforme à la commande. Dans ce cas, Lucia Chaussures prend en charge les frais de retour.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-bold text-stone-900">Échange</h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              Si vous souhaitez échanger un produit contre une autre taille ou un autre modèle, contactez notre service client. Nous procéderons à l&apos;échange dès réception du produit retourné, sous réserve de disponibilité.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-bold text-stone-900">Produits défectueux</h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              Si vous recevez un produit défectueux ou non conforme, contactez-nous dans les 48 heures suivant la réception. Nous procéderons à l&apos;échange ou au remboursement du produit.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
