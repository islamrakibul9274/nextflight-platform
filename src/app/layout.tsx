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
  title: "NextFlight — Modern Flight Search & Aviation Intelligence",
  description:
    "Next-generation flight discovery. Direct international corridors, transparent airline pricing, interactive 3D seat maps, and effortless booking across global gateways.",
  keywords: [
    "NextFlight",
    "flights",
    "airline booking",
    "flight tickets",
    "business class",
    "first class",
    "flight search engine",
    "travel intelligence",
  ],
  authors: [{ name: "NextFlight Aviation Technologies" }],
  openGraph: {
    title: "NextFlight — Modern Flight Search & Aviation Intelligence",
    description:
      "Direct international corridors, transparent airline pricing, and effortless flight booking.",
    url: "https://nextflight.aero",
    siteName: "NextFlight",
    images: [
      {
        url: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "NextFlight Aviation Platform",
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
