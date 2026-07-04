import { useEffect, useState } from "react";
import {
  getRotatedWhatsApp,
  getRotatedWhatsAppSync,
  WHATSAPP_NUMBERS,
  type WhatsAppNumber,
} from "@/lib/whatsapp-rotation";

/**
 * Hook para expor o número WhatsApp atribuído a este visitante.
 * Faz a leitura no client após o mount para evitar hydration mismatch.
 */
export function useWhatsAppNumber(): WhatsAppNumber {
  const [number, setNumber] = useState<WhatsAppNumber>(WHATSAPP_NUMBERS[0]);

  useEffect(() => {
    // Primeiro, define imediatamente com base no cache/localStorage
    // para evitar delay nos botões.
    setNumber(getRotatedWhatsAppSync());
    // Revalida contra o banco em idle para não competir com a LCP.
    const run = () => {
      getRotatedWhatsApp()
        .then((n) => setNumber(n))
        .catch(() => {});
    };
    const ric: any = (window as any).requestIdleCallback;
    const handle = ric ? ric(run, { timeout: 4000 }) : window.setTimeout(run, 2500);
    return () => {
      const cic: any = (window as any).cancelIdleCallback;
      if (ric && cic) cic(handle);
      else clearTimeout(handle as number);
    };
  }, []);

  return number;
}