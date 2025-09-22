// File: lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  // Ambil variabel environment yang sudah kita buat di .env.local
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;


  return createBrowserClient(supabaseUrl, supabaseKey);
}

