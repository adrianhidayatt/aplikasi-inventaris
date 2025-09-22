// File: app/api/products/route.ts
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// --- FUNGSI UNTUK MENAMBAH PRODUK BARU (POST) ---
export async function POST(request: Request) {
  // Tambahkan 'slug' di sini
  const { name, quantity, category_id, slug } = await request.json();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('products')
    .insert([{ name, quantity: Number(quantity), category_id, slug, last_change: Number(quantity) }])
    .select();
  if (error) { return NextResponse.json({ error: error.message }, { status: 500 }); }
  return NextResponse.json({ data }, { status: 201 });
}

// --- FUNGSI UNTUK MENGEDIT NAMA & SLUG PRODUK (PUT) ---
export async function PUT(request: Request) {
  // Tambahkan 'slug' di sini
  const { id, name, slug } = await request.json();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('products')
    .update({ name, slug }) // Update nama dan slug
    .eq('id', id)
    .select();
  if (error) { return NextResponse.json({ error: error.message }, { status: 500 }); }
  return NextResponse.json({ data });
}

// --- FUNGSI UNTUK UPDATE STOK (PATCH) ---
export async function PATCH(request: Request) {
  const { productId, quantityChange } = await request.json();
  const supabase = await createClient();
  
  const { data: currentProduct, error: fetchError } = await supabase
    .from('products').select('quantity').eq('id', productId).single();
  if (fetchError) { return NextResponse.json({ error: 'Produk tidak ditemukan' }, { status: 404 }); }

  const newQuantity = currentProduct.quantity + Number(quantityChange);
  const { data, error: updateError } = await supabase
    .from('products')
    .update({ 
      quantity: newQuantity, 
      last_change: Number(quantityChange),
      last_updated_at: new Date().toISOString() 
    })
    .eq('id', productId)
    .select();
  
  if (updateError) { return NextResponse.json({ error: updateError.message }, { status: 500 }); }

  await supabase.from('stock_history').insert([
    { product_id: productId, quantity_change: Number(quantityChange), new_quantity_after_change: newQuantity, reason: Number(quantityChange) > 0 ? 'Stok Masuk' : 'Stok Keluar'}
  ]);
  
  return NextResponse.json({ data });
}

// --- FUNGSI UNTUK MENGHAPUS PRODUK (DELETE) ---
export async function DELETE(request: Request) {
  const { id } = await request.json();
  const supabase = await createClient();
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) { return NextResponse.json({ error: error.message }, { status: 500 }); }
  return NextResponse.json({ message: 'Produk berhasil dihapus' });
}