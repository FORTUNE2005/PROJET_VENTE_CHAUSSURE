import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Retours & Échanges | Lucia Chaussures",
};

export default function RetoursPage() {
  return (
    <>
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <nav className="flex items-center gap-2 text-xs text-stone-400 mb-6">
          <Link href="/" className="hover:text-stone-600">Accueil</Link>
          <span>/</span>
          <span className="text-stone-700">Retours & Échanges</span>
        </nav>

        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl lg:text-3xl font-serif font-bold text-stone-900 mb-2">Retours & Échanges</h1>
          <p className="text-sm text-stone-500 mb-10">Nous voulons que vous soyez entièrement satisfaite de votre achat.</p>

          <div className="space-y-8">
            {/* Délai */}
            <section className="bg-stone-50 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-stone-200 rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-stone-900 mb-1">Délai de retour</h3>
                  <p className="text-sm text-stone-600">
                    Vous disposez de <strong>30 jours</strong> à compter de la réception de votre commande pour nous retourner un article.
                  </p>
                </div>
              </div>
            </section>

            {/* Conditions */}
            <section>
              <h2 className="text-lg font-medium text-stone-900 mb-4">Conditions de retour</h2>
              <div className="space-y-3 text-sm text-stone-600">
                <p>Pour être accepté, le retour doit respecter ces conditions :</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-green-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    <span>L&apos;article est dans son <strong>emballage d&apos;origine</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-green-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    <span>Les chaussures n&apos;ont <strong>pas été portées</strong> extérieurement</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-green-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    <span>Les <strong>étiquettes sont intactes</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-green-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    <span>Le produit n&apos;est pas <strong>personnalisé</strong> ou en <strong>solde</strong></span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Comment */}
            <section>
              <h2 className="text-lg font-medium text-stone-900 mb-4">Comment effectuer un retour ?</h2>
              <ol className="space-y-4">
                <li className="flex gap-3">
                  <span className="w-6 h-6 bg-stone-900 text-white rounded-full flex items-center justify-center text-xs font-medium shrink-0">1</span>
                  <div>
                    <p className="text-sm font-medium text-stone-900">Contactez notre service client</p>
                    <p className="text-xs text-stone-500 mt-0.5">Par téléphone au +225 07 08 09 10 ou par email à contact@lucia-chaussures.ci</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 bg-stone-900 text-white rounded-full flex items-center justify-center text-xs font-medium shrink-0">2</span>
                  <div>
                    <p className="text-sm font-medium text-stone-900">Préparez le colis</p>
                    <p className="text-xs text-stone-500 mt-0.5">Remettez les chaussures dans leur emballage d&apos;origine avec l&apos;étiquette</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 bg-stone-900 text-white rounded-full flex items-center justify-center text-xs font-medium shrink-0">3</span>
                  <div>
                    <p className="text-sm font-medium text-stone-900">Envoi ou retrait</p>
                    <p className="text-xs text-stone-500 mt-0.5">Nous organisons le retrait chez vous ou vous déposez le colis dans notre point relais</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 bg-stone-900 text-white rounded-full flex items-center justify-center text-xs font-medium shrink-0">4</span>
                  <div>
                    <p className="text-sm font-medium text-stone-900">Remboursement</p>
                    <p className="text-xs text-stone-500 mt-0.5">Sous 5 à 7 jours ouvrés après réception et vérification du retour</p>
                  </div>
                </li>
              </ol>
            </section>

            {/* Échange */}
            <section>
              <h2 className="text-lg font-medium text-stone-900 mb-4">Échange</h2>
              <div className="text-sm text-stone-600 space-y-3">
                <p>
                  Vous souhaitez changer la <strong>taille</strong> ou la <strong>couleur</strong> ? Contactez-nous et nous organisons un échange gratuit.
                </p>
                <p>
                  L&apos;échange est possible dans la limite des stocks disponibles. Les frais de re-réexpédition sont à notre charge.
                </p>
              </div>
            </section>

            {/* Défaut */}
            <section className="bg-amber-50 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-amber-900 mb-1">Produit défectueux ?</h3>
                  <p className="text-sm text-amber-700">
                    Si vous avez reçu un produit défectueux ou endommagé, contactez-nous immédiatement.
                    Nous procéderons à un <strong>échange ou remboursement gratuit</strong>, même après 30 jours.
                  </p>
                </div>
              </div>
            </section>

            {/* Contact */}
            <section className="bg-stone-50 rounded-xl p-6 text-center">
              <p className="text-sm text-stone-600 mb-3">Besoin d&apos;aide pour un retour ?</p>
              <Link href="/contact" className="text-sm text-stone-900 font-medium hover:underline">
                Contactez-nous
              </Link>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
