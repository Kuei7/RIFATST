"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Ticket } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "./ui/button";

const allPrizes = [
    { number: '01301155', value: 'R$ 500,00', winner: 'Wagner Henr...', status: 'claimed' },
    { number: '01537696', value: 'R$ 500,00', winner: 'Sandro Antu...', status: 'claimed' },
    { number: '1389119', value: 'R$ 500,00', winner: null, status: 'available' },
    { number: '02665562', value: 'R$ 500,00', winner: null, status: 'available' },
    { number: '04474896', value: 'R$ 500,00', winner: null, status: 'available' },
    { number: '04524457', value: 'R$ 500,00', winner: null, status: 'available' },
    { number: '08301334', value: 'R$ 500,00', winner: null, status: 'available' },
    { number: '09091365', value: 'R$ 500,00', winner: null, status: 'available' },
    { number: '09330808', value: 'R$ 500,00', winner: null, status: 'available' },
    { number: '11223344', value: 'R$ 500,00', winner: null, status: 'available' },
    { number: '22334455', value: 'R$ 500,00', winner: null, status: 'available' },
    { number: '33445566', value: 'R$ 500,00', winner: null, status: 'available' },
    { number: '44556677', value: 'R$ 500,00', winner: null, status: 'available' },
    { number: '55667788', value: 'R$ 500,00', winner: null, status: 'available' },
    { number: '66778899', value: 'R$ 500,00', winner: null, status: 'available' },
    { number: '77889900', value: 'R$ 500,00', winner: null, status: 'available' },
    { number: '88990011', value: 'R$ 500,00', winner: null, status: 'available' },
    { number: '99001122', value: 'R$ 500,00', winner: null, status: 'available' },
    { number: '10101010', value: 'R$ 500,00', winner: null, status: 'available' },
    { number: '20202020', value: 'R$ 500,00', winner: null, status: 'available' },
    { number: '30303030', value: 'R$ 500,00', winner: null, status: 'available' },
    { number: '40404040', value: 'R$ 500,00', winner: null, status: 'available' },
    { number: '50505050', value: 'R$ 500,00', winner: null, status: 'available' },
    { number: '60606060', value: 'R$ 500,00', winner: null, status: 'available' },
    { number: '70707070', value: 'R$ 500,00', winner: null, status: 'available' },
    { number: '80808080', value: 'R$ 500,00', winner: null, status: 'available' },
    { number: '90909090', value: 'R$ 500,00', winner: null, status: 'available' },
    { number: '00000001', value: 'R$ 500,00', winner: null, status: 'available' },
];

const INITIAL_VISIBLE_COUNT = 9;

export function PrizeList() {
    const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);

    const handleShowMore = () => {
        setVisibleCount(allPrizes.length);
    };

    const prizesToShow = allPrizes.slice(0, visibleCount);

    return (
        <Card className="mt-8 shadow-lg bg-card border-0 rounded-lg text-card-foreground">
            <CardHeader className="p-4 bg-primary rounded-t-lg">
                <CardTitle className="text-center font-headline text-2xl font-bold text-primary-foreground">
                    COTAS PREMIADAS
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 bg-white rounded-b-lg">
                <div className="flex flex-col gap-3">
                    {prizesToShow.map((prize, index) => (
                        <div
                            key={index}
                            className={cn(
                                "flex items-center justify-between p-3 rounded-lg text-sm shadow-sm",
                                prize.status === 'claimed'
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-gray-100 text-gray-800"
                            )}
                        >
                            <Badge variant="secondary" className={cn(
                                "font-mono text-xs flex items-center gap-1.5",
                                prize.status === 'claimed' ? "bg-blue-700 text-white" : "bg-gray-300 text-gray-700"
                            )}>
                                <Ticket className="h-3.5 w-3.5" />
                                {prize.number}
                            </Badge>
                            <span className="font-bold text-base tracking-wider">{prize.value}</span>
                            {prize.status === 'claimed' ? (
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">{prize.winner}</span>
                                    <Trophy className="h-4 w-4 text-yellow-400" />
                                </div>
                            ) : (
                                <span className="font-semibold text-green-600">Disponível</span>
                            )}
                        </div>
                    ))}
                </div>
                {visibleCount < allPrizes.length && (
                    <div className="text-center mt-4">
                        <Button onClick={handleShowMore} variant="outline" className="text-primary border-primary hover:bg-primary/10 hover:text-primary">
                            VER MAIS
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
