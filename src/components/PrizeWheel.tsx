
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import confetti from 'canvas-confetti';
import { useRouter } from 'next/navigation';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

// Reordered to match the visual layout of the wheel
const prizes = [
    { text: 'R$ 3.000', type: 'win' },    // blue
    { text: 'NADA', type: 'lose' },     // white
    { text: 'R$ 1.000', type: 'win' },    // blue
    { text: 'NADA', type: 'lose' },     // white
    { text: 'IPHONE 17', type: 'win' },   // blue
    { text: 'NADA', type: 'lose' },     // white
    { text: '60% OFF', type: 'win' },   // blue - TARGET
    { text: 'NADA', type: 'lose' },     // white
];
const segmentAngle = 360 / prizes.length;

export function PrizeWheel() {
  const router = useRouter();
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [selectedPrize, setSelectedPrize] = useState({ text: '', type: '' });
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds

  const onSpinComplete = () => {
    router.push('/oferta');
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
    
    // The index for "60% OFF" is now 6 after reordering
    const targetPrizeIndex = 6; 
    
    // Calculate the exact center angle for the target prize segment
    const targetSegmentCenterAngle = (targetPrizeIndex * segmentAngle) + (segmentAngle / 2);

    // The final rotation should align the pointer (at 270 degrees or -90) with the target angle.
    const stopAngle = 270 - targetSegmentCenterAngle;

    // Add a small random offset within the segment to make it look more natural
    const randomOffset = (Math.random() - 0.5) * (segmentAngle * 0.4);

    const newRotation = (totalSpins * 360) + stopAngle - randomOffset;
    
    setRotation(newRotation);

    // Spin animation time
    const spinDuration = 4000;

    setTimeout(() => {
      setIsSpinning(false);
      
      const winningPrize = prizes[targetPrizeIndex];

      setSelectedPrize({ text: winningPrize.text, type: winningPrize.type });
      setShowResult(true);

      if (winningPrize.text === '60% OFF') {
        triggerConfetti();
      }

    }, spinDuration);
  };

  useEffect(() => {
    if (showResult && selectedPrize.type === 'win') {
      const timer = setInterval(() => {
        setTimeLeft(prevTime => (prevTime > 0 ? prevTime - 1 : 0));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [showResult, selectedPrize]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };
  
  return (
    <div className="bg-card text-card-foreground p-6 rounded-lg shadow-lg flex flex-col items-center max-w-md w-full">
      <h2 className="text-2xl font-bold font-headline mb-6 text-gray-800">Gire e Ganhe Prêmios!</h2>
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

              // Text position
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
          <Image src="https://s3.typebot.io/public/workspaces/cm8gbxl5b000ba3ncy4y16grd/typebots/cmgf6qv060007i604f4na2kac/blocks/ft6w3wvq95uaarwaoxd0vrib?v=1760406740573" alt="Caixa de Presente" width={100} height={100} />
          <p className="font-bold text-2xl">Parabéns! Você ganhou:</p>
          <p className="font-black text-5xl tracking-tighter text-yellow-500 drop-shadow-lg">{selectedPrize.text}</p>
          <div className="flex items-center gap-2 mt-2 bg-red-500 text-white px-4 py-2 rounded-full text-base font-bold animate-pulse">
            <Clock className="h-5 w-5" />
            <span>Sua oferta expira em: <strong>{formatTime(timeLeft)}</strong></span>
          </div>
          <Button onClick={onSpinComplete} disabled={timeLeft === 0} className="mt-4 w-full h-14 bg-accent hover:bg-accent/90 text-accent-foreground font-bold uppercase text-xl shadow-lg">
            {timeLeft > 0 ? 'Resgatar Agora!' : 'Oferta Expirada'}
          </Button>
        </div>
      )}
       {showResult && selectedPrize.type === 'lose' && (
        <div className="mt-6 p-4 bg-red-100 border-2 border-red-500 rounded-lg text-center w-full">
          <p className="text-red-800 font-bold text-lg">Não foi dessa vez!</p>
          <p className="text-red-900 font-extrabold text-2xl">{selectedPrize.text}</p>
           <Button onClick={onSpinComplete} className="mt-4 bg-gray-500 hover:bg-gray-600 text-white font-bold uppercase">
            Voltar
          </Button>
        </div>
      )}
    </div>
  );
}
