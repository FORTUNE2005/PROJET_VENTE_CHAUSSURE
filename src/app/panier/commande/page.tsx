"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { formatPrice } from "@/lib/format";

type Step = "livraison" | "paiement" | "confirmation";

interface DeliveryInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  neighborhood: string;
  instructions: string;
}

export default function CheckoutPage() {
  const [step, setStep] = useState<Step>("livraison");
  const [delivery, setDelivery] = useState<DeliveryInfo>({
    name: "", email: "", phone: "", address: "", city: "Abidjan", neighborhood: "", instructions: "",
  });
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { items, totalPrice, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setDelivery((prev) => ({
        ...prev,
        name: prev.name || user.name || "",
        email: prev.email || user.email || "",
        phone: prev.phone || user.phone || "",
      }));
    }
  }, [user]);

  const shipping = totalPrice >= 45000 ? 0 : 2500;
  const total = totalPrice + shipping;

  if (items.length === 0 && step !== "confirmation") {
    return (
      <>
        <Header />
        <main className="flex-1 max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-serif font-bold text-stone-900 mb-4">Votre panier est vide</h1>
          <p className="text-sm text-stone-500 mb-6">Ajoutez des produits avant de passer commande.</p>
          <Link href="/" className="inline-block bg-stone-900 text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-stone-800">
            Découvrir nos produits
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  if (!authLoading && !user && step !== "confirmation") {
    return (
      <>
        <Header />
        <main className="flex-1 max-w-7xl mx-auto px-4 py-16 text-center">
          <svg className="w-16 h-16 text-stone-300 mx-auto mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>
          <h1 className="text-2xl font-serif font-bold text-stone-900 mb-3">Connectez-vous pour passer commande</h1>
          <p className="text-sm text-stone-500 mb-8 max-w-md mx-auto">
            Vous devez créer un compte ou vous connecter avant de finaliser votre commande.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/auth/login" className="bg-stone-900 text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-stone-800">
              Se connecter
            </Link>
            <Link href="/auth/register" className="border border-stone-200 text-stone-700 px-8 py-3 rounded-full text-sm font-medium hover:bg-stone-50">
              Créer un compte
            </Link>
          </div>
          <Link href="/panier" className="text-xs text-stone-400 hover:text-stone-600 mt-6 inline-block">
            ← Retour au panier
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const validateDelivery = (): boolean => {
    const errs: Record<string, string> = {};
    if (!delivery.name.trim()) errs.name = "Nom requis";
    if (!delivery.email.trim()) errs.email = "Email requis";
    if (!delivery.phone.trim()) errs.phone = "Téléphone requis";
    if (!delivery.address.trim()) errs.address = "Adresse requise";
    if (!delivery.neighborhood.trim()) errs.neighborhood = "Quartier requis";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/commandes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: user?.id || "guest",
          clientName: delivery.name,
          clientEmail: delivery.email,
          clientPhone: delivery.phone,
          address: `${delivery.address}, ${delivery.neighborhood}, ${delivery.city}`,
          items: items.map((item) => ({
            productId: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
          })),
          total,
          shipping,
          paymentMethod: "cash_on_delivery",
          notes: delivery.instructions,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setOrderId(data.orderId);
        clearCart();
        setStep("confirmation");
      }
    } catch {
      setErrors({ submit: "Erreur lors de la commande. Réessayez." });
    }
    setLoading(false);
  };

  const steps: { key: Step; label: string; num: number }[] = [
    { key: "livraison", label: "Livraison", num: 1 },
    { key: "paiement", label: "Paiement", num: 2 },
    { key: "confirmation", label: "Confirmation", num: 3 },
  ];

  return (
    <>
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <nav className="flex items-center gap-2 text-xs text-stone-400 mb-6">
          <Link href="/" className="hover:text-stone-600">Accueil</Link>
          <span>/</span>
          <Link href="/panier" className="hover:text-stone-600">Panier</Link>
          <span>/</span>
          <span className="text-stone-700">Commande</span>
        </nav>

        {/* Steps */}
        <div className="flex items-center justify-center gap-0 mb-10">
          {steps.map((s, i) => (
            <div key={s.key} className="flex items-center">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                  step === s.key ? "bg-stone-900 text-white" :
                  steps.findIndex((x) => x.key === step) > i ? "bg-green-500 text-white" :
                  "bg-stone-100 text-stone-400"
                }`}>
                  {steps.findIndex((x) => x.key === step) > i ? "✓" : s.num}
                </div>
                <span className={`text-sm hidden sm:block ${step === s.key ? "text-stone-900 font-medium" : "text-stone-400"}`}>
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && <div className="w-12 sm:w-20 h-px bg-stone-200 mx-3" />}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Step 1: Livraison */}
            {step === "livraison" && (
              <div>
                <h2 className="text-xl font-serif font-bold text-stone-900 mb-6">Informations de livraison</h2>
                <div className="bg-stone-50 rounded-xl p-4 mb-6 text-sm text-stone-600">
                  Commande en tant que <strong>{user!.email}</strong>
                </div>
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1.5">Nom complet *</label>
                      <input value={delivery.name} onChange={(e) => setDelivery({ ...delivery, name: e.target.value })}
                        className={`w-full bg-stone-50 border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200 ${errors.name ? "border-red-300" : "border-stone-200"}`}
                        placeholder="Aya Koné" />
                      {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1.5">Email *</label>
                      <input type="email" value={delivery.email} onChange={(e) => setDelivery({ ...delivery, email: e.target.value })}
                        className={`w-full bg-stone-50 border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200 ${errors.email ? "border-red-300" : "border-stone-200"}`}
                        placeholder="aya@email.com" />
                      {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">Téléphone *</label>
                    <input type="tel" value={delivery.phone} onChange={(e) => setDelivery({ ...delivery, phone: e.target.value })}
                      className={`w-full bg-stone-50 border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200 ${errors.phone ? "border-red-300" : "border-stone-200"}`}
                      placeholder="+225 07 08 09 10" />
                    {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">Adresse *</label>
                    <input value={delivery.address} onChange={(e) => setDelivery({ ...delivery, address: e.target.value })}
                      className={`w-full bg-stone-50 border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200 ${errors.address ? "border-red-300" : "border-stone-200"}`}
                      placeholder="123 rue de la Paix" />
                    {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1.5">Ville</label>
                      <select value={delivery.city} onChange={(e) => setDelivery({ ...delivery, city: e.target.value })}
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200">
                        <option>Abidjan</option>
                        <option>Bouaké</option>
                        <option>Daloa</option>
                        <option>Korhogo</option>
                        <option>Yamoussoukro</option>
                        <option>San-Pédro</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1.5">Quartier *</label>
                      <input value={delivery.neighborhood} onChange={(e) => setDelivery({ ...delivery, neighborhood: e.target.value })}
                        className={`w-full bg-stone-50 border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200 ${errors.neighborhood ? "border-red-300" : "border-stone-200"}`}
                        placeholder="Plateau, Cocody, Marcory..." />
                      {errors.neighborhood && <p className="text-xs text-red-500 mt-1">{errors.neighborhood}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">Instructions de livraison</label>
                    <textarea rows={2} value={delivery.instructions} onChange={(e) => setDelivery({ ...delivery, instructions: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200 resize-none"
                      placeholder="Bâtiment, étage, repères... (optionnel)" />
                  </div>
                </div>
                <div className="flex justify-end mt-8">
                  <button onClick={() => { if (validateDelivery()) setStep("paiement"); }}
                    className="bg-stone-900 text-white px-10 py-3.5 rounded-full text-sm font-medium hover:bg-stone-800 transition-colors">
                    Continuer vers le paiement
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Paiement */}
            {step === "paiement" && (
              <div>
                <h2 className="text-xl font-serif font-bold text-stone-900 mb-6">Paiement</h2>

                <div className="bg-stone-50 border-2 border-stone-900 rounded-xl p-6 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-stone-900 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659 1.215-1.204a1.125 1.125 0 011.426.077l.671.67a2.625 2.625 0 010 3.712l-.916.915a2.625 2.625 0 01-3.712 0l-.67-.67a1.125 1.125 0 01.077-1.426L8.25 9" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-stone-900">Paiement à la livraison</h3>
                      <p className="text-xs text-stone-500 mt-0.5">Payez en espèces ou par Mobile Money à la réception</p>
                    </div>
                    <div className="ml-auto">
                      <div className="w-5 h-5 rounded-full border-2 border-stone-900 flex items-center justify-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-stone-900" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                  <div className="flex gap-3">
                    <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-amber-800">Important</p>
                      <p className="text-xs text-amber-700 mt-1">
                        Préparez le montant exact de <strong>{formatPrice(total)}</strong> pour le jour de la livraison.
                        Un agent vous contactera pour confirner la commande.
                      </p>
                    </div>
                  </div>
                </div>

                {errors.submit && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-6">{errors.submit}</div>}

                <div className="flex justify-between mt-8">
                  <button onClick={() => setStep("livraison")} className="text-sm text-stone-600 hover:text-stone-900">
                    ← Retour
                  </button>
                  <button onClick={handlePlaceOrder} disabled={loading}
                    className="bg-stone-900 text-white px-10 py-3.5 rounded-full text-sm font-medium hover:bg-stone-800 transition-colors disabled:opacity-50">
                    {loading ? "Envoi en cours..." : "Confirmer la commande"}
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Confirmation */}
            {step === "confirmation" && (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </div>
                <h1 className="text-2xl lg:text-3xl font-serif font-bold text-stone-900 mb-3">Commande confirmée !</h1>
                <p className="text-stone-500 mb-2">Merci pour votre commande</p>
                <p className="text-sm text-stone-400 mb-8">
                  Numéro de commande : <strong className="text-stone-700">#{orderId.slice(-6)}</strong>
                </p>
                <div className="bg-stone-50 rounded-xl p-6 max-w-md mx-auto mb-8 text-left">
                  <h3 className="text-sm font-medium text-stone-900 mb-3">Prochaines étapes</h3>
                  <ul className="space-y-3">
                    <li className="flex gap-3 text-sm text-stone-600">
                      <span className="w-6 h-6 bg-stone-200 rounded-full flex items-center justify-center text-xs font-medium text-stone-600 flex-shrink-0">1</span>
                      Un agent vous contactera pour confirner la livraison
                    </li>
                    <li className="flex gap-3 text-sm text-stone-600">
                      <span className="w-6 h-6 bg-stone-200 rounded-full flex items-center justify-center text-xs font-medium text-stone-600 flex-shrink-0">2</span>
                      Préparez le montant de {formatPrice(total)}
                    </li>
                    <li className="flex gap-3 text-sm text-stone-600">
                      <span className="w-6 h-6 bg-stone-200 rounded-full flex items-center justify-center text-xs font-medium text-stone-600 flex-shrink-0">3</span>
                      Livraison sous 24-72h selon votre localisation
                    </li>
                  </ul>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/" className="bg-stone-900 text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-stone-800">
                    Continuer vos achats
                  </Link>
                  <Link href="/compte/commandes" className="border border-stone-200 text-stone-700 px-8 py-3 rounded-full text-sm font-medium hover:bg-stone-50">
                    Voir mes commandes
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          {step !== "confirmation" && (
            <div className="lg:col-span-1">
              <div className="bg-stone-50 rounded-xl p-6 sticky top-24">
                <h3 className="text-sm font-medium text-stone-900 mb-4">Récapitulatif</h3>
                <div className="space-y-3 mb-4">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.size}-${item.color}`} className="flex justify-between text-sm">
                      <div className="text-stone-600 truncate pr-2">
                        <span>{item.name}</span>
                        {item.size && <span className="text-stone-400"> (T{item.size})</span>}
                        <span className="text-stone-400"> ×{item.quantity}</span>
                      </div>
                      <span className="text-stone-900 flex-shrink-0">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-stone-200 pt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-500">Sous-total</span>
                    <span className="text-stone-900">{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-500">Livraison</span>
                    <span className="text-stone-900">{formatPrice(shipping)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium border-t border-stone-200 pt-2">
                    <span className="text-stone-900">Total</span>
                    <span className="text-stone-900">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
