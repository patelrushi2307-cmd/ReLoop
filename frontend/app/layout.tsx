import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import { LenisProvider } from "@/components/motion/LenisProvider";
import { RevealProvider } from "@/components/motion/RevealProvider";
import { AuthProvider } from "@/lib/auth";
import { brand } from "@/content/site";
import "./globals.css";

const display = Inter_Tight({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-display",
  display: "swap",
});

const title = "ReLoop — Carbon-aware exchange for surplus packaging";
const description =
  "A B2B exchange for surplus packaging materials that scores every match on net carbon impact and suppresses trades that emit more than they save.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, type: "website" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light" className={display.variable}>
      <body>
        <AuthProvider>
          <RevealProvider>
            {/* The preloader locks scrolling itself while it runs, so routes
                without one (dashboard, auth) are never left frozen. */}
            <LenisProvider>{children}</LenisProvider>
          </RevealProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
