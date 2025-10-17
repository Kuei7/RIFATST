
"use client";

import { useState, useEffect, Suspense } from 'react';
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BonusPrizeWheel } from "@/components/BonusPrizeWheel";
import { ParadisePagProvider } from '@/components/ParadisePagCheckout';
import { useRouter } from 'next/navigation';

function ParabensContent() {
  const [totalTickets, setTotalTickets] = useState(0);

  useEffect(() => {
    const tickets = sessionStorage.getItem('totalTickets');
    setTotalTickets(Number(tickets) || 0);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center bg-gray-100 p-4">
        <div className="text-center mb-8 max-w-2xl bg-white p-8 rounded-xl shadow-lg w-full">
          <h1 className="text-4xl font-black text-primary font-headline tracking-tight">
            Parabéns! Seus {totalTickets > 0 ? totalTickets.toLocaleString('pt-BR') : ''} números da sorte foram computados.
          </h1>
          <p className="text-base text-gray-600 mt-4 max-w-lg mx-auto">
            Agora, aproveite seu giro grátis na Roleta da Sorte para dobrar suas cotas!
          </p>
        </div>
        <div className="w-full max-w-2xl flex justify-center">
           <BonusPrizeWheel ticketsBought={totalTickets} />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function ParabensPage() {
    const router = useRouter();
    const handleUpsellPayment = () => {
        // After the upsell is paid, redirect to the final roleta page
        router.push('/roleta');
    }

  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <ParadisePagProvider onPaymentConfirm={handleUpsellPayment}>
        <ParabensContent />
      </ParadisePagProvider>
    </Suspense>
  );
}
