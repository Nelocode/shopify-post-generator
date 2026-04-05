import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from 'next/link';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Shopify AI Content Generator",
  description: "Sistema autónomo de generación de blogs bilingües",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-black text-white min-h-screen flex`}>
        {/* Sidebar */}
        <aside className="w-64 border-r border-white border-opacity-10 p-6 flex flex-col gap-8">
          <div className="text-2xl font-bold premium-gradient bg-clip-text text-transparent italic">
            ShopifyAI
          </div>
          <nav className="flex flex-col gap-2">
            <Link href="/" className="nav-item">Dashboard</Link>
            <Link href="/topics" className="nav-item">Temas</Link>
            <Link href="/config" className="nav-item">Configuración</Link>
            <Link href="/settings" className="nav-item">Ajustes</Link>
          </nav>
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
