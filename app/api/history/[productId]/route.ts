// File: app/api/history/[productId]/route.ts
import { createClient } from '@/lib/supabase/server';
import { NextResponse, type NextRequest } from 'next/server';

// The type for the second argument has been adjusted
export async function GET(
  request: NextRequest, 
  { params }: { params: { productId: string } }
) {
  const supabase = await createClient();
  const { productId } = params;

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