import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AmbientAudio } from "@/components/ambient-audio";

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

export const metadata: Metadata = {
  title: {
    default: "Amazigh Comics",
    template: "%s | Amazigh Comics",
  },
  description:
    "BD webtoon kabyle — Astérix version Kabylie. Scroll, lis, voyage.",
  keywords: ["BD", "webtoon", "kabyle", "amazigh", "comics", "bande dessinée"],
  authors: [{ name: "Amazigh Comics" }],
  creator: "Amazigh Comics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} ${lora.variable}`}>
      <body className="min-h-screen flex flex-col antialiased">
        <Header />
        <main className="flex-1 relative">{children}</main>
        <Footer />
        <AmbientAudio />
      </body>
    </html>
  );
}
