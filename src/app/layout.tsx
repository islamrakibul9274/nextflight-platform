import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AETHERIA — Next-Generation Flight Intelligence & Travel Platform",
  description:
    "Aviation reimagined. Direct international corridors, transparent airline pricing, cinematic 3D travel experiences, and effortless flight booking across 180+ global gateways.",
  keywords: [
    "flights",
    "airline booking",
    "flight ticket",
    "business class",
    "first class",
    "Google Flights alternative",
    "Aetheria",
    "travel intelligence",
  ],
  authors: [{ name: "Aetheria Aero Systems" }],
  openGraph: {
    title: "AETHERIA — Next-Generation Flight Intelligence & Travel Platform",
    description:
      "Direct international corridors, transparent airline pricing, and effortless flight booking.",
    url: "https://aetheria.aero",
    siteName: "AETHERIA",
    images: [
      {
        url: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "AETHERIA Aviation Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-white text-slate-900 selection:bg-sky-100 selection:text-sky-900">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
