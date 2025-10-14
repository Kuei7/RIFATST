"use client";

import { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

export function OfferCountdown() {
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds

  useEffect(() => {
    if (timeLeft === 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prevTime => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  return (
    <div className="fixed top-0 left-0 w-full z-50">
      <div className="bg-red-600 text-white p-2 text-center shadow-lg flex items-center justify-center gap-4 animate-pulse">
        <AlertCircle className="h-6 w-6" />
        <div className='flex items-center gap-2'>
            {timeLeft > 0 ? (
                <>
                <p className="font-bold text-sm md:text-base">Oferta especial termina em:</p>
                <p className="font-mono text-base md:text-lg font-black tracking-wider">{formatTime(timeLeft)}</p>
                </>
            ) : (
                <p className="font-black text-base md:text-lg uppercase">Últimos Segundos!</p>
            )}
        </div>
      </div>
    </div>
  );
}
