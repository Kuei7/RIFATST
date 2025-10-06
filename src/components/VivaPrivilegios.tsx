"use client";

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function VivaPrivilegios() {
  const logo = PlaceHolderImages.find(p => p.id === 'viva-privilegios-logo');

  return (
    <div className="mt-8 bg-primary text-primary-foreground p-6 rounded-lg shadow-lg">
      <div className="text-center">
        {logo && (
          <Image
            src={logo.imageUrl}
            alt={logo.description}
            width={150}
            height={40}
            className="mx-auto mb-4 object-contain"
            data-ai-hint={logo.imageHint}
          />
        )}
        <h2 className="text-xl font-bold mb-2 font-headline">Viva Privilégios</h2>
        <p className="text-sm text-left">
          Viva Privilégios, um programa que enriquece sua vida com acesso à saúde, alimentação, transporte e mais. Com cada compra, acumule pontos para trocar por consultas médicas, receber cashback, e utilizar serviços de telefonia e apps de transporte e alimentação. Eleve sua qualidade de vida e desfrute de mais conveniência e economia!
        </p>
      </div>
    </div>
  );
}
