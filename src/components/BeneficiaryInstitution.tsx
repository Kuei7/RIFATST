"use client";

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function BeneficiaryInstitution() {
  const logo = PlaceHolderImages.find(p => p.id === 'hospital-cancer-londrina-logo');

  return (
    <div className="mt-8 bg-orange-500 text-white p-6 rounded-lg shadow-lg">
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
        <h2 className="text-xl font-bold mb-2 font-headline">Instituição beneficiada</h2>
        <p className="text-xs text-left">
          O Hospital do Câncer de Londrina, fundado em 08 de novembro de 1965 por Lucilla Pinto Ballalai, foi originalmente chamado Centro Norte Paranaense de Pesquisas Médicas. Criado com o objetivo de melhorar o tratamento do câncer e a qualidade de vida, o hospital focava inicialmente na prevenção do câncer de colo de útero entre as mulheres de Londrina e região. A instituição sempre buscou aprimorar seus recursos humanos, científicos e tecnológicos.
        </p>
      </div>
    </div>
  );
}
