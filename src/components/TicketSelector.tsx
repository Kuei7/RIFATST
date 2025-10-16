
"use client";

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, Star, ShoppingCart, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useParadisePag } from '@/components/ParadisePagCheckout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';


type TicketOption = {
  id: number;
  tickets: number;
  price: number;
  offerHash: string;
  isPopular?: boolean;
};

const ticketOptions: TicketOption[] = [
    { id: 1, tickets: 300, price: 9.90, offerHash: 'COLOQUE_O_HASH_AQUI' },
    { id: 2, tickets: 600, price: 19.85, offerHash: 'or7s9g2c33' },
    { id: 3, tickets: 1000, price: 29.70, offerHash: 'COLOQUE_O_HASH_AQUI' },
    { id: 4, tickets: 3000, price: 39.60, offerHash: 'COLOQUE_O_HASH_AQUI' },
    { id: 5, tickets: 5000, price: 69.30, isPopular: true, offerHash: 'COLOQUE_O_HASH_AQUI' },
    { id: 6, tickets: 10000, price: 99.00, offerHash: 'COLOQUE_O_HASH_AQUI' },
    { id: 7, tickets: 20000, price: 198.00, offerHash: 'COLOQUE_O_HASH_AQUI' },
    { id: 8, tickets: 50000, price: 495.00, offerHash: 'COLOQUE_O_HASH_AQUI' },
];

const MAX_TICKETS = 50000;

export function TicketSelector() {
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(5); // Default to popular
  const [quantity, setQuantity] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const { createCheckout } = useParadisePag();

  const selectedOption = useMemo(
    () => ticketOptions.find(opt => opt.id === selectedOptionId),
    [selectedOptionId]
  );
  
  const currentTotalTickets = useMemo(() => {
    if (!selectedOption) return 0;
    return selectedOption.tickets * quantity;
  }, [selectedOption, quantity]);


  const totalPrice = useMemo(() => {
    if (!selectedOption) return 0;
    return selectedOption.price * quantity;
  }, [selectedOption, quantity]);
  
  const handleQuantityChange = (amount: number) => {
    setQuantity(prev => {
        const newQuantity = prev + amount;
        if (!selectedOption || newQuantity < 1) return 1;

        const newTotalTickets = selectedOption.tickets * newQuantity;
        if (newTotalTickets > MAX_TICKETS) {
            // Adjust quantity to not exceed max tickets
            return Math.floor(MAX_TICKETS / selectedOption.tickets);
        }
        return newQuantity;
    });
  };

  const isMaxTicketsReached = useMemo(() => {
    if (!selectedOption) return false;
    // Check if adding one more set of tickets would exceed the limit
    return selectedOption.tickets * (quantity + 1) > MAX_TICKETS;
  }, [selectedOption, quantity]);
  
  const handlePurchase = async () => {
    if (!selectedOption || !phoneNumber) return;

    // Disable exit intent popup once purchase is initiated
    sessionStorage.setItem('exitIntentShown', 'true');

    const checkoutData = {
      amount: Math.round(totalPrice * 100), // convert to cents and round
      offerHash: selectedOption.offerHash,
      customer: {
        phone_number: phoneNumber,
      }
    };
    
    await createCheckout(checkoutData);
  };

  return (
    
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
          
          <div className="mb-4 text-black">
              <p className="text-center font-bold text-sm mb-2">🔥 89% das cotas vendidas!</p>
              <Progress value={89} className="h-3 [&>div]:bg-orange-500" />
          </div>


          <div className="grid grid-cols-2 gap-3 mb-4">
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
                {currentTotalTickets}
              </span>
              <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(1)} disabled={isMaxTicketsReached} className="text-primary-foreground hover:bg-primary/80">
                <Plus className="h-6 w-6" />
              </Button>
          </div>
          
          <div className="mb-4">
            <Label htmlFor="phone" className="text-black text-sm font-bold mb-2 flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Seu Telefone (WhatsApp):
            </Label>
            <Input 
              id="phone"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="(00) 90000-0000"
              className="bg-gray-100 border-gray-300 text-black"
            />
            <p className="text-xs text-gray-500 mt-1">Será utilizado para entrarmos em contato caso você ganhe.</p>
          </div>

          <div className="text-center text-black mb-4">
            <p className="text-sm">Valor total:</p>
            <p className="font-bold text-3xl">
                {totalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </div>

          <Button id="comprar-titulos-btn" size="lg" className="w-full h-14 text-xl font-bold bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg uppercase" disabled={!selectedOption || !phoneNumber} onClick={handlePurchase}>
            <ShoppingCart className="mr-2 h-6 w-6" />
            Comprar Títulos
          </Button>
          <p className="text-center text-xs mt-4 text-black">Comprar mais títulos aumenta suas chances de ganhar!</p>
        </CardContent>
      </Card>
    
  );
}
