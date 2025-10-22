import type { Metadata } from 'next';
import Script from 'next/script';
import { Toaster } from '@/components/ui/toaster';
import { ParadisePagProvider } from '@/components/ParadisePagCheckout';
import './globals.css';


export const metadata: Metadata = {
  title: 'Viva Sorte',
  description: 'Sua chance de ganhar!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@700;900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap" rel="stylesheet" />
        <Script
          src="https://cdn.utmify.com.br/scripts/utms/latest.js"
          data-utmify-prevent-xcod-sck
          data-utmify-prevent-subids
          async
          defer
        ></Script>
        <Script id="utmify-pixel" strategy="afterInteractive">
          {`
<<<<<<< HEAD
            window.pixelId = "68f8532520988b17653585d5";
=======
            window.pixelId = "68f82d9386051ff8a9247775";
>>>>>>> d629f005b8094ad4f4fec95b3bdb37ad65b2ed3b
            var a = document.createElement("script");
            a.setAttribute("async", "");
            a.setAttribute("defer", "");
            a.setAttribute("src", "https://cdn.utmify.com.br/scripts/pixel/pixel.js");
            document.head.appendChild(a);
          `}
        </Script>
      </head>
      <body className="font-body antialiased">
        <ParadisePagProvider>
          {children}
        </ParadisePagProvider>
        <Toaster />
      </body>
    </html>
  );
}
