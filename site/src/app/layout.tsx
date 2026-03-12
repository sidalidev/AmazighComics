import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import "./globals.css";
import { LayoutShell } from "@/components/layout-shell";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = "https://amazigh-comics.vercel.app"

export const metadata: Metadata = {
  title: {
    default: "Amazigh Comics — BD Webtoon Kabyle",
    template: "%s | Amazigh Comics",
  },
  description:
    "BD webtoon kabyle — Astérix version Kabylie. Un village insoumis résiste dans les montagnes du Djurdjura. Scroll, lis, voyage.",
  keywords: ["BD", "webtoon", "kabyle", "amazigh", "comics", "bande dessinée", "Kabylie", "Djurdjura", "tifinagh"],
  authors: [{ name: "Amazigh Comics" }],
  creator: "Amazigh Comics",
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: siteUrl,
    siteName: "Amazigh Comics",
    title: "Amazigh Comics — BD Webtoon Kabyle",
    description: "BD webtoon kabyle — Astérix version Kabylie. Un village insoumis résiste dans les montagnes du Djurdjura.",
    images: [
      {
        url: "/images/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Amazigh Comics — Les montagnes du Djurdjura",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Amazigh Comics — BD Webtoon Kabyle",
    description: "BD webtoon kabyle — Astérix version Kabylie. Un village insoumis résiste dans les montagnes du Djurdjura.",
    images: ["/images/og-default.jpg"],
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} ${lora.variable}`}>
      <body className="min-h-screen flex flex-col antialiased">
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
