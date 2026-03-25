import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";
import DonacionButton from "@/components/DonacionButton";
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

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Farmacia de Turno Chile',
  url: 'https://farmaciadeturnochile.cl',
  description: 'Encuentra fácilmente la farmacia de turno más cercana en Chile. Datos actualizados diariamente desde MINSAL.',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://farmaciadeturnochile.cl/turno/{search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className={`${geistSans.variable} antialiased`} suppressHydrationWarning>
        {children}
        <DonacionButton />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-PJQTGJCQT4"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-PJQTGJCQT4');
          `}
        </Script>
        {/* PUBLICIDAD — desactivada temporalmente
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5677105863319473"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        */}
        {/* KO-FI — reemplazado por Mercado Pago
        <Script id="kofi-widget" strategy="afterInteractive">
          {`
            (function() {
              var s = document.createElement('script');
              s.src = 'https://storage.ko-fi.com/cdn/scripts/overlay-widget.js';
              s.onload = function() {
                kofiWidgetOverlay.draw('farmaciadeturnochile', {
                  'type': 'floating-chat',
                  'floating-chat.donateButton.text': 'Apóyanos',
                  'floating-chat.donateButton.background-color': '#16a34a',
                  'floating-chat.donateButton.text-color': '#fff'
                });
              };
              document.head.appendChild(s);
            })();
          `}
        </Script>
        */}
      </body>
    </html>
  );
}
