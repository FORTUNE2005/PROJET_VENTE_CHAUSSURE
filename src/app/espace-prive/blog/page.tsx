"use client";

import { useState, useEffect, useCallback } from "react";
import AdminGuard from "@/components/AdminGuard";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  author: string;
  published: number;
  createdAt: string;
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [form, setForm] = useState({ title: "", excerpt: "", content: "", image: "", category: "Conseils", author: "Lucia", published: true });

  const fetchPosts = useCallback(() => {
    fetch("/api/blog?all=1")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setPosts(data); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleSave = async () => {
    const method = editing ? "PUT" : "POST";
    const body = editing ? { ...form, id: editing.id } : form;
    await fetch("/api/blog", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setEditing(null);
    setForm({ title: "", excerpt: "", content: "", image: "", category: "Conseils", author: "Lucia", published: true });
    fetchPosts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cet article ?")) return;
    await fetch(`/api/blog?id=${id}`, { method: "DELETE" });
    fetchPosts();
  };

  const handleEdit = (post: BlogPost) => {
    setEditing(post);
    setForm({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      image: post.image,
      category: post.category,
      author: post.author,
      published: post.published === 1,
    });
  };

  return (
    <AdminGuard>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif font-bold text-stone-900">Blog</h1>
            <p className="text-sm text-stone-500 mt-1">{posts.length} articles</p>
          </div>
          <button
            onClick={() => { setEditing(null); setForm({ title: "", excerpt: "", content: "", image: "", category: "Conseils", author: "Lucia", published: true }); }}
            className="bg-stone-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-stone-800"
          >
            Nouvel article
          </button>
        </div>

        {/* Form */}
        {(editing || form.title || form.content) && (
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
            <h2 className="font-medium text-stone-900">{editing ? "Modifier l'article" : "Nouvel article"}</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Titre</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Catégorie</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200">
                  <option>Conseils</option>
                  <option>Tendances</option>
                  <option>Entretien</option>
                  <option>Guide</option>
                  <option>Style</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Extrait</label>
              <input value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Contenu</label>
              <textarea rows={6} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200 resize-none" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Image URL</label>
                <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200" placeholder="/blog/image.jpg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Auteur</label>
                <input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="published" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })}
                className="w-4 h-4 rounded border-stone-300" />
              <label htmlFor="published" className="text-sm text-stone-700">Publié</label>
            </div>
            <div className="flex gap-3">
              <button onClick={handleSave} className="bg-stone-900 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-stone-800">
                {editing ? "Mettre à jour" : "Publier"}
              </button>
              <button onClick={() => { setEditing(null); setForm({ title: "", excerpt: "", content: "", image: "", category: "Conseils", author: "Lucia", published: true }); }}
                className="text-sm text-stone-500 hover:text-stone-700">
                Annuler
              </button>
            </div>
          </div>
        )}

        {/* Posts list */}
        <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-stone-100 text-left">
                <th className="px-6 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">Titre</th>
                <th className="px-6 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider hidden sm:table-cell">Catégorie</th>
                <th className="px-6 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider hidden md:table-cell">Statut</th>
                <th className="px-6 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-stone-50">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-stone-900 line-clamp-1">{post.title}</p>
                    <p className="text-xs text-stone-400 mt-0.5 line-clamp-1">{post.excerpt}</p>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <span className="text-xs bg-stone-100 text-stone-600 px-2 py-1 rounded-full">{post.category}</span>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className={`text-xs px-2 py-1 rounded-full ${post.published ? "bg-green-100 text-green-700" : "bg-stone-100 text-stone-500"}`}>
                      {post.published ? "Publié" : "Brouillon"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleEdit(post)} className="text-xs text-stone-500 hover:text-stone-900">Modifier</button>
                      <button onClick={() => handleDelete(post.id)} className="text-xs text-red-500 hover:text-red-700">Supprimer</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminGuard>
  );
}
