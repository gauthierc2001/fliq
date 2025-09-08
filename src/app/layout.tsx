import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import WalletProvider from "@/components/providers/WalletProvider";
import Navigation from "@/components/Navigation";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Fliq - Predict the future in a flick",
  description: "A Solana-powered prediction market with mobile-first swipe UX",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-white`}>
        <WalletProvider>
          <Navigation />
          <main className="min-h-screen pb-20 md:pb-0">
            {children}
          </main>
        </WalletProvider>
      </body>
    </html>
  );
}