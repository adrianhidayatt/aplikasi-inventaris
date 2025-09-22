import { createClient } from '../../../lib/supabase/server';
import ProductClient from 'app/components/ProductClient';

async function getCategoryDetails(categoryId: string) {
    const supabase = await createClient();
    const { data: category } = await supabase.from('categories').select('name').eq('id', categoryId).single();
    const { data: products } = await supabase.from('products').select('*').eq('category_id', categoryId).order('name');
    return {
        categoryName: category?.name || 'Kategori Tidak Ditemukan',
        products: products || []
    };
}

export default async function InventoryPage({ params }: { params: { categoryId: string } }) {
  // Ganti nama 'category' menjadi 'categoryId' agar lebih jelas
  const { categoryName, products } = await getCategoryDetails(params.categoryId);

  return (
    <main className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Manajemen Stok: {categoryName}</h1>
      <ProductClient 
        initialProducts={products} 
        categoryId={parseInt(params.categoryId)} 
      />
    </main>
  );
}