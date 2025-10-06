"use client";

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, Minus, Ticket, Star, Trophy, Gift, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast"

type TicketOption = {
  id: number;
  tickets: number;
  price: number;
  icon: React.ElementType;
  bonus?: string;
};

const ticketOptions: TicketOption[] = [
  { id: 1, tickets: 20, price: 10, icon: Ticket },
  { id: 2, tickets: 30, price: 15, icon: Star },
  { id: 3, tickets: 40, price: 20, icon: Gift },
  { id: 4, tickets: 70, price: 30, icon: Trophy, bonus: "MAIS POPULAR" },
  { id: 5, tickets: 100, price: 40, icon: Ticket },
  { id: 6, tickets: 200, price: 50, icon: Star },
];

export function TicketSelector() {
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(4);
  const [quantity, setQuantity] = useState(1);
  const [doubleChance, setDoubleChance] = useState(false);
  const { toast } = useToast()

  const selectedOption = useMemo(
    () => ticketOptions.find(opt => opt.id === selectedOptionId),
    [selectedOptionId]
  );

  const totalPrice = useMemo(() => {
    if (!selectedOption) return 0;
    const basePrice = selectedOption.price * quantity;
    return doubleChance ? basePrice * 2 : basePrice;
  }, [selectedOption, quantity, doubleChance]);

  const handleQuantityChange = (amount: number) => {
    setQuantity(prev => Math.max(1, prev + amount));
  };
  
  const handlePurchase = () => {
      toast({
        title: "Compra Confirmada!",
        description: `Você comprou ${quantity}x pacote(s) de ${selectedOption?.tickets} bilhetes. Boa sorte!`,
      })
  }

  return (
    <Card className="shadow-lg">
      <CardContent className="p-6">
        <h2 className="text-xl md:text-2xl font-headline font-bold text-center mb-6 text-primary">Escolha quantos números da sorte você quer</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          {ticketOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setSelectedOptionId(option.id)}
              className={cn(
                "relative text-center p-4 rounded-lg border-2 transition-all duration-200 transform hover:scale-105",
                selectedOptionId === option.id
                  ? 'border-primary bg-primary/10 ring-2 ring-primary'
                  : 'border-border bg-card hover:border-primary/50'
              )}
            >
              {option.bonus && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground font-bold">{option.bonus}</Badge>
              )}
              <option.icon className="mx-auto h-8 w-8 text-primary mb-2" />
              <p className="font-bold font-headline text-lg">+{option.tickets}</p>
              <p className="text-xs text-muted-foreground">NÚMEROS DA SORTE</p>
              <p className="font-bold mt-2">R$ {option.price.toFixed(2).replace('.', ',')}</p>
            </button>
          ))}
        </div>

        <Separator className="my-6" />

        <div className="flex items-center justify-between mb-6 bg-primary/5 p-4 rounded-lg">
          <Label htmlFor="double-chance" className="flex flex-col">
            <span className="font-bold text-base text-primary">Chance em Dobro</span>
            <span className="text-sm text-muted-foreground">Dobre seus números da sorte!</span>
          </Label>
          <Switch id="double-chance" checked={doubleChance} onCheckedChange={setDoubleChance} />
        </div>

        <div className="flex items-center justify-between mb-8">
          <p className="font-bold text-lg font-headline">Quantidade</p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>
              <Minus className="h-4 w-4" />
            </Button>
            <span className="text-xl font-bold w-10 text-center">{quantity}</span>
            <Button variant="outline" size="icon" onClick={() => handleQuantityChange(1)}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="text-center mb-6">
          <p className="text-muted-foreground">Total</p>
          <p className="text-4xl font-bold font-headline text-primary">
            R$ {totalPrice.toFixed(2).replace('.', ',')}
          </p>
        </div>

        <Button size="lg" className="w-full h-14 text-xl font-bold bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg" onClick={handlePurchase} disabled={!selectedOption}>
          <ShoppingCart className="mr-2 h-6 w-6" />
          Comprar
        </Button>
      </CardContent>
    </Card>
  );
}
