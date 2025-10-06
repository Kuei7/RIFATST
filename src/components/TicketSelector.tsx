"use client";

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, Star, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast"

type TicketOption = {
  id: number;
  tickets: number;
  price: number;
  isPopular?: boolean;
};

const ticketOptions: TicketOption[] = [
  { id: 1, tickets: 20, price: 19.85 },
  { id: 2, tickets: 30, price: 29.70 },
  { id: 3, tickets: 40, price: 39.60 },
  { id: 4, tickets: 70, price: 69.30, isPopular: true },
  { id: 5, tickets: 100, price: 99.00 },
  { id: 6, tickets: 200, price: 198.00 },
];

export function TicketSelector() {
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(3);
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast()

  const selectedOption = useMemo(
    () => ticketOptions.find(opt => opt.id === selectedOptionId),
    [selectedOptionId]
  );
  
  const handlePurchase = () => {
      toast({
        title: "Compra Confirmada!",
        description: `Você comprou ${quantity}x pacote(s) de ${selectedOption?.tickets} bilhetes. Boa sorte!`,
      })
  }

  const handleQuantityChange = (amount: number) => {
    setQuantity(prev => Math.max(1, prev + amount));
  };


  return (
    <Card className="shadow-lg bg-card border-0 rounded-lg text-card-foreground">
      <CardContent className="p-4 bg-white">
        <div className="text-center mb-4">
          <p className="text-sm text-black">
            Sorteio <Badge className="bg-yellow-400 text-black font-bold">HOJE</Badge> por apenas <span className="font-bold">R$0,99</span>
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          {ticketOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setSelectedOptionId(option.id)}
              className={cn(
                "relative text-center p-3 rounded-md border-2 transition-all duration-200 transform hover:scale-105 text-primary-foreground",
                selectedOptionId === option.id
                  ? 'border-accent bg-accent text-accent-foreground'
                  : 'bg-primary border-primary',
                option.id === 3 && selectedOptionId !== 3 ? 'bg-accent border-accent text-accent-foreground' : ''
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
              {selectedOption?.tickets ? selectedOption.tickets * quantity : 0}
            </span>
            <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(1)} className="text-primary-foreground hover:bg-primary/80">
              <Plus className="h-6 w-6" />
            </Button>
        </div>

        <Button size="lg" className="w-full h-14 text-xl font-bold bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg uppercase" onClick={handlePurchase} disabled={!selectedOption}>
          <ShoppingCart className="mr-2 h-6 w-6" />
          Comprar Títulos
        </Button>
        <p className="text-center text-xs mt-4 text-muted-foreground">Comprar mais títulos aumenta suas chances de ganhar!</p>
      </CardContent>
    </Card>
  );
}
