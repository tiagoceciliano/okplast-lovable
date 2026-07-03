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
    // Em seguida, revalida contra o banco (atualiza pesos/números novos).
    getRotatedWhatsApp()
      .then((n) => setNumber(n))
      .catch(() => {});
  }, []);

  return number;
}