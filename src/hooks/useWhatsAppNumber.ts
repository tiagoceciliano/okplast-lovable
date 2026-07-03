import { useEffect, useState } from "react";
import { getRotatedWhatsApp, WHATSAPP_NUMBERS, type WhatsAppNumber } from "@/lib/whatsapp-rotation";

/**
 * Hook para expor o número WhatsApp atribuído a este visitante.
 * Faz a leitura no client após o mount para evitar hydration mismatch.
 */
export function useWhatsAppNumber(): WhatsAppNumber {
  const [number, setNumber] = useState<WhatsAppNumber>(WHATSAPP_NUMBERS[0]);

  useEffect(() => {
    setNumber(getRotatedWhatsApp());
  }, []);

  return number;
}