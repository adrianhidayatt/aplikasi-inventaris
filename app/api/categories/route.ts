// File: app/api/categories/route.ts
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// Fungsi untuk GET (mengambil semua kategori)
export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('categories').select('*');
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ data });
}

// Fungsi untuk POST (menambah kategori baru)
export async function POST(request: Request) {
  const { name, slug } = await request.json();
  if (!name || !slug) {
    return NextResponse.json({ error: 'Nama dan slug dibutuhkan' }, { status: 400 });
  }
  
  const supabase = await createClient();
  const { data, error } = await supabase.from('categories').insert([{ name, slug }]).select();
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ message: 'Kategori berhasil ditambahkan', data }, { status: 201 });
}

// --- FUNGSI BARU UNTUK EDIT/UPDATE NAMA KATEGORI ---
export async function PUT(request: Request) {
  const { id, name, slug } = await request.json();
  if (!id || !name || !slug) {
    return NextResponse.json({ error: 'ID, Nama, dan Slug dibutuhkan' }, { status: 400 });
  }
  
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('categories')
    .update({ name, slug })
    .eq('id', id)
    .select();
  
  if (error) { return NextResponse.json({ error: error.message }, { status: 500 }); }
  return NextResponse.json({ message: 'Kategori berhasil diupdate', data });
}

// --- FUNGSI BARU UNTUK MENGHAPUS KATEGORI ---
export async function DELETE(request: Request) {
  const { id } = await request.json();
  if (!id) {
    return NextResponse.json({ error: 'ID Kategori dibutuhkan' }, { status: 400 });
  }
  
  const supabase = await createClient();
  // Karena kita sudah set 'Cascade' di database,
  // Supabase akan otomatis menghapus semua produk yang terkait dengan kategori ini.
  const { error } = await supabase.from('categories').delete().eq('id', id);
  
  if (error) { return NextResponse.json({ error: error.message }, { status: 500 }); }
  return NextResponse.json({ message: 'Kategori dan semua produk di dalamnya berhasil dihapus' });
}