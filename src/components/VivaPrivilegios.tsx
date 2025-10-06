"use client";

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function VivaPrivilegios() {
  const logo = PlaceHolderImages.find(p => p.id === 'viva-privilegios-logo');

  return (
    <div className="mt-8 bg-primary text-primary-foreground p-4 rounded-lg shadow-lg">
      <div className="text-center">
        {logo && (
          <Image
            src={logo.imageUrl}
            alt={logo.description}
            width={100}
            height={27}
            className="mx-auto mb-3 object-contain"
            data-ai-hint={logo.imageHint}
          />
        )}
        <h2 className="text-lg font-bold mb-2 font-headline">Viva Privilégios</h2>
        <p className="text-xs text-left">
          Viva Privilégios, um programa que enriquece sua vida com acesso à saúde, alimentação, transporte e mais. Com cada compra, acumule pontos para trocar por consultas médicas, receber cashback, e utilizar serviços de telefonia e apps de transporte e alimentação. Eleve sua qualidade de vida e desfrute de mais conveniência e economia!
        </p>
      </div>
    </div>
  );
}
