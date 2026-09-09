import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Guide des tailles | Lucia Chaussures",
};

const sizeGuide = [
  { eu: 35, cm: 22.5 },
  { eu: 36, cm: 23 },
  { eu: 37, cm: 23.5 },
  { eu: 38, cm: 24.5 },
  { eu: 39, cm: 25 },
  { eu: 40, cm: 25.5 },
  { eu: 41, cm: 26.5 },
];

export default function GuideTaillesPage() {
  return (
    <>
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <nav className="flex items-center gap-2 text-xs text-stone-400 mb-6">
          <Link href="/" className="hover:text-stone-600">Accueil</Link>
          <span>/</span>
          <span className="text-stone-700">Guide des tailles</span>
        </nav>
        <h1 className="text-2xl lg:text-3xl font-serif font-bold text-stone-900 mb-2">Guide des tailles</h1>
        <p className="text-sm text-stone-500 mb-10">Trouvez la taille parfaite pour chaque paire.</p>

        {/* How to measure */}
        <div className="bg-stone-50 rounded-2xl p-6 lg:p-8 mb-10">
          <h2 className="font-medium text-stone-900 mb-4">Comment mesurer votre pied ?</h2>
          <ol className="text-sm text-stone-600 space-y-3 list-decimal pl-5">
            <li>Placez une feuille blanche contre un mur.</li>
            <li>Tenez-vous pied nu sur la feuille, talon contre le mur.</li>
            <li>Marquez le point le plus long de votre pied (généralement le gros orteil).</li>
            <li>Mesurez la distance entre le bord de la feuille et le trait en centimètres.</li>
            <li>Comparez au tableau ci-dessous.</li>
          </ol>
        </div>

        {/* Size table */}
        <div className="bg-white border border-stone-100 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-stone-100">
            <h2 className="font-medium text-stone-900">Tableau des tailles femmes</h2>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-stone-100">
                <th className="text-left text-xs font-medium text-stone-400 uppercase tracking-wider px-6 py-3">Taille EU</th>
                <th className="text-left text-xs font-medium text-stone-400 uppercase tracking-wider px-6 py-3">Longueur du pied (cm)</th>
              </tr>
            </thead>
            <tbody>
              {sizeGuide.map((size) => (
                <tr key={size.eu} className="border-b border-stone-50 last:border-0">
                  <td className="px-6 py-3.5 text-sm font-medium text-stone-900">{size.eu}</td>
                  <td className="px-6 py-3.5 text-sm text-stone-600">{size.cm} cm</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tips */}
        <div className="mt-10 space-y-4">
          <h2 className="font-medium text-stone-900">Conseils</h2>
          <div className="text-sm text-stone-600 space-y-3">
            <p>Si votre pied est entre deux tailles, nous vous recommandons de choisir la taille supérieure.</p>
            <p>Pour les escarpins à talon haut, vous pouvez aussi prendre une taille au-dessus de votre taille habituelle.</p>
            <p>En cas de doute, n&apos;hésitez pas à nous contacter par téléphone au +225 07 08 09 10.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
