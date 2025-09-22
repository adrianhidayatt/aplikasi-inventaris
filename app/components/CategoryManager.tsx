// File: components/CategoryManager.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Definisikan tipe data untuk kategori
interface Category {
  id: number;
  name: string;
  slug: string;
}

export default function CategoryManager({ initialCategories }: { initialCategories: Category[] }) {
  const [categories, setCategories] = useState(initialCategories);
  const router = useRouter();

  const handleDelete = async (id: number) => {
    if (confirm('Anda yakin ingin menghapus kategori ini? Semua produk di dalamnya akan ikut terhapus.')) {
      await fetch('/api/categories', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      router.refresh(); // Refresh halaman untuk menampilkan daftar kategori terbaru
    }
  };
  
  // Fungsi untuk menambah & mengedit kategori akan kita tambahkan di form terpisah
  // Untuk saat ini, kita tampilkan dulu daftar dan tombol delete

  return (
    <div>
      {/* Nanti di sini kita letakkan form untuk menambah/mengedit kategori */}
      <h1 className="text-3xl font-bold mb-6">Kelola Kategori Inventaris</h1>
      <div className="space-y-4">
        {categories.map((category) => (
          <div key={category.id} className="flex items-center justify-between p-4 bg-white border rounded-lg shadow-sm">
            <Link href={`/dashboard/inventory/${category.id}`} className="flex-grow">
              <h2 className="text-2xl font-semibold text-indigo-600 hover:underline">{category.name}</h2>
            </Link>
            <div className="flex space-x-2">
              <button className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600">Edit</button>
              <button onClick={() => handleDelete(category.id)} className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}