// File: app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Aplikasi Inventaris",
  description: "Kelola stok barang Anda",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* --- TAMBAHKAN className DI SINI --- */}
      <body className={`${inter.className} bg-gray-50 dark:bg-gray-900`}>
        {children}
      </body>
    </html>
  );
}