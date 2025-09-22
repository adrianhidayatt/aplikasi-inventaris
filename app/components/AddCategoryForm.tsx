// File: components/AddCategoryForm.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddCategoryForm() {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, slug }),
    });
    setName('');
    setSlug('');
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 p-6 border rounded-lg shadow-md bg-white space-y-4">
      <h3 className="text-xl font-bold">Tambah Kategori Baru</h3>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama Kategori</label>
        <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 border rounded-md" placeholder="Contoh: Perkakas Tangan" />
      </div>
      <div>
        <label htmlFor="slug" className="block text-sm font-medium text-gray-700">Slug (untuk URL)</label>
        <input id="slug" type="text" value={slug} onChange={(e) => setSlug(e.target.value)} required className="mt-1 block w-full px-3 py-2 border rounded-md" placeholder="contoh: perkakas-tangan" />
      </div>
      <button type="submit" className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700">
        Simpan Kategori
      </button>
    </form>
  );
}