"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const faqs = [
  {
    q: "Comment passer une commande ?",
    a: "Choisissez vos produits, sélectionnez la taille et la couleur, puis ajoutez au panier. Cliquez ensuite sur \"Passer la commande\" et suivez les étapes de livraison et de paiement.",
  },
  {
    q: "Quels sont les modes de livraison ?",
    a: "Nous proposons la livraison standard (2-3 jours ouvrés) et la livraison express (24h). La livraison est gratuite à partir de 45 000 F d'achat.",
  },
  {
    q: "Puis-je payer à la livraison ?",
    a: "Oui, le paiement à la livraison est disponible. Vous réglez en espèces lors de la réception de votre colis.",
  },
  {
    q: "Comment retourner un article ?",
    a: "Vous disposez de 30 jours après réception pour retourner un article. Contactez-nous par email ou téléphone pour initier le retour. Les frais de retour sont à la charge du client.",
  },
  {
    q: "Comment connaître ma pointure ?",
    a: "Consultez notre guide des tailles disponible sur chaque fiche produit. En cas de doute, contactez notre service client qui se fera un plaisir de vous conseiller.",
  },
  {
    q: "Les produits sont-ils garantis ?",
    a: "Oui, tous nos produits sont garantis conformes. En cas de défaut, nous procédons à l'échange ou au remboursement.",
  },
  {
    q: "Comment suivre ma commande ?",
    a: "Un email de confirmation avec un numéro de suivi vous est envoyé dès l'expédition de votre commande. Vous pouvez également nous contacter par téléphone.",
  },
];

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <nav className="flex items-center gap-2 text-xs text-stone-400 mb-6">
          <Link href="/" className="hover:text-stone-600">Accueil</Link>
          <span>/</span>
          <span className="text-stone-700">FAQ</span>
        </nav>
        <h1 className="text-2xl lg:text-3xl font-serif font-bold text-stone-900 mb-2">Questions fréquentes</h1>
        <p className="text-sm text-stone-500 mb-10">Trouvez rapidement les réponses à vos questions.</p>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-stone-100 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="text-sm font-medium text-stone-900 pr-4">{faq.q}</span>
                <svg
                  className={`w-5 h-5 text-stone-400 shrink-0 transition-transform ${openIndex === i ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
              {openIndex === i && (
                <div className="px-5 pb-5">
                  <p className="text-sm text-stone-600 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center p-8 bg-stone-50 rounded-xl">
          <p className="text-sm text-stone-600 mb-4">Vous n&apos;avez pas trouvé votre réponse ?</p>
          <a href="/contact" className="inline-flex bg-stone-900 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-stone-800 transition-colors">
            Contactez-nous
          </a>
        </div>
      </main>
      <Footer />
    </>
  );
}
