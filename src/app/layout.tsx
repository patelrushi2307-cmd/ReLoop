import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { NotificationProvider } from "@/contexts/NotificationContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ReLoop 3D — Circular Packaging & Materials Exchange",
  description:
    "The B2B marketplace for surplus & recyclable packaging materials. Trade wooden crates, steel drums, plastic pallets, IBC containers, and more. Reduce carbon emissions through reuse.",
  keywords: [
    "circular economy",
    "packaging reuse",
    "B2B marketplace",
    "carbon reduction",
    "recyclable materials",
    "surplus packaging",
    "industrial pallets",
    "steel drums",
    "IBC containers",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="font-sans antialiased bg-[#020817] text-slate-100">
        <AuthProvider>
          <WishlistProvider>
            <NotificationProvider>
              {children}
            </NotificationProvider>
          </WishlistProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
