// File: app/dashboard/page.tsx
import CategoryClient from 'app/components/CategoryClient';
import { createClient } from '../../lib/supabase/server';

async function getCategories() {
  const supabase = await createClient();
  const { data } = await supabase.from('categories').select('*').order('created_at');
  return data || [];
}

export default async function DashboardPage() {
  const categories = await getCategories();
  return (
    <main className="container mx-auto p-8">
      <CategoryClient initialCategories={categories} />
    </main>
  );
}
