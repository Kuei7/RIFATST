"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PrizeWheel } from "@/components/PrizeWheel";

export default function RoletaPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow flex items-center justify-center bg-gray-100 p-4">
        <PrizeWheel />
      </main>
      <Footer />
    </div>
  );
}
