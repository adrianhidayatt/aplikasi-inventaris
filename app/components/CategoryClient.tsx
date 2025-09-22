// File: components/CategoryClient.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Category { id: number; name: string; slug: string; }

export default function CategoryClient({ initialCategories }: { initialCategories: Category[] }) {
  const [isEditing, setIsEditing] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const router = useRouter();

  const resetForm = () => { setIsEditing(null); setName(''); setSlug(''); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = isEditing ? 'PUT' : 'POST';
    const body = isEditing ? { id: isEditing.id, name, slug } : { name, slug };
    await fetch('/api/categories', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    resetForm();
    router.refresh();
  };

  const handleEdit = (category: Category) => { setIsEditing(category); setName(category.name); setSlug(category.slug); };

  const handleDelete = async (id: number) => {
    if (confirm('Anda yakin ingin menghapus kategori ini? Semua produk di dalamnya juga akan terhapus.')) {
      await fetch('/api/categories', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
      router.refresh();
    }
  };

  return (
    <div>
      <div className="mb-8 p-6 border rounded-lg shadow-md bg-white">
        <h3 className="text-xl font-bold mb-4">{isEditing ? `Edit Kategori: ${isEditing.name}` : 'Tambah Kategori Baru'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="cat-name" className="block text-sm font-medium text-gray-700">Nama Kategori</label>
            <input id="cat-name" type="text" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label htmlFor="cat-slug" className="block text-sm font-medium text-gray-700">Slug (untuk URL, huruf-kecil-tanpa-spasi)</label>
            <input id="cat-slug" type="text" value={slug} onChange={(e) => setSlug(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
          <div className="flex space-x-2">
            <button type="submit" className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700">{isEditing ? 'Simpan Perubahan' : 'Simpan Kategori'}</button>
            {isEditing && (<button type="button" onClick={resetForm} className="w-full py-2 px-4 bg-gray-200 rounded-md">Batal</button>)}
          </div>
        </form>
      </div>
      <h1 className="text-3xl font-bold mb-6">Pilih Kategori Inventaris</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {initialCategories.map((category) => (
          <div key={category.id} className="flex items-center justify-between p-4 bg-white border rounded-lg shadow-sm">
            <Link href={`/dashboard/inventory/${category.id}`} className="flex-grow"><h2 className="text-2xl font-semibold text-indigo-600 hover:underline">{category.name}</h2></Link>
            <div className="flex space-x-2">
              <button onClick={() => handleEdit(category)} className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600">Edit</button>
              <button onClick={() => handleDelete(category.id)} className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}