
"use client";

import { useState, useEffect } from 'react';
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PrizeWheel } from "@/components/PrizeWheel";

export default function RoletaPage() {
  const [totalTickets, setTotalTickets] = useState(0);

  useEffect(() => {
    // On page load, get the total tickets from sessionStorage
    const savedTickets = sessionStorage.getItem('totalTickets');
    if (savedTickets) {
      setTotalTickets(Number(savedTickets));
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center bg-gray-100 p-4">
        <div className="text-center mb-8 max-w-2xl bg-white p-8 rounded-xl shadow-lg">
          <h1 className="text-4xl font-black text-primary font-headline tracking-tight">
            Parabéns! Seus {totalTickets > 0 ? totalTickets.toLocaleString('pt-BR') : ''} números da sorte foram computados.
          </h1>
          <p className="text-base text-gray-600 mt-4 max-w-lg mx-auto">
            Agora, aproveite seu giro grátis na Roleta da Sorte! Fique de olho no seu WhatsApp, entraremos em contato por lá caso você seja o ganhador.
          </p>
        </div>
        <PrizeWheel />
      </main>
      <Footer />
    </div>
  );
}
