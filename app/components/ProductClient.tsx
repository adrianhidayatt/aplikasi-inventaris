// File: components/ProductClient.tsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Definisikan tipe data untuk Produk, sekarang dengan slug
interface Product {
  id: number;
  name: string;
  slug: string;
  quantity: number;
  last_updated_at: string;
  last_change: number;
}

export default function ProductClient({ initialProducts, categoryId }: { initialProducts: Product[], categoryId: number }) {
  const [products, setProducts] = useState(initialProducts);
  const [isEditing, setIsEditing] = useState<Product | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [quantity, setQuantity] = useState('');
  // State baru untuk input stok yang lebih presisi, satu untuk setiap produk
  const [stockChange, setStockChange] = useState<Record<number, string>>({});
  const router = useRouter();
  
  useEffect(() => { setProducts(initialProducts); }, [initialProducts]);

  // Fungsi untuk mereset form ke keadaan awal
  const resetForm = () => {
    setIsEditing(null);
    setName('');
    setSlug('');
    setQuantity('');
  };

  // Fungsi yang menangani submit form (untuk menambah atau edit)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: isEditing.id, name, slug }),
      });
    } else {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, slug, quantity: Number(quantity), category_id: categoryId }),
      });
    }
    resetForm();
    router.refresh();
  };
  
  // --- FUNGSI UPDATE STOK YANG DISEMPURNAKAN ---
  const handleStockUpdate = async (product: Product) => {
    const changeAmount = parseInt(stockChange[product.id] || "0");
    if (isNaN(changeAmount) || changeAmount === 0) return; // Jangan lakukan apa-apa jika input kosong atau 0

    await fetch('/api/products', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: product.id, quantityChange: changeAmount }),
    });

    // Kosongkan kembali input setelah berhasil
    setStockChange(prev => ({ ...prev, [product.id]: '' }));
    router.refresh();
  };

  // Fungsi untuk menghapus produk
  const handleDelete = async (id: number) => {
    if (confirm('Anda yakin ingin menghapus produk ini? Riwayat stoknya juga akan terhapus.')) {
      await fetch('/api/products', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      router.refresh();
    }
  };
  
  // Fungsi untuk masuk ke mode edit
  const handleEdit = (product: Product) => {
    setIsEditing(product);
    setName(product.name);
    setSlug(product.slug);
  };

  return (
    <div>
      {/* --- FORM UNTUK TAMBAH/EDIT PRODUK --- */}
      <div className="mb-8 p-6 border rounded-lg shadow-md bg-white">
        <h2 className="text-2xl font-bold mb-4">{isEditing ? `Edit Produk: ${isEditing.name}` : 'Tambah Produk Baru'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="product_name" className="block text-sm font-medium text-gray-700">Nama Produk</label>
            <input id="product_name" type="text" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 border rounded-md" />
          </div>
          <div>
            <label htmlFor="product_slug" className="block text-sm font-medium text-gray-700">Kode Produk (Slug)</label>
            <input id="product_slug" type="text" value={slug} onChange={(e) => setSlug(e.target.value)} required className="mt-1 block w-full px-3 py-2 border rounded-md" placeholder="contoh: lmp-phl-3w"/>
          </div>
          {!isEditing && (
             <div>
                <label htmlFor="product_quantity" className="block text-sm font-medium text-gray-700">Jumlah Awal</label>
                <input id="product_quantity" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} required className="mt-1 block w-full px-3 py-2 border rounded-md" />
            </div>
          )}
          <div className="flex space-x-2">
            <button type="submit" className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700">{isEditing ? 'Simpan Perubahan' : 'Simpan Produk'}</button>
            {isEditing && ( <button type="button" onClick={resetForm} className="w-full py-2 px-4 bg-gray-200 rounded-md">Batal</button> )}
          </div>
        </form>
      </div>

      {/* --- DAFTAR PRODUK TERKINI --- */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Stok Terkini</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="border p-4 rounded-lg shadow-md bg-white space-y-3">
              <div>
                <h3 className="text-xl font-semibold">{product.name}</h3>
                <p className="text-sm font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded-md inline-block mt-1">{product.slug}</p>
              </div>
              <p className="text-gray-600">
                Jumlah: <span className="font-bold text-2xl text-blue-700">{product.quantity}</span>
              </p>
              
              {/* --- BAGIAN UPDATE STOK YANG BARU DAN PRESISI --- */}
              <div className="pt-2">
                <label htmlFor={`stock-change-${product.id}`} className="block text-sm font-medium text-gray-700">Ubah Jumlah</label>
                <div className="flex items-center space-x-2 mt-1">
                  <input 
                    id={`stock-change-${product.id}`}
                    type="number" 
                    value={stockChange[product.id] || ''}
                    onChange={(e) => setStockChange(prev => ({ ...prev, [product.id]: e.target.value }))}
                    className="w-full border rounded-md px-2 py-1" 
                    placeholder="Contoh: 10 atau -5"
                  />
                  <button 
                    onClick={() => handleStockUpdate(product)}
                    className="bg-blue-500 text-white font-semibold py-1 px-3 rounded-md hover:bg-blue-600"
                  >
                    Update
                  </button>
                </div>
              </div>

              <p className="text-xs text-gray-500 pt-2 border-t">
                Perubahan Terakhir: <span className={`font-bold ${product.last_change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.last_change > 0 ? `+${product.last_change}` : product.last_change || 0}
                </span>
              </p>
              <p className="text-xs text-gray-500">
                Update Terakhir: {new Date(product.last_updated_at).toLocaleString()}
              </p>
              <div className="flex justify-between items-center pt-2 border-t">
                  <button onClick={() => handleEdit(product)} className="text-sm text-yellow-600 hover:underline">Edit</button>
                  <button onClick={() => handleDelete(product.id)} className="text-sm text-red-600 hover:underline">Hapus</button>
              </div>
            </div>
          ))}
          {products.length === 0 && <p className="col-span-full text-center text-gray-500 py-8">Belum ada produk di kategori ini. Silakan tambahkan satu menggunakan form di atas.</p>}
        </div>
      </div>
    </div>
  );
}