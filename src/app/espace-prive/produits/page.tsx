"use client";

import { useState, useEffect, useRef } from "react";
import { formatPrice } from "@/lib/format";
import ConfirmModal from "@/components/ConfirmModal";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice: number | null;
  category: string;
  sizes: string;
  colors: string;
  images: string;
  stock: number;
  description: string;
  material: string;
  isNew: number;
}

export default function AdminProduitsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [formImages, setFormImages] = useState<string[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [promoId, setPromoId] = useState<string | null>(null);
  const [promoPrice, setPromoPrice] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    name: "", price: "", originalPrice: "", category: "baskets",
    sizes: "", colors: "", description: "", material: "", isNew: true, stock: "15",
  });

  useEffect(() => {
    fetch("/api/produits")
      .then((r) => r.json())
      .then((data) => { setProducts(data); setLoading(false); });
  }, []);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const resetForm = () => {
    setForm({ name: "", price: "", originalPrice: "", category: "baskets", sizes: "", colors: "", description: "", material: "", isNew: true, stock: "15" });
    setFormImages([]);
    setEditingProduct(null);
  };

  const openAddForm = () => {
    resetForm();
    setShowForm(true);
  };

  const openEditForm = (product: Product) => {
    const sizes = (() => { try { return JSON.parse(product.sizes).join(", "); } catch { return ""; } })();
    const colors = (() => { try { return JSON.parse(product.colors).join(", "); } catch { return ""; } })();
    const images = (() => { try { return JSON.parse(product.images); } catch { return []; } })();
    setForm({
      name: product.name,
      price: String(product.price),
      originalPrice: product.originalPrice ? String(product.originalPrice) : "",
      category: product.category,
      sizes,
      colors,
      description: product.description,
      material: product.material,
      isNew: !!product.isNew,
      stock: String(product.stock),
    });
    setFormImages(images);
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleUpload = async (files: FileList | null) => {
    if (!files || !files.length) return;
    setUploading(true);
    const formData = new FormData();
    for (const file of Array.from(files)) {
      formData.append("files", file);
    }
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    if (res.ok) {
      const { urls } = await res.json();
      setFormImages((prev) => [...prev, ...urls]);
    }
    setUploading(false);
  };

  const removeFormImage = (index: number) => {
    setFormImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = {
      name: form.name,
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
      category: form.category,
      sizes: form.sizes.split(",").map((s) => Number(s.trim())).filter(Boolean),
      colors: form.colors.split(",").map((s) => s.trim()).filter(Boolean),
      images: formImages,
      stock: Number(form.stock) || 0,
      description: form.description,
      material: form.material,
      isNew: form.isNew,
    };

    if (editingProduct) {
      const res = await fetch(`/api/produits/${editingProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        const updated = await res.json();
        setProducts((prev) => prev.map((p) => p.id === editingProduct.id ? { ...p, ...updated } : p));
      }
    } else {
      const res = await fetch("/api/produits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        const newProduct = await res.json();
        setProducts((prev) => [...prev, newProduct]);
      }
    }
    setShowForm(false);
    resetForm();
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    const res = await fetch(`/api/produits/${deleteId}`, { method: "DELETE" });
    if (res.ok) {
      setProducts((prev) => prev.filter((p) => p.id !== deleteId));
    }
    setDeleteId(null);
  };

  const handleStockChange = async (id: string, newStock: number) => {
    const res = await fetch(`/api/produits/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stock: newStock }),
    });
    if (res.ok) {
      setProducts((prev) => prev.map((p) => p.id === id ? { ...p, stock: newStock } : p));
    }
  };

  const handleRemoveImage = async (productId: string, imageIndex: number) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    const images = (() => { try { return JSON.parse(product.images); } catch { return []; } })();
    const newImages = images.filter((_: string, i: number) => i !== imageIndex);

    const res = await fetch(`/api/produits/${productId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ images: newImages }),
    });
    if (res.ok) {
      setProducts((prev) => prev.map((p) => p.id === productId ? { ...p, images: JSON.stringify(newImages) } : p));
    }
  };

  const handleReplaceImage = async (productId: string, imageIndex: number, file: File) => {
    const formData = new FormData();
    formData.append("files", file);
    const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
    if (!uploadRes.ok) return;
    const { urls } = await uploadRes.json();
    if (!urls.length) return;

    const product = products.find((p) => p.id === productId);
    if (!product) return;
    const images = (() => { try { return JSON.parse(product.images); } catch { return []; } })();
    images[imageIndex] = urls[0];

    const res = await fetch(`/api/produits/${productId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ images }),
    });
    if (res.ok) {
      setProducts((prev) => prev.map((p) => p.id === productId ? { ...p, images: JSON.stringify(images) } : p));
    }
  };

  const handleAddImage = async (productId: string, file: File) => {
    const formData = new FormData();
    formData.append("files", file);
    const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
    if (!uploadRes.ok) return;
    const { urls } = await uploadRes.json();
    if (!urls.length) return;

    const product = products.find((p) => p.id === productId);
    if (!product) return;
    const images = (() => { try { return JSON.parse(product.images); } catch { return []; } })();
    images.push(...urls);

    const res = await fetch(`/api/produits/${productId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ images }),
    });
    if (res.ok) {
      setProducts((prev) => prev.map((p) => p.id === productId ? { ...p, images: JSON.stringify(images) } : p));
    }
  };

  const parseJson = (val: string): string[] => {
    try { return JSON.parse(val); } catch { return []; }
  };

  const handlePromo = async (id: string) => {
    const originalPrice = promoPrice ? Number(promoPrice) : null;
    const res = await fetch(`/api/produits/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ originalPrice }),
    });
    if (res.ok) {
      setProducts((prev) => prev.map((p) => p.id === id ? { ...p, originalPrice } : p));
    }
    setPromoId(null);
    setPromoPrice("");
  };

  const openPromoForm = (product: Product) => {
    setPromoId(product.id);
    setPromoPrice(product.originalPrice ? String(product.originalPrice) : "");
  };

  const getPromoPercent = (price: number, originalPrice: number | null) => {
    if (!originalPrice || originalPrice <= price) return 0;
    return Math.round((1 - price / originalPrice) * 100);
  };

  const getStockColor = (stock: number) => {
    if (stock === 0) return "text-red-600 bg-red-50";
    if (stock <= 5) return "text-amber-600 bg-amber-50";
    return "text-green-600 bg-green-50";
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-stone-900">Produits</h1>
          <p className="text-sm text-stone-500 mt-1">{products.length} produits au catalogue</p>
        </div>
        <button onClick={openAddForm} className="bg-stone-900 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-stone-800 transition-colors">
          {showForm ? "Annuler" : "+ Ajouter"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-stone-100 rounded-xl p-6 mb-6">
          <h2 className="font-medium text-stone-900 mb-4">{editingProduct ? `Modifier : ${editingProduct.name}` : "Nouveau produit"}</h2>
          <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Nom *</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Catégorie</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200">
                <option value="baskets">Baskets</option>
                <option value="escarpins">Escarpins & Talons</option>
                <option value="sandales">Sandales</option>
                <option value="bottes">Bottes & Bottines</option>
                <option value="ballerines">Ballerines & Mocassins</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Prix (F) *</label>
              <input required type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Prix barré (F)</label>
              <input type="number" value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: e.target.value })} className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Stock *</label>
              <input required type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Tailles (virgule)</label>
              <input value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} placeholder="35, 36, 37, 38" className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Couleurs (virgule)</label>
              <input value={form.colors} onChange={(e) => setForm({ ...form, colors: e.target.value })} placeholder="Noir, Blanc, Rose" className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Matière</label>
              <input value={form.material} onChange={(e) => setForm({ ...form, material: e.target.value })} className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200" />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm text-stone-700 cursor-pointer">
                <input type="checkbox" checked={form.isNew} onChange={(e) => setForm({ ...form, isNew: e.target.checked })} className="rounded border-stone-300" />
                Nouveau produit
              </label>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200 resize-none" />
            </div>

            {/* Images */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Images</label>
              <div className="flex flex-wrap gap-3">
                {formImages.map((url, i) => (
                  <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden bg-stone-100 border border-stone-200">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeFormImage(i)} className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs hover:bg-red-600">
                      x
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="w-20 h-20 rounded-lg border-2 border-dashed border-stone-300 flex flex-col items-center justify-center text-stone-400 hover:border-stone-400 hover:text-stone-500 transition-colors disabled:opacity-50">
                  {uploading ? <span className="text-[10px]">...</span> : (
                    <>
                      <svg className="w-5 h-5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                      <span className="text-[10px]">Ajouter</span>
                    </>
                  )}
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleUpload(e.target.files)} />
              </div>
            </div>

            <div className="sm:col-span-2 flex items-center gap-3">
              <button type="submit" className="bg-stone-900 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-stone-800 transition-colors">
                {editingProduct ? "Enregistrer les modifications" : "Créer le produit"}
              </button>
              <button type="button" onClick={() => { setShowForm(false); resetForm(); }} className="text-sm text-stone-500 hover:text-stone-900">
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mb-4">
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un produit..." className="w-full max-w-md bg-white border border-stone-200 rounded-full px-5 py-2.5 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-200" />
      </div>

      {loading ? (
        <p className="text-sm text-stone-400 py-8 text-center">Chargement...</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((product) => {
            const images = parseJson(product.images);
            return (
              <div key={product.id} className="bg-white rounded-xl border border-stone-100 p-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                    {images[0] ? (
                      <img src={images[0]} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-medium text-stone-900">{product.name}</h3>
                        <p className="text-xs text-stone-400 capitalize">{product.category}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-stone-900">{formatPrice(product.price)}</p>
                          {product.originalPrice && (
                            <span className="text-[10px] font-medium text-white bg-rose-500 px-1.5 py-0.5 rounded-full">
                              -{getPromoPercent(product.price, product.originalPrice)}%
                            </span>
                          )}
                        </div>
                        {product.originalPrice && <p className="text-xs text-stone-400 line-through">{formatPrice(product.originalPrice)}</p>}
                      </div>
                    </div>

                    {images.length > 0 ? (
                      <div className="flex items-center gap-1.5 mt-2">
                        {images.map((img: string, i: number) => (
                          <div key={i} className="relative group/img w-10 h-10 rounded overflow-hidden bg-stone-100 border border-stone-200">
                            <img src={img} alt="" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-0.5 opacity-0 group-hover/img:opacity-100 transition-opacity">
                              <label className="cursor-pointer w-5 h-5 flex items-center justify-center rounded bg-blue-500/80 hover:bg-blue-500" title="Remplacer">
                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
                                </svg>
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) handleReplaceImage(product.id, i, e.target.files[0]); }} />
                              </label>
                              <button onClick={() => handleRemoveImage(product.id, i)} className="w-5 h-5 flex items-center justify-center rounded bg-red-500/80 hover:bg-red-500" title="Supprimer">
                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))}
                        <label className="w-10 h-10 rounded border border-dashed border-stone-300 flex items-center justify-center text-stone-400 hover:border-stone-400 hover:text-stone-500 transition-colors cursor-pointer">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                          </svg>
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) handleAddImage(product.id, e.target.files[0]); }} />
                        </label>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 mt-2">
                        <div className="w-10 h-10 rounded bg-stone-100 border border-stone-200 flex items-center justify-center">
                          <svg className="w-5 h-5 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                          </svg>
                        </div>
                        <label className="w-10 h-10 rounded border border-dashed border-stone-300 flex items-center justify-center text-stone-400 hover:border-stone-400 hover:text-stone-500 transition-colors cursor-pointer">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                          </svg>
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) handleAddImage(product.id, e.target.files[0]); }} />
                        </label>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-stone-400">Stock :</span>
                        <input
                          type="number"
                          min="0"
                          value={product.stock}
                          onChange={(e) => handleStockChange(product.id, Number(e.target.value))}
                          className={`w-16 text-xs font-medium px-2 py-1 rounded border border-stone-200 text-center focus:outline-none focus:ring-2 focus:ring-stone-200 ${getStockColor(product.stock)}`}
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        {promoId === product.id ? (
                          <div className="flex items-center gap-2 bg-rose-50 rounded-lg px-3 py-1.5">
                            <span className="text-xs text-stone-500">Prix promo :</span>
                            <input
                              type="number"
                              min="0"
                              value={promoPrice}
                              onChange={(e) => setPromoPrice(e.target.value)}
                              placeholder="Prix barré"
                              className="w-24 text-xs px-2 py-1 rounded border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-200"
                            />
                            <button onClick={() => handlePromo(product.id)} className="text-xs font-medium text-rose-600 hover:text-rose-700">OK</button>
                            <button onClick={() => { setPromoId(null); setPromoPrice(""); }} className="text-xs text-stone-400 hover:text-stone-600">x</button>
                          </div>
                        ) : (
                          <button onClick={() => openPromoForm(product)} className={`text-xs ${product.originalPrice ? "text-rose-600 font-medium" : "text-stone-500 hover:text-rose-600"}`}>
                            {product.originalPrice ? `${getPromoPercent(product.price, product.originalPrice)}% promo` : "Promo"}
                          </button>
                        )}
                        <button onClick={() => openEditForm(product)} className="text-xs text-stone-500 hover:text-stone-900">Modifier</button>
                        <button onClick={() => setDeleteId(product.id)} className="text-xs text-stone-500 hover:text-red-600">Supprimer</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmModal
        open={deleteId !== null}
        title="Supprimer ce produit ?"
        message="Cette action est irréversible. Le produit et toutes ses images seront définitivement supprimés."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
