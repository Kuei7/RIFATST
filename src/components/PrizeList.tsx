"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Ticket } from "lucide-react";
import { cn } from "@/lib/utils";

const prizes = [
    { number: '01301155', value: 'R$ 500,00', winner: 'Wagner Henr...', status: 'claimed' },
    { number: '01537696', value: 'R$ 500,00', winner: 'Sandro Antu...', status: 'claimed' },
    { number: '1389119', value: 'R$ 500,00', winner: null, status: 'available' },
    { number: '02665562', value: 'R$ 500,00', winner: null, status: 'available' },
    { number: '04474896', value: 'R$ 500,00', winner: null, status: 'available' },
    { number: '04524457', value: 'R$ 500,00', winner: null, status: 'available' },
    { number: '08301334', value: 'R$ 500,00', winner: null, status: 'available' },
    { number: '09091365', value: 'R$ 500,00', winner: null, status: 'available' },
    { number: '09330808', value: 'R$ 500,00', winner: null, status: 'available' },
];

export function PrizeList() {
    return (
        <Card className="mt-8 shadow-lg bg-card border-0 rounded-lg text-card-foreground">
            <CardHeader className="p-4 bg-primary rounded-t-lg">
                <CardTitle className="text-center font-headline text-2xl font-bold text-primary-foreground">
                    COTAS PREMIADAS
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 bg-white rounded-b-lg">
                <div className="flex flex-col gap-3">
                    {prizes.map((prize, index) => (
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
            </CardContent>
        </Card>
    );
}
