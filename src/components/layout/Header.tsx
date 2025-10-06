import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function Header() {
  const logoImage = PlaceHolderImages.find(p => p.id === 'luckylife-logo');

  return (
    <header className="bg-primary shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center h-20">
          <Link href="/">
            {logoImage ? (
              <Image
                src={logoImage.imageUrl}
                alt={logoImage.description}
                width={180}
                height={50}
                className="object-contain"
                data-ai-hint={logoImage.imageHint}
                priority
              />
            ) : (
                <span className="text-2xl font-bold text-primary-foreground font-headline">LuckyLife</span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
