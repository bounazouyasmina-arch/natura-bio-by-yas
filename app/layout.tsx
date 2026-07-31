import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "natura'bio by yas | Santé au naturel · Chat IA & coaching",
  description:
    "Chat IA gratuit (10 questions) avec 9 expertes en santé naturelle. Ebook Hormones Sereine 9,99 € (cycle, SOPK, endométriose, thyroïde, pré-ménopause, ménopause) + chat illimité. Coaching 4 semaines 167 €.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "natura'bio by yas — Santé & bien-être au naturel",
    description:
      "10 questions gratuites au chat IA. Ebook Hormones Sereine 9,99 € pour l'illimité. Coaching personnalisé 4 semaines.",
    locale: "fr_FR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--cream)]">
        {children}
        <Toaster position="top-center" richColors closeButton />
        <Analytics />
      </body>
    </html>
  );
}
