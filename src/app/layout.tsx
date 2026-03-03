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
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5677105863319473"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
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
      </body>
    </html>
  );
}
