// File: components/LogoutButton.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default function LogoutButton() {
  const signOut = async () => {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    // PERBAIKAN: Arahkan ke halaman utama setelah logout
    return redirect("/"); 
  };

  return (
    <form action={signOut}>
      <button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md">
        Logout
      </button>
    </form>
  );
}