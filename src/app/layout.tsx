import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Sony WH-1000XM6 — Silence, Perfected | Flagship Wireless Noise Cancelling",
  description:
    "Experience the pinnacle of acoustic engineering. Sony WH-1000XM6 redefines active noise cancellation, custom multi-layer drivers, and high-resolution spatial sound.",
  keywords: [
    "Sony WH-1000XM6",
    "Sony Headphones",
    "Wireless Noise Cancelling",
    "Audiophile",
    "Hi-Res Audio",
    "Apple Scrollytelling",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans bg-[#050505] text-[#f0f0f2] antialiased min-h-screen selection:bg-[#0050ff] selection:text-white`}
      >
        {children}
      </body>
    </html>
  );
}
