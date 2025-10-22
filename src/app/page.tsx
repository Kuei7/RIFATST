"use client";

import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TicketSelector } from '@/components/TicketSelector';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { VivaPrivilegios } from '@/components/VivaPrivilegios';
import { PrizeList } from '@/components/PrizeList';
import { ExitIntentPopup } from '@/components/ExitIntentPopup';
import { ClientProviders } from '@/components/ClientProviders';

function MainContent() {
  return (
    <>
      <ExitIntentPopup />
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-grow">
          <div className="bg-primary py-4 md:py-6">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                {PlaceHolderImages.find(p => p.id === 'vivasorte-banner') && (
                  <div className="rounded-lg overflow-hidden shadow-2xl relative">
                    <Image
                      src={PlaceHolderImages.find(p => p.id === 'vivasorte-banner')!.imageUrl}
                      alt={PlaceHolderImages.find(p => p.id === 'vivasorte-banner')!.description}
                      width={900}
                      height={506}
                      className="w-full object-cover"
                      data-ai-hint={PlaceHolderImages.find(p => p.id === 'vivasorte-banner')!.imageHint}
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
  );
}


export default function HomePage() {
  return (
    <ClientProviders>
        <MainContent />
    </ClientProviders>
  );
}
