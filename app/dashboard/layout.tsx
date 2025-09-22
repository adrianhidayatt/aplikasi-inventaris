// File: app/dashboard/layout.tsx
// PERBAIKAN: Menggunakan path relatif yang benar untuk menemukan LogoutButton
import LogoutButton from "app/components/LogoutButton"; 

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <header className="bg-gray-800 text-white p-4 shadow-md">
        <nav className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Dashboard Inventaris</h1>
          <LogoutButton />
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
}