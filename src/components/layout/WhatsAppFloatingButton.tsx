import { MessageCircle } from "lucide-react";
import { useWhatsAppModal } from "@/contexts/WhatsAppModalContext";

export function WhatsAppFloatingButton() {
  const { openWhatsAppModal } = useWhatsAppModal();

  return (
    <button
      onClick={() => openWhatsAppModal()}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[hsl(var(--whatsapp))] text-[hsl(var(--whatsapp-foreground))] shadow-lg hover:scale-110 transition-transform animate-pulse-glow"
      aria-label="Fale conosco pelo WhatsApp"
    >
      <MessageCircle className="h-7 w-7" />
    </button>
  );
}
