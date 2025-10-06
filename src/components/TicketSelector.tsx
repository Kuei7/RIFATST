"use client";

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, Star, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import ParadisePagCheckout, { useParadisePag } from '@/components/ParadisePagCheckout';

type TicketOption = {
  id: number;
  tickets: number;
  price: number;
  offerHash: string;
  isPopular?: boolean;
};

const ticketOptions: TicketOption[] = [
    { id: 1, tickets: 20, price: 19.85, offerHash: 'or7s9g2c33' },
    { id: 2, tickets: 30, price: 29.70, offerHash: 'COLOQUE_O_HASH_AQUI' },
    { id: 3, tickets: 40, price: 39.60, offerHash: 'COLOQUE_O_HASH_AQUI' },
    { id: 4, tickets: 70, price: 69.30, isPopular: true, offerHash: 'COLOQUE_O_HASH_AQUI' },
    { id: 5, tickets: 100, price: 99.00, offerHash: 'COLOQUE_O_HASH_AQUI' },
    { id: 6, tickets: 200, price: 198.00, offerHash: 'COLOQUE_O_HASH_AQUI' },
];

export function TicketSelector() {
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(4); // Default to popular
  const [quantity, setQuantity] = useState(1);
  const { createCheckout } = useParadisePag();

  const selectedOption = useMemo(
    () => ticketOptions.find(opt => opt.id === selectedOptionId),
    [selectedOptionId]
  );

  const totalPrice = useMemo(() => {
    if (!selectedOption) return 0;
    return selectedOption.price * quantity;
  }, [selectedOption, quantity]);
  
  const handleQuantityChange = (amount: number) => {
    setQuantity(prev => Math.max(1, prev + amount));
  };
  
  const handlePurchase = async () => {
    if (!selectedOption) return;

    const checkoutData = {
      amount: totalPrice * 100, // convert to cents
      offerHash: selectedOption.offerHash,
    };
    
    await createCheckout(checkoutData);
  };

  return (
    <>
      <Card className="shadow-lg bg-card border-0 rounded-lg text-card-foreground">
        <CardContent className="p-4 bg-white">
          <div className="text-center mb-4">
              <div className="text-sm text-black flex items-center justify-center gap-2">
                  Sorteio 
                  <Badge className="bg-orange-500 text-white font-bold">HOJE</Badge> 
                  por apenas 
                  <Badge className="bg-primary text-primary-foreground font-bold">R$0,99</Badge>
              </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4">
            {ticketOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => {
                  setSelectedOptionId(option.id);
                  setQuantity(1); // Reset quantity when changing option
                }}
                className={cn(
                  "relative text-center p-3 rounded-md border-2 transition-all duration-200 transform hover:scale-105 text-white",
                  selectedOptionId === option.id
                    ? 'border-accent bg-accent'
                    : 'bg-primary border-primary'
                )}
              >
                {option.isPopular && (
                  <Star className="absolute top-1 right-1 h-4 w-4 text-yellow-400 fill-yellow-400" />
                )}
                <p className="font-headline font-black text-2xl">+{option.tickets}</p>
                <p className="text-xs">R${option.price.toFixed(2).replace('.', ',')}</p>
                <p className="font-bold text-xs mt-1">SELECIONAR</p>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between bg-primary rounded-md p-1 mb-4">
              <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1} className="text-primary-foreground hover:bg-primary/80">
                <Minus className="h-6 w-6" />
              </Button>
              <span className="text-xl font-bold text-center text-primary-foreground">
                {selectedOption ? (selectedOption.tickets * quantity) : 0}
              </span>
              <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(1)} className="text-primary-foreground hover:bg-primary/80">
                <Plus className="h-6 w-6" />
              </Button>
          </div>

          <Button id="comprar-titulos-btn" size="lg" className="w-full h-14 text-xl font-bold bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg uppercase" disabled={!selectedOption} onClick={handlePurchase}>
            <ShoppingCart className="mr-2 h-6 w-6" />
            Comprar Títulos
          </Button>
          <p className="text-center text-xs mt-4 text-black">Comprar mais títulos aumenta suas chances de ganhar!</p>
        </CardContent>
      </Card>
    </>
  );
}
