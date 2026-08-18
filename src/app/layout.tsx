import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nexa V2 — Fondation Technique",
  description: "Plateforme Nexa V2 - Base technique Next.js, TypeScript & Tailwind CSS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-slate-900 text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}
