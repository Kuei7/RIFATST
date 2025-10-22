
"use client";

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, Star, ShoppingCart, Phone, Gift, Share2, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useParadisePag } from '@/components/ParadisePagCheckout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
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
import { useToast } from "@/hooks/use-toast";


type TicketOption = {
  id: number;
  tickets: number;
  price: number;
  originalPrice?: number;
  offerHash: string;
  isPopular?: boolean;
};

const allTicketOptions: TicketOption[] = [
    { id: 1, tickets: 300, price: 9.90, offerHash: 'COLOQUE_O_HASH_AQUI' },
    { id: 2, tickets: 600, price: 19.85, offerHash: 'or7s9g2c33' },
    { id: 3, tickets: 1000, price: 29.70, offerHash: 'COLOQUE_O_HASH_AQUI' },
    { id: 4, tickets: 3000, price: 39.60, offerHash: 'COLOQUE_O_HASH_AQUI' },
    { id: 5, tickets: 5000, price: 69.30, isPopular: true, offerHash: 'COLOQUE_O_HASH_AQUI' },
    { id: 6, tickets: 10000, price: 99.00, offerHash: 'COLOQUE_O_HASH_AQUI' },
    { id: 7, tickets: 20000, price: 198.00, offerHash: 'COLOQUE_O_HASH_AQUI' },
    { id: 8, tickets: 50000, price: 495.00, offerHash: 'COLOQUE_O_HASH_AQUI' },
];

const MAX_PRICE = 499;

const formatPhoneNumber = (value: string) => {
  if (!value) return "";
  value = value.replace(/\D/g, '');
  if (value.length > 11) {
    value = value.substring(0, 11);
  }
  if (value.length > 10) {
    value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
  } else if (value.length > 5) {
    value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
  } else if (value.length > 2) {
    value = value.replace(/^(\d{2})(\d{0,5}).*/, '($1) $2');
  } else {
    value = value.replace(/^(\d*)/, '($1');
  }
  return value;
};


export function TicketSelector({ showShareBox = false, hideFirstOption = false, applyDiscount = false }: { showShareBox?: boolean, hideFirstOption?: boolean, applyDiscount?: boolean }) {
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(hideFirstOption ? 2 : 5);
  const [quantity, setQuantity] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const { createCheckout } = useParadisePag();

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [sharePhoneNumber, setSharePhoneNumber] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const { toast } = useToast();
  
  const ticketOptions = useMemo(() => {
    let options = hideFirstOption ? allTicketOptions.slice(1) : allTicketOptions;
    if (applyDiscount) {
      return options.map(opt => ({
        ...opt,
        originalPrice: opt.price,
        price: opt.price * 0.4, // 60% off
      }));
    }
    return options;
  }, [hideFirstOption, applyDiscount]);

  const selectedOption = useMemo(
    () => ticketOptions.find(opt => opt.id === selectedOptionId),
    [selectedOptionId, ticketOptions]
  );
  
  const totalPrice = useMemo(() => {
    if (!selectedOption) return 0;
    return selectedOption.price * quantity;
  }, [selectedOption, quantity]);
  
  const currentTotalTickets = useMemo(() => {
    if (!selectedOption) return 0;
    return selectedOption.tickets * quantity;
  }, [selectedOption, quantity]);

  const handleQuantityChange = (amount: number) => {
    setQuantity(prev => {
        const newQuantity = prev + amount;
        if (!selectedOption || newQuantity < 1) return 1;

        const newTotalPrice = selectedOption.price * newQuantity;
        if (newTotalPrice > MAX_PRICE) {
            // Adjust quantity to not exceed max price
            return Math.floor(MAX_PRICE / selectedOption.price);
        }
        return newQuantity;
    });
  };

  const isMaxPriceReached = useMemo(() => {
    if (!selectedOption) return false;
    // Check if adding one more set of tickets would exceed the price limit
    return selectedOption.price * (quantity + 1) > MAX_PRICE;
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
      },
      tickets: currentTotalTickets,
    };
    
    await createCheckout(checkoutData);
  };

  const handleGenerateLink = () => {
    if (sharePhoneNumber.trim()) {
      const currentUrl = window.location.origin + window.location.pathname;
      const affiliateLink = `${currentUrl}?affiliate=${sharePhoneNumber.replace(/\D/g, '')}`;
      setGeneratedLink(affiliateLink);
    } else {
      toast({
        variant: "destructive",
        title: "Número inválido",
        description: "Por favor, insira um número de telefone válido.",
      });
    }
  };

  const handleCopyLink = () => {
    if(generatedLink) {
        navigator.clipboard.writeText(generatedLink).then(() => {
            toast({
                title: "Link Copiado!",
                description: "Seu link de compartilhamento foi copiado para a área de transferência.",
            })
        });
    }
  };

  useEffect(() => {
    // When selected option changes, reset quantity and check if the base price exceeds max price
    if (selectedOption) {
        setQuantity(1);
        if (selectedOption.price > MAX_PRICE) {
            const suitableOption = ticketOptions.find(opt => opt.price <= MAX_PRICE);
            if (suitableOption) {
                setSelectedOptionId(suitableOption.id);
            }
        }
    }
  }, [selectedOptionId, selectedOption, ticketOptions]);


  return (
    
      <Card className="shadow-lg bg-card border-0 rounded-lg text-card-foreground">
        <CardContent className="p-4 bg-white">
            {!showShareBox && (
                <>
                    <div className="text-center mb-4">
                        <div className="text-sm text-black flex items-center justify-center gap-2">
                            Sorteio 
                            <Badge className="bg-orange-500 text-white font-bold">31/10</Badge> 
                            por apenas 
                            <Badge className="bg-primary text-primary-foreground font-bold">R$0,03</Badge>
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
                            
                            {applyDiscount && option.originalPrice ? (
                                <div className='text-xs'>
                                    <span className="line-through opacity-70">
                                    R${option.originalPrice.toFixed(2).replace('.', ',')}
                                    </span>{' '}
                                    <span className="font-bold">
                                    R${option.price.toFixed(2).replace('.', ',')}
                                    </span>
                                </div>
                            ) : (
                                <p className="text-xs">R${option.price.toFixed(2).replace('.', ',')}</p>
                            )}

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
                        <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(1)} disabled={isMaxPriceReached} className="text-primary-foreground hover:bg-primary/80">
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
                        onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
                        placeholder="(00) 90000-0000"
                        className="bg-gray-100 border-gray-300 text-black"
                        maxLength={15}
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
                </>
            )}
          
          <div className={cn("mt-6 p-4 bg-primary/10 border-l-4 border-primary rounded-r-lg text-primary", !showShareBox && "mt-6")}>
            <div className="flex items-start gap-3">
              <Gift className="h-8 w-8 mt-1 text-primary shrink-0" />
              <div>
                <h3 className="font-bold text-base">Ganhe cotas Gratuitas compartilhando!</h3>
                <p className="text-sm text-primary/80">Se uma pessoa comprar 100 cotas pelo seu link, você ganha 40 cotas de graça!</p>
              </div>
            </div>
             <Button 
                onClick={() => {
                    setGeneratedLink('');
                    setSharePhoneNumber('');
                    setIsShareModalOpen(true);
                }} 
                className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
                <Share2 className="mr-2 h-5 w-5" />
                Compartilhar
            </Button>
          </div>

            <AlertDialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
                <AlertDialogContent className="bg-white text-gray-900">
                    <AlertDialogHeader>
                    <AlertDialogTitle className="text-primary">Compartilhe e Ganhe!</AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-900">
                        {generatedLink ? 'Seu link de compartilhamento está pronto!' : 'Insira seu telefone para gerar seu link de compartilhamento e começar a ganhar cotas extras!'}
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    
                    {generatedLink ? (
                        <div className="flex flex-col gap-4 mt-2">
                           <Input 
                             id="share-link"
                             readOnly
                             value={generatedLink}
                             className="bg-gray-100 border-gray-300 text-black text-sm"
                           />
                           <Button onClick={handleCopyLink} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                             <Copy className="mr-2 h-4 w-4" />
                             Copiar Link
                           </Button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4 mt-2">
                            <div className="grid w-full items-center gap-1.5">
                                <Label htmlFor="share-phone" className="text-black">
                                    Seu Telefone (WhatsApp)
                                </Label>
                                <Input
                                    id="share-phone"
                                    type="tel"
                                    value={sharePhoneNumber}
                                    onChange={(e) => setSharePhoneNumber(formatPhoneNumber(e.target.value))}
                                    placeholder="(00) 90000-0000"
                                    className="bg-gray-100 border-gray-300 text-black"
                                    maxLength={15}
                                />
                            </div>
                            <Button onClick={handleGenerateLink} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                                Gerar Link
                            </Button>
                        </div>
                    )}

                    <AlertDialogFooter className="mt-4">
                        <AlertDialogCancel onClick={() => setIsShareModalOpen(false)} className="bg-gray-200 text-gray-800 hover:bg-gray-300">
                            Fechar
                        </AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </CardContent>
      </Card>
    
  );
}

    