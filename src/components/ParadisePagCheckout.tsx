// @ts-nocheck
"use client";
import React, { useEffect, useState, useRef, createContext, useContext } from 'react';
import { createPayment } from '@/app/actions/paradisepag';

const CHECKOUT_CONFIG = {
    "pixModalTitle": "Verificação via PIX",
    "pixModalCopyButtonText": "Copiar código PIX",
    "pixModalBackgroundColor": "#FFFFFF",
    "pixModalTextColor": "#1f2937",
    "pixModalButtonColor": "#00c27a",
    "pixModalButtonTextColor": "#FFFFFF",
    "pixModalValueText": "💰 Valor:",
    "pixModalExpirationText": "🕒 Válido até:",
    "pixModalSecurePaymentText": "Pagamento seguro via PIX",
    "pixModalInfoTextColor": "#0f172a",
    "pixModalSecurePaymentTextColor": "#00c27a",
    "pixModalInputBackgroundColor": "#f9fafb",
    "pixModalInputBorderColor": "#d1d5db",
    "pixModalInputTextColor": "#374151",
    "pixExpirationMinutes": 5,
};

const ParadisePagContext = createContext(null);

export const ParadisePagProvider = ({ children, onPaymentConfirm }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [pixData, setPixData] = useState(null);
    const [checkoutData, setCheckoutData] = useState(null);
    const [showConfirmButton, setShowConfirmButton] = useState(false);
    const qrCodeRef = useRef(null);

    const createCheckout = async (data) => {
        setCheckoutData(data);
        setIsLoading(true);
        setShowConfirmButton(false);
        try {
            const utms = Object.fromEntries(new URLSearchParams(window.location.search));
            const paymentData = { 
                customer: {}, 
                utms: utms,
                amount: data.amount,
                offerHash: data.offerHash
            };
            const result = await createPayment(paymentData);

            if (result.status >= 200 && result.status < 300) {
                setPixData(result.data);
                setModalOpen(true);
            } else {
                const errorMessage = result.error || (result.data ? JSON.stringify(result.data) : 'Erro desconhecido');
                console.error("Erro ao criar pagamento:", errorMessage);
                alert(`Não foi possível gerar o PIX. Tente novamente. Detalhe: ${errorMessage}`);
            }
        } catch (error) {
            console.error("Erro no checkout:", error);
            alert('Ocorreu um erro inesperado. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        const scriptId = 'qrcode-script';
        if (!document.getElementById(scriptId)) {
            const script = document.createElement('script');
            script.id = scriptId;
            script.src = "https://cdn.jsdelivr.net/gh/davidshimjs/qrcodejs/qrcode.min.js";
            script.async = true;
            document.body.appendChild(script);
        }
    }, []);

    useEffect(() => {
      let timeout;
      if(modalOpen) {
        timeout = setTimeout(() => {
          setShowConfirmButton(true);
        }, 5000);
      }
      return () => clearTimeout(timeout);
    }, [modalOpen]);

    useEffect(() => {
        if (modalOpen && pixData?.pix_qr_code && qrCodeRef.current) {
            const generateQRCode = () => {
                if(window.QRCode) {
                    qrCodeRef.current.innerHTML = "";
                    new window.QRCode(qrCodeRef.current, {
                        text: pixData.pix_qr_code,
                        width: 256,
                        height: 256,
                        correctLevel: window.QRCode.CorrectLevel.H
                    });
                } else {
                    setTimeout(generateQRCode, 100);
                }
            };
            generateQRCode();
        }
    }, [modalOpen, pixData]);

    const handleCopy = () => {
        navigator.clipboard.writeText(pixData.pix_qr_code).then(() => {
            alert('Código PIX copiado!');
        });
    };
    
    const closeModal = () => {
        setModalOpen(false);
        setPixData(null);
        setCheckoutData(null);
        setShowConfirmButton(false);
    }

    const handleConfirmPayment = () => {
      closeModal();
      if (onPaymentConfirm) {
        onPaymentConfirm();
      }
    }

    return (
        <ParadisePagContext.Provider value={{ createCheckout, isLoading }}>
            {children}
            {modalOpen && pixData && checkoutData && (
                 <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)', zIndex: 1000,
                    display: 'flex', justifyContent: 'center', alignItems: 'center'
                }}
                onClick={closeModal}
                >
                    <div style={{
                        backgroundColor: CHECKOUT_CONFIG.pixModalBackgroundColor, color: CHECKOUT_CONFIG.pixModalTextColor,
                        padding: '2rem', borderRadius: '8px', maxWidth: '400px', width: '90%',
                        textAlign: 'center',
                        fontFamily: 'Arial, sans-serif'
                    }}
                    onClick={(e) => e.stopPropagation()}
                    >
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 1rem' }}>{CHECKOUT_CONFIG.pixModalTitle}</h2>
                        <div ref={qrCodeRef} style={{ margin: '0 auto 1rem', width: '256px', height: '256px', display: 'flex', alignItems:'center', justifyContent: 'center' }}></div>
                        
                        <div style={{ marginBottom: '1rem', color: CHECKOUT_CONFIG.pixModalInfoTextColor }}>
                            <p style={{ margin: '0.5rem 0' }}>
                                <span style={{ fontWeight: 'bold' }}>{CHECKOUT_CONFIG.pixModalValueText}</span> {(checkoutData.amount / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </p>
                            <p style={{ margin: '0.5rem 0' }}>
                                <span style={{ fontWeight: 'bold' }}>{CHECKOUT_CONFIG.pixModalExpirationText}</span> {new Date(Date.now() + CHECKOUT_CONFIG.pixExpirationMinutes * 60000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>

                        <div style={{ display: 'flex', margin: '1rem 0' }}>
                            <input type="text" readOnly value={pixData.pix_qr_code} style={{
                                width: '100%', padding: '0.5rem',
                                backgroundColor: CHECKOUT_CONFIG.pixModalInputBackgroundColor,
                                border: `1px solid ${CHECKOUT_CONFIG.pixModalInputBorderColor}`,
                                color: CHECKOUT_CONFIG.pixModalInputTextColor,
                                borderRadius: '4px',
                                textAlign: 'center'
                            }} />
                        </div>
                         <button onClick={handleCopy} style={{
                            width: '100%', padding: '0.75rem', border: 'none',
                            backgroundColor: CHECKOUT_CONFIG.pixModalButtonColor,
                            color: CHECKOUT_CONFIG.pixModalButtonTextColor,
                            borderRadius: '4px', cursor: 'pointer',
                            fontSize: '1rem', fontWeight: 'bold', marginBottom: '1rem'
                        }}>
                            {CHECKOUT_CONFIG.pixModalCopyButtonText}
                        </button>
                        
                        <button onClick={handleConfirmPayment} style={{
                            width: '100%', padding: '0.75rem', border: 'none',
                            backgroundColor: '#6b7280',
                            color: CHECKOUT_CONFIG.pixModalButtonTextColor,
                            borderRadius: '4px', cursor: 'pointer',
                            fontSize: '1rem', fontWeight: 'bold', marginBottom: '1rem'
                        }}>
                            Ir para Roleta (Teste)
                        </button>
                        
                        {showConfirmButton && (
                          <button onClick={handleConfirmPayment} style={{
                              width: '100%', padding: '0.75rem', border: 'none',
                              backgroundColor: '#f59e0b', // A different color for confirmation
                              color: CHECKOUT_CONFIG.pixModalButtonTextColor,
                              borderRadius: '4px', cursor: 'pointer',
                              fontSize: '1rem', fontWeight: 'bold', marginBottom: '1rem'
                          }}>
                              Confirmar Pagamento
                          </button>
                        )}
                        
                        <p style={{
                            fontSize: '0.9rem', color: CHECKOUT_CONFIG.pixModalSecurePaymentTextColor,
                            fontWeight: 'bold'
                        }}>
                            {CHECKOUT_CONFIG.pixModalSecurePaymentText}
                        </p>
                    </div>
                </div>
            )}
        </ParadisePagContext.Provider>
    );
};

export const useParadisePag = () => {
    const context = useContext(ParadisePagContext);
    if (!context) {
        throw new Error('useParadisePag must be used within a ParadisePagProvider');
    }
    return context;
};

export default ParadisePagProvider;

    