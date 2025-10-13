"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Gift } from 'lucide-react';

export function ExitIntentPopup() {
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const handleMouseOut = (event: MouseEvent) => {
      // Verifica se o mouse está saindo pela parte de cima da janela
      if (
        event.clientY <= 0 &&
        !sessionStorage.getItem('exitIntentShown')
      ) {
        setShowPopup(true);
        sessionStorage.setItem('exitIntentShown', 'true');
      }
    };

    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  const handleAccept = () => {
    router.push('/roleta');
  };

  const handleClose = () => {
    setShowPopup(false);
  };

  return (
    <AlertDialog open={showPopup} onOpenChange={setShowPopup}>
      <AlertDialogContent className="bg-white text-gray-900">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-2xl font-bold text-primary">
            <Gift className="h-8 w-8 text-accent" />
            Espere! Você ganhou um giro grátis!
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600">
            Não vá embora ainda! Que tal tentar a sorte na nossa roleta de prêmios? Você pode ganhar descontos incríveis.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleClose} className="bg-gray-200 text-gray-800 hover:bg-gray-300">
            Não, obrigado
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleAccept} className="bg-accent text-accent-foreground hover:bg-accent/90">
            Quero Girar!
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
