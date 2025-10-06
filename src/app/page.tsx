import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TicketSelector } from '@/components/TicketSelector';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  const bannerImage = PlaceHolderImages.find(p => p.id === 'vivasorte-banner');

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-6 md:py-10">
        <div className="max-w-2xl mx-auto">
          {bannerImage && (
            <div className="mb-4 rounded-lg overflow-hidden shadow-2xl relative">
              <Image
                src={bannerImage.imageUrl}
                alt={bannerImage.description}
                width={800}
                height={450}
                className="w-full object-cover"
                data-ai-hint={bannerImage.imageHint}
                priority
              />
               <div className="absolute top-4 right-4 bg-accent text-accent-foreground px-4 py-1 rounded-md text-sm font-bold">
                Site Oficial
              </div>
            </div>
          )}
          <TicketSelector />
        </div>
      </main>
      <Footer />
    </div>
  );
}
