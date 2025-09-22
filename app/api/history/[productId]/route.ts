// File: app/api/history/[productId]/route.ts
import { createClient } from '@/lib/supabase/server';
import { NextResponse, type NextRequest } from 'next/server';

export async function GET(
  request: NextRequest, 
  // PERBAIKAN: Kita terima 'context' lalu ambil 'params' dari dalamnya.
  context: { params: { productId: string } }
) {
  const supabase = await createClient();
  const { productId } = context.params; // Mengambil productId dari context.params

  const { data, error } = await supabase
    .from('stock_history')
    .select('*, products(name)')
    .eq('product_id', productId)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ data });
}