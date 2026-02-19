import type { Metadata } from "next";
import { Geist } from "next/font/google";
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
      <body className={`${geistSans.variable} antialiased`} suppressHydrationWarning>{children}</body>
    </html>
  );
}
