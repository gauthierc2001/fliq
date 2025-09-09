import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import WalletProvider from "@/components/providers/WalletProvider";
import Navigation from "@/components/Navigation";
import ErrorBoundary from "@/components/ErrorBoundary";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Fliq - Predict the future in a flick",
  description: "A Solana-powered prediction market with mobile-first swipe UX",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  manifest: "/site.webmanifest",
  themeColor: "#6BC04A",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <ErrorBoundary>
          <WalletProvider>
            <Navigation />
            <main className="min-h-screen pb-20 md:pb-0">
              {children}
            </main>
          </WalletProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}