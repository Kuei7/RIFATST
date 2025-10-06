import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function Header() {
  const logoImage = PlaceHolderImages.find(p => p.id === 'vivasorte-logo');

  return (
    <header className="bg-card shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-start items-center h-16">
          <Link href="/">
            {logoImage ? (
              <Image
                src={logoImage.imageUrl}
                alt={logoImage.description}
                width={150}
                height={40}
                className="object-contain"
                data-ai-hint={logoImage.imageHint}
                priority
              />
            ) : (
                <span className="text-2xl font-bold text-primary-foreground font-headline">Viva Sorte</span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
