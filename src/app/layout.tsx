import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Farmacia de Turno Chile | Encuentra tu farmacia más cercana",
  description:
    "Encuentra fácilmente la farmacia de turno más cercana en Chile. Busca por región y comuna. Datos actualizados diariamente desde MINSAL.",
  keywords: ["farmacia de turno", "farmacias Chile", "farmacia cerca", "turno farmacia"],
  openGraph: {
    title: "Farmacia de Turno Chile",
    description: "Encuentra la farmacia de turno más cercana en Chile",
    locale: "es_CL",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} antialiased`} suppressHydrationWarning>
        {children}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5677105863319473"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
