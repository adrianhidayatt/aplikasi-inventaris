// File: app/dashboard/history/[productId]/page.tsx
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

async function getStockHistory(productId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('stock_history')
    .select('*, products(name)') // Mengambil nama dari tabel products
    .eq('product_id', productId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching history:", error);
    return [];
  }
  return data;
}

export default async function HistoryPage({ params }: { params: { productId: string } }) {
  const history = await getStockHistory(params.productId);
  const productName = history.length > 0 ? history[0].products.name : "Produk tidak ditemukan";

  return (
    <main className="container mx-auto p-8">
      <Link href="/dashboard" className="text-indigo-600 hover:underline mb-4 inline-block">&larr; Kembali ke Dashboard</Link>
      <h1 className="text-3xl font-bold mb-6">Riwayat Stok: {productName}</h1>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 font-medium">Waktu Transaksi</th>
              <th className="px-6 py-3 font-medium">Alasan</th>
              <th className="px-6 py-3 font-medium">Perubahan</th>
              <th className="px-6 py-3 font-medium">Stok Akhir</th>
            </tr>
          </thead>
          <tbody>
            {history.map((log: any) => (
              <tr key={log.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">{new Date(log.created_at).toLocaleString()}</td>
                <td className="px-6 py-4">{log.reason}</td>
                <td className={`px-6 py-4 font-bold ${log.quantity_change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {log.quantity_change > 0 ? `+${log.quantity_change}` : log.quantity_change}
                </td>
                <td className="px-6 py-4">{log.new_quantity_after_change}</td>
              </tr>
            ))}
            {history.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-500">Belum ada riwayat untuk produk ini.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}