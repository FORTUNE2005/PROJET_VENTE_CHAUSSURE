import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Livraison | Lucia Chaussures",
};

export default function LivraisonPage() {
  return (
    <>
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <nav className="flex items-center gap-2 text-xs text-stone-400 mb-6">
          <Link href="/" className="hover:text-stone-600">Accueil</Link>
          <span>/</span>
          <span className="text-stone-700">Livraison</span>
        </nav>

        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl lg:text-3xl font-serif font-bold text-stone-900 mb-2">Livraison</h1>
          <p className="text-sm text-stone-500 mb-10">Tout ce qu&apos;il faut savoir sur nos modes de livraison.</p>

          <div className="space-y-8">
            {/* Zones */}
            <section>
              <h2 className="text-lg font-medium text-stone-900 mb-4">Zones de livraison</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-stone-50 rounded-xl p-6">
                  <h3 className="text-sm font-medium text-stone-900 mb-2">Abidjan</h3>
                  <p className="text-2xl font-bold text-stone-900 mb-1">1 500 F</p>
                  <p className="text-xs text-stone-500">Livraison sous 24-48h</p>
                </div>
                <div className="bg-stone-50 rounded-xl p-6">
                  <h3 className="text-sm font-medium text-stone-900 mb-2">Autres villes</h3>
                  <p className="text-2xl font-bold text-stone-900 mb-1">2 500 F</p>
                  <p className="text-xs text-stone-500">Livraison sous 48-72h</p>
                </div>
              </div>
            </section>

            {/* Gratuite */}
            <section className="bg-green-50 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H18.75m-7.5-3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-green-900 mb-1">Livraison gratuite</h3>
                  <p className="text-sm text-green-700">
                    Pour toute commande de <strong>45 000 F ou plus</strong>, la livraison est offerte sur tout le territoire ivoirien.
                  </p>
                </div>
              </div>
            </section>

            {/* Paiement */}
            <section>
              <h2 className="text-lg font-medium text-stone-900 mb-4">Paiement à la livraison</h2>
              <div className="space-y-3 text-sm text-stone-600">
                <p>Vous pouvez régler votre commande directement à la livraison :</p>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-stone-400 rounded-full" />
                    <span><strong>Espèces</strong> — Payez en cash à votre livreur</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-stone-400 rounded-full" />
                    <span><strong>Mobile Money</strong> — Orange Money, MTN MoMo, Moov Money</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Suivi */}
            <section>
              <h2 className="text-lg font-medium text-stone-900 mb-4">Suivi de commande</h2>
              <div className="space-y-3 text-sm text-stone-600">
                <p>Après validation de votre commande :</p>
                <ol className="space-y-3 ml-4">
                  <li className="flex gap-3">
                    <span className="w-6 h-6 bg-stone-100 rounded-full flex items-center justify-center text-xs font-medium text-stone-600 shrink-0">1</span>
                    <span>Un SMS de confirmation vous est envoyé</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-6 h-6 bg-stone-100 rounded-full flex items-center justify-center text-xs font-medium text-stone-600 shrink-0">2</span>
                    <span>Un agent vous appelle pour confirner la livraison</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-6 h-6 bg-stone-100 rounded-full flex items-center justify-center text-xs font-medium text-stone-600 shrink-0">3</span>
                    <span>Votre colis est préparé et expédié</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-6 h-6 bg-stone-100 rounded-full flex items-center justify-center text-xs font-medium text-stone-600 shrink-0">4</span>
                    <span>Livraison à votre adresse, paiement en main propre</span>
                  </li>
                </ol>
              </div>
            </section>

            {/* Contact */}
            <section className="bg-stone-50 rounded-xl p-6 text-center">
              <p className="text-sm text-stone-600 mb-3">Une question sur votre livraison ?</p>
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
