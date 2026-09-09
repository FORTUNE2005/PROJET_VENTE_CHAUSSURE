import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Conditions Générales de Vente | Lucia Chaussures",
};

export default function CgvPage() {
  return (
    <>
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <nav className="flex items-center gap-2 text-xs text-stone-400 mb-6">
          <Link href="/" className="hover:text-stone-600">Accueil</Link>
          <span>/</span>
          <span className="text-stone-700">CGV</span>
        </nav>
        <h1 className="text-2xl lg:text-3xl font-serif font-bold text-stone-900 mb-8">Conditions Générales de Vente</h1>

        <div className="prose prose-stone prose-sm max-w-none space-y-8">
          <section>
            <h2 className="text-lg font-serif font-bold text-stone-900">Article 1 - Objet</h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre la société Lucia Chaussures et tout client effectuant un achat sur le site lucia-chaussures.ci.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-bold text-stone-900">Article 2 - Prix</h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              Les prix sont indiqués en Francs CFA (FCFA) toutes taxes comprises. Lucia Chaussures se réserve le droit de modifier ses prix à tout moment, étant entendu que le prix applicable est celui en vigueur au moment de la validation de la commande par le client.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-bold text-stone-900">Article 3 - Commande</h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              La commande est validée lorsque le client a finalisé son panier, renseigné ses informations de livraison et choisi son mode de paiement. Un email de confirmation est envoyé au client.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-bold text-stone-900">Article 4 - Paiement</h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              Les modes de paiement acceptés sont :
            </p>
            <ul className="text-sm text-stone-600 leading-relaxed list-disc pl-5 space-y-1">
              <li>Paiement à la livraison (espèces)</li>
              <li>Carte bancaire (Visa, Mastercard)</li>
              <li>PayPal</li>
              <li>Apple Pay</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-serif font-bold text-stone-900">Article 5 - Livraison</h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              La livraison est assurée sur tout le territoire de la Côte d&apos;Ivoire. Les délais de livraison sont de 2 à 3 jours ouvrés pour la livraison standard et de 24 heures pour la livraison express. La livraison est gratuite pour toute commande supérieure ou égale à 45 000 FCFA.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-bold text-stone-900">Article 6 - Droit de rétractation</h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              Le client dispose d&apos;un délai de 30 jours à compter de la réception de sa commande pour exercer son droit de rétractation, sans avoir à justifier de motif. Le produit doit être retourné dans son emballage d&apos;origine, non utilisé et en parfait état.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-bold text-stone-900">Article 7 - Garantie</h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              Tous nos produits bénéficient de la garantie légale de conformité. En cas de produit défectueux ou non conforme, le client peut demander l&apos;échange ou le remboursement du produit.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-bold text-stone-900">Article 8 - Contact</h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              Pour toute question relative aux présentes CGV, vous pouvez nous contacter :
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
