import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Instagram, Facebook, Twitter, Youtube } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Separator } from '@/components/ui/separator';

export function Footer() {
  const vivaSorteLogo = PlaceHolderImages.find(p => p.id === 'vivasorte-logo');
  const viaCapLogo = PlaceHolderImages.find(p => p.id === 'viacap-logo');
  const vivaPrivilegiosLogo = PlaceHolderImages.find(p => p.id === 'viva-privilegios-logo');
  const edjDigitalLogo = PlaceHolderImages.find(p => p.id === 'edjdigital-logo');

  return (
    <footer className="bg-card text-card-foreground py-8">
      <div className="container mx-auto px-4 text-center">
        <div className="flex flex-col items-center gap-6">
          {vivaSorteLogo && (
            <Image
              src={vivaSorteLogo.imageUrl}
              alt={vivaSorteLogo.description}
              width={180}
              height={45}
              className="object-contain"
              data-ai-hint={vivaSorteLogo.imageHint}
            />
          )}

          <div className="flex gap-4">
            <Link href="#" className="text-primary hover:text-primary/80">
              <Instagram size={24} />
            </Link>
            <Link href="#" className="text-primary hover:text-primary/80">
              <Facebook size={24} />
            </Link>
            <Link href="#" className="text-primary hover:text-primary/80">
              <Twitter size={24} />
            </Link>
            <Link href="#" className="text-primary hover:text-primary/80">
              <Youtube size={24} />
            </Link>
          </div>

          <p className="text-xs text-muted-foreground max-w-2xl">
            Sorteios lastreados por Títulos de Capitalização, da Modalidade Incentivo, emitidos pela VIA Capitalização S.A, inscrita no CNPJ sob nº 88.076.302/0001-94, e aprovados pela SUSEP através do registro na SUSEP Sorteio nº 15414.652257/2023-51. O valor das premiações aqui indicados são líquidos, já descontado o devido imposto de renda de 25%. O registro deste plano na SUSEP não implica, por parte da Autarquia, incentivo ou recomendação a sua comercialização.
          </p>

          <Separator className="my-4" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl text-left">
            <div className="flex flex-col items-center md:items-start">
              <p className="text-sm font-semibold mb-2">Títulos emitidos por:</p>
              {viaCapLogo && (
                <Image
                  src={viaCapLogo.imageUrl}
                  alt={viaCapLogo.description}
                  width={100}
                  height={30}
                  className="object-contain"
                  data-ai-hint={viaCapLogo.imageHint}
                />
              )}
            </div>
            <div className="flex flex-col items-center md:items-start">
              <p className="text-sm font-semibold mb-2">Promoção realizada por:</p>
              {vivaPrivilegiosLogo && (
                <Image
                  src={vivaPrivilegiosLogo.imageUrl}
                  alt={vivaPrivilegiosLogo.description}
                  width={120}
                  height={40}
                  className="object-contain"
                  data-ai-hint={vivaPrivilegiosLogo.imageHint}
                />
              )}
            </div>
            <div className="flex flex-col items-center md:items-start">
              <p className="text-sm font-semibold mb-2">Desenvolvimento:</p>
              {edjDigitalLogo && (
                <Image
                  src={edjDigitalLogo.imageUrl}
                  alt={edjDigitalLogo.description}
                  width={150}
                  height={30}
                  className="object-contain"
                  data-ai-hint={edjDigitalLogo.imageHint}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
