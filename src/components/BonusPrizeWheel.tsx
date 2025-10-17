
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import confetti from 'canvas-confetti';
import { useRouter } from 'next/navigation';
import { Gift } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useParadisePag } from './ParadisePagCheckout';

const prizes = [
    { text: 'DOBRO DE COTAS', type: 'win' }, // Target prize
    { text: 'NADA', type: 'lose' },
    { text: 'NADA', type: 'lose' },
    { text: 'NADA', type: 'lose' },
    { text: 'NADA', type: 'lose' },
    { text: 'NADA', type: 'lose' },
    { text: 'NADA', type: 'lose' },
    { text: 'NADA', type: 'lose' },
];
const segmentAngle = 360 / prizes.length;

export function BonusPrizeWheel({ ticketsBought }: { ticketsBought: number }) {
  const router = useRouter();
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [selectedPrize, setSelectedPrize] = useState({ text: '', type: '' });
  const { createCheckout, isLoading } = useParadisePag();

  const onSpinComplete = () => {
    // Navigate to a relevant page or just close the modal. For now, let's go home.
    router.push('/');
  }

  const triggerConfetti = () => {
    let params = {
  		particleCount: 500,
  		spread: 90,
  		startVelocity: 70,
  		origin: { x: 0, y: 0.5 },
  		angle: 45,
        zIndex: 9999
  	};

  	// Joga confetes da esquerda pra direita
  	confetti(params);

  	// Joga confetes da direita para a esquerda
  	params.origin.x = 1;
  	params.angle = 135;
  	confetti(params);
  };

  const spinWheel = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setShowResult(false);
    
    const totalSpins = 5;
    
    // The index for "DOBRO DE COTAS" is 0
    const targetPrizeIndex = 0; 
    
    const targetSegmentCenterAngle = (targetPrizeIndex * segmentAngle) + (segmentAngle / 2);
    const stopAngle = 270 - targetSegmentCenterAngle;
    const randomOffset = (Math.random() - 0.5) * (segmentAngle * 0.4);
    const newRotation = (totalSpins * 360) + stopAngle - randomOffset;
    
    setRotation(newRotation);

    const spinDuration = 4000;

    setTimeout(() => {
      setIsSpinning(false);
      
      const winningPrize = prizes[targetPrizeIndex];

      setSelectedPrize({ text: winningPrize.text, type: winningPrize.type });
      setShowResult(true);

      if (winningPrize.type === 'win') {
        triggerConfetti();
      }

    }, spinDuration);
  };

  const handleUpsellPurchase = async () => {
    // Disable exit intent popup once purchase is initiated
    sessionStorage.setItem('exitIntentShown', 'true');

    const checkoutData = {
      amount: Math.round(19.90 * 100), // R$19,90 in cents
      offerHash: 'or7s9g2c33', // Specific hash for the upsell offer
      customer: {}, // Customer data can be pre-filled if available, but the server action can generate it.
      tickets: ticketsBought, // We pass the original number of tickets to potentially double it later
    };
    
    await createCheckout(checkoutData);
  }
  
  return (
    <div className="bg-card text-card-foreground p-6 rounded-lg shadow-lg flex flex-col items-center max-w-md w-full">
      <h2 className="text-2xl font-bold font-headline mb-6 text-gray-800">Gire para Dobrar suas Cotas!</h2>
      <div className="relative w-80 h-80 md:w-96 md:h-96 flex items-center justify-center mb-6">
        
        {/* Pointer */}
        <div 
          className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4 w-0 h-0 z-20"
          style={{
            borderLeft: '12px solid transparent',
            borderRight: '12px solid transparent',
            borderTop: '20px solid #ca8a04', // golden color
          }}
        >
          <div className="absolute -top-5 -left-1.5 w-3 h-3 bg-yellow-300 rounded-full"></div>
        </div>

        {/* Wheel */}
        <div 
          className="relative w-full h-full rounded-full border-8 border-blue-500 overflow-hidden shadow-2xl"
          style={{ transition: 'transform 4s cubic-bezier(0.25, 0.1, 0.25, 1)', transform: `rotate(${rotation}deg)` }}
        >
          <svg viewBox="0 0 200 200" className="absolute w-full h-full">
            {prizes.map((prize, index) => {
              const startAngle = segmentAngle * index;
              
              const isBlue = index % 2 === 0;
              const pathD = `M100,100 L${100 + 100 * Math.cos(startAngle * Math.PI/180)},${100 + 100 * Math.sin(startAngle*Math.PI/180)} A100,100 0 0,1 ${100 + 100 * Math.cos((startAngle + segmentAngle) * Math.PI/180)},${100 + 100 * Math.sin((startAngle + segmentAngle)*Math.PI/180)} Z`;

              const textAngle = startAngle + segmentAngle / 2;
              const textRad = textAngle * Math.PI / 180;
              const textX = 100 + 65 * Math.cos(textRad);
              const textY = 100 + 65 * Math.sin(textRad);

              return (
                <g key={index}>
                  <path d={pathD} fill={isBlue ? '#4299e1' : '#ffffff'} />
                   <text
                    x={textX}
                    y={textY}
                    transform={`rotate(${textAngle + 90}, ${textX}, ${textY})`}
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    fill={isBlue ? 'white' : '#333'}
                    fontSize="10"
                    fontWeight="bold"
                  >
                    {prize.text}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
        
        {/* Center Pin */}
        <div className="absolute w-16 h-16 bg-gradient-to-tr from-blue-300 to-blue-500 rounded-full z-10 border-4 border-blue-200 shadow-inner flex items-center justify-center">
           <div className="w-8 h-8 bg-gradient-to-bl from-blue-300 to-blue-500 rounded-full border-2 border-blue-200"></div>
        </div>
      </div>
      
      {!showResult && (
        <Button 
          onClick={spinWheel} 
          disabled={isSpinning}
          className="w-full max-w-xs h-12 text-xl font-bold bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg uppercase tracking-wider"
        >
          {isSpinning ? 'Girando...' : 'GIRAR'}
        </Button>
      )}

      {showResult && selectedPrize.type === 'win' && (
        <div className={cn(
          "relative w-full mt-6 p-6 bg-white rounded-2xl text-gray-900 text-center flex flex-col items-center gap-4 shadow-2xl",
          "animate-pulse-bright"
        )}>
          <Gift className="h-20 w-20 text-yellow-500" />
          <p className="font-bold text-2xl">Parabéns! Você desbloqueou uma oferta exclusiva!</p>
          <p className="text-base text-gray-600">
            Por apenas <strong className="text-primary">R$19,90</strong>, você pode dobrar as cotas que acabou de comprar e ganhar mais{' '}
            <strong className="text-primary">{ticketsBought.toLocaleString('pt-BR')} cotas!</strong>
          </p>
          <div className="flex flex-col gap-3 w-full mt-4">
             <Button 
                onClick={handleUpsellPurchase} 
                disabled={isLoading}
                className="w-full h-14 bg-accent hover:bg-accent/90 text-accent-foreground font-bold uppercase text-xl shadow-lg"
             >
                {isLoading ? "Processando..." : "QUERO DOBRAR MINHAS COTAS!"}
            </Button>
            <Button 
                onClick={onSpinComplete} 
                variant="ghost" 
                className="w-full text-gray-500 hover:text-gray-700"
            >
                Não, obrigado
            </Button>
          </div>
        </div>
      )}
       {showResult && selectedPrize.type === 'lose' && (
        <div className="mt-6 p-4 bg-red-100 border-2 border-red-500 rounded-lg text-center w-full">
          <p className="text-red-800 font-bold text-lg">Não foi dessa vez!</p>
          <p className="text-red-900 font-extrabold text-2xl">{selectedPrize.text}</p>
           <Button onClick={onSpinComplete} className="mt-4 bg-gray-500 hover:bg-gray-600 text-white font-bold uppercase">
            Continuar
          </Button>
        </div>
      )}
    </div>
  );
}

    