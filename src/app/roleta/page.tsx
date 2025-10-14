"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PrizeWheel } from "@/components/PrizeWheel";

export default function RoletaPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center bg-gray-100 p-4">
        <div className="text-center mb-8 max-w-lg">
          <h1 className="text-2xl font-bold text-gray-800 font-headline">Parabéns! Seus números da sorte foram gerados.</h1>
          <p className="text-base text-gray-600 mt-2">
            Agora, aproveite seu giro grátis na Roleta da Sorte! Fique de olho no seu WhatsApp, entraremos em contato por lá caso você seja o ganhador.
          </p>
        </div>
        <PrizeWheel />
      </main>
      <Footer />
    </div>
  );
}
