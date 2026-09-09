"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface HomepageConfig {
  heroImage: string;
  instagramImages: string[];
}

export default function AdminHomepagePage() {
  const [config, setConfig] = useState<HomepageConfig>({ heroImage: "", instagramImages: [] });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const heroInputRef = useRef<HTMLInputElement>(null);
  const instaInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/homepage")
      .then((r) => r.json())
      .then((data) => { setConfig(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleUploadHero = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("files", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    if (res.ok) {
      const { urls } = await res.json();
      if (urls[0]) {
        const newConfig = { ...config, heroImage: urls[0] };
        await fetch("/api/homepage", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newConfig) });
        setConfig(newConfig);
      }
    }
    setUploading(false);
  };

  const handleRemoveHero = async () => {
    const newConfig = { ...config, heroImage: "" };
    await fetch("/api/homepage", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newConfig) });
    setConfig(newConfig);
  };

  const handleAddInstagram = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("files", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    if (res.ok) {
      const { urls } = await res.json();
      if (urls[0]) {
        const newConfig = { ...config, instagramImages: [...config.instagramImages, urls[0]] };
        await fetch("/api/homepage", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newConfig) });
        setConfig(newConfig);
      }
    }
    setUploading(false);
  };

  const handleRemoveInstagram = async (index: number) => {
    const newImages = config.instagramImages.filter((_, i) => i !== index);
    const newConfig = { ...config, instagramImages: newImages };
    await fetch("/api/homepage", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newConfig) });
    setConfig(newConfig);
  };

  const handleReplaceInstagram = async (index: number, file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("files", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    if (res.ok) {
      const { urls } = await res.json();
      if (urls[0]) {
        const newImages = [...config.instagramImages];
        newImages[index] = urls[0];
        const newConfig = { ...config, instagramImages: newImages };
        await fetch("/api/homepage", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newConfig) });
        setConfig(newConfig);
      }
    }
    setUploading(false);
  };

  if (loading) return <div className="p-8 text-sm text-stone-400">Chargement...</div>;

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-stone-900">Images Accueil</h1>
          <p className="text-sm text-stone-500 mt-1">Gérez les images de la page d&apos;accueil</p>
        </div>
        <Link href="/espace-prive" className="text-sm text-stone-500 hover:text-stone-900">← Retour</Link>
      </div>

      {/* Hero Image */}
      <div className="bg-white border border-stone-100 rounded-xl p-6 mb-6">
        <h2 className="font-medium text-stone-900 mb-4">Image Hero (bannière principale)</h2>
        <div className="flex items-start gap-6">
          <div className="w-64 h-64 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
            {config.heroImage ? (
              <img src={config.heroImage} alt="Hero" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-stone-300">
                <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                </svg>
              </div>
            )}
          </div>
          <div className="flex-1 space-y-3">
            <p className="text-sm text-stone-500">Image affichée dans le cercle à droite de la bannière principale.</p>
            <div className="flex gap-2">
              <label className="bg-stone-900 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-stone-800 transition-colors cursor-pointer">
                {config.heroImage ? "Remplacer" : "Ajouter"}
                <input ref={heroInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) handleUploadHero(e.target.files[0]); }} />
              </label>
              {config.heroImage && (
                <button onClick={handleRemoveHero} className="bg-white border border-stone-200 text-stone-700 px-4 py-2 rounded-full text-sm font-medium hover:border-stone-300 transition-colors">
                  Supprimer
                </button>
              )}
            </div>
            {uploading && <p className="text-xs text-stone-400">Upload en cours...</p>}
          </div>
        </div>
      </div>

      {/* Instagram Images */}
      <div className="bg-white border border-stone-100 rounded-xl p-6">
        <h2 className="font-medium text-stone-900 mb-4">Images Instagram (section "Suivez-nous")</h2>
        <p className="text-sm text-stone-500 mb-4">Les images affichées dans la grille Instagram en bas de l&apos;accueil. Maximum 6 images.</p>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {config.instagramImages.map((img, i) => (
            <div key={i} className="relative group aspect-square rounded-lg overflow-hidden bg-stone-100 border border-stone-200">
              <img src={img} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <label className="cursor-pointer w-7 h-7 flex items-center justify-center rounded bg-blue-500/80 hover:bg-blue-500" title="Remplacer">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
                  </svg>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) handleReplaceInstagram(i, e.target.files[0]); }} />
                </label>
                <button onClick={() => handleRemoveInstagram(i)} className="w-7 h-7 flex items-center justify-center rounded bg-red-500/80 hover:bg-red-500" title="Supprimer">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
          {config.instagramImages.length < 6 && (
            <label className="aspect-square rounded-lg border-2 border-dashed border-stone-300 flex flex-col items-center justify-center text-stone-400 hover:border-stone-400 hover:text-stone-500 transition-colors cursor-pointer">
              <svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <span className="text-[10px]">Ajouter</span>
              <input ref={instaInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) handleAddInstagram(e.target.files[0]); }} />
            </label>
          )}
        </div>
      </div>
    </div>
  );
}
