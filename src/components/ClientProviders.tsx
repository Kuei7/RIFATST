"use client";

import { ParadisePagProvider } from '@/components/ParadisePagCheckout';
import { useRouter } from 'next/navigation';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const handlePaymentConfirmed = (redirectPath = '/roleta') => {
    // Check for specific redirect paths from session storage if needed
    const upsellRedirect = sessionStorage.getItem('upsellRedirect');
    if (upsellRedirect) {
      router.push(upsellRedirect);
      sessionStorage.removeItem('upsellRedirect');
      return;
    }
    router.push(redirectPath);
  };

  return (
    <ParadisePagProvider onPaymentConfirm={handlePaymentConfirmed}>
      {children}
    </ParadisePagProvider>
  );
}
