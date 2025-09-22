// File: app/page.tsx (yang sudah dirapikan)
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-4xl font-bold mb-4">Selamat Datang di Aplikasi Inventaris</h1>
      <p className="text-lg text-gray-600 mb-8">Kelola stok barang Anda dengan mudah dan efisien.</p>
      <Link 
        href="/login"
        className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700"
      >
        Mulai Sekarang
      </Link>
    </main>
  );
}