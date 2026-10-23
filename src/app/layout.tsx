import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/components/ui/Toast";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
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
  metadataBase: new URL("https://nextflight-platform-2026.netlify.app"),
  title: {
    default: "NextFlight — Modern Flight Search & Booking",
    template: "%s — NextFlight",
  },
  description:
    "Search direct international corridors, compare transparent fares, pick seats visually, and book with secure Stripe checkout.",
  keywords: [
    "NextFlight",
    "flights",
    "airline booking",
    "flight tickets",
    "business class",
    "flight search engine",
  ],
  authors: [{ name: "NextFlight Aviation Technologies" }],
  openGraph: {
    title: "NextFlight — Modern Flight Search & Booking",
    description:
      "Direct international corridors, transparent airline pricing, and effortless flight booking.",
    url: "https://nextflight-platform-2026.netlify.app",
    siteName: "NextFlight",
    images: [
      {
        url: "/images/hero-airplane.jpg",
        width: 1200,
        height: 630,
        alt: "NextFlight aircraft above clouds",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NextFlight — Modern Flight Search & Booking",
    description: "Transparent fares, visual seat maps, secure checkout.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-white text-slate-900 selection:bg-sky-100 selection:text-sky-900">
        <AuthProvider>
          <ToastProvider>
            <a href="#main-content" className="skip-link">
              Skip to content
            </a>
            <Navbar />
            <main id="main-content" tabIndex={-1} className="flex-1">
              <ErrorBoundary>{children}</ErrorBoundary>
            </main>
            <Footer />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
