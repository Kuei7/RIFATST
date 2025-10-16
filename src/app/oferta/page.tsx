
"use client";

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TicketSelector } from '@/components/TicketSelector';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { VivaPrivilegios } from '@/components/VivaPrivilegios';
import { PrizeList } from '@/components/PrizeList';
import { OfferCountdown } from '@/components/OfferCountdown';
import { ParadisePagProvider } from '@/components/ParadisePagCheckout';


function OfertaContent() {
  const bannerImage = PlaceHolderImages.find(p => p.id === 'vivasorte-banner');
  return (
    <>
      <OfferCountdown />
      <div className="flex flex-col min-h-screen bg-background pt-12">
        <Header />
        <main className="flex-grow">
          <div className="bg-primary py-4 md:py-6">
              <div className="container mx-auto px-4">
                   <div className="max-w-3xl mx-auto">
                      {bannerImage && (
                      <div className="rounded-lg overflow-hidden shadow-2xl relative">
                          <Image
                          src={bannerImage.imageUrl}
                          alt={bannerImage.description}
                          width={900}
                          height={506}
                          className="w-full object-cover"
                          data-ai-hint={bannerImage.imageHint}
                          priority
                          />
                          <div className="absolute top-4 right-4 bg-accent text-accent-foreground px-4 py-1 rounded-md text-sm font-bold">
                          Site Oficial
                          </div>
                      </div>
                      )}
                   </div>
              </div>
          </div>
          <div className="bg-white">
              <div className="container mx-auto px-4 py-4 md:py-8">
                <div className="max-w-2xl mx-auto">
                  <TicketSelector />
                  <PrizeList />
                  <VivaPrivilegios />
                </div>
              </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  )
}


export default function OfertaPage() {
  const router = useRouter();
  const handlePaymentConfirmed = () => {
    router.push('/parabens');
  };

  return (
    <ParadisePagProvider onPaymentConfirm={handlePaymentConfirmed}>
      <OfertaContent />
    </ParadisePagProvider>
  );
}
