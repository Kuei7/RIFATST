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
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-red-600 text-white p-4 rounded-lg shadow-2xl flex items-center gap-3 animate-pulse">
        <AlertCircle className="h-8 w-8" />
        <div className="text-left">
          {timeLeft > 0 ? (
            <>
              <p className="font-bold text-lg">Oferta especial termina em:</p>
              <p className="font-mono text-2xl font-black tracking-wider">{formatTime(timeLeft)}</p>
            </>
          ) : (
            <p className="font-black text-2xl uppercase">Últimos Segundos!</p>
          )}
        </div>
      </div>
    </div>
  );
}
