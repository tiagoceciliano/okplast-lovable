import { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import { useWhatsAppModal } from "@/contexts/WhatsAppModalContext";

export function WhatsAppFloatingButton() {
  const { openWhatsAppModal, isOpen } = useWhatsAppModal();
  const [showProactiveMessage, setShowProactiveMessage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowProactiveMessage(true);
      
      // Tocar som de notificação
      const audio = new Audio('/sounds/notification.mp3');
      audio.volume = 0.5;
      audio.play().catch(() => {
        // Ignora erro se autoplay bloqueado pelo navegador
      });
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);

  // Hide proactive message when modal opens
  useEffect(() => {
    if (isOpen) {
      setShowProactiveMessage(false);
    }
  }, [isOpen]);

  const handleMessageClick = () => {
    setShowProactiveMessage(false);
    openWhatsAppModal();
  };

  const handleCloseMessage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowProactiveMessage(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Proactive Message */}
      {showProactiveMessage && !isOpen && (
        <div 
          onClick={handleMessageClick}
          className="whatsapp-proactive-message cursor-pointer animate-slide-up"
        >
          <button 
            onClick={handleCloseMessage}
            className="absolute -top-2 -right-2 w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center shadow-md transition-colors"
            aria-label="Fechar mensagem"
          >
            <X className="h-3.5 w-3.5 text-gray-600" />
          </button>
          <p className="text-sm text-gray-700 leading-snug pr-2">
            Precisa de ajuda com seu orçamento? 💬
          </p>
        </div>
      )}

      {/* WhatsApp Button */}
      <button
        data-whatsapp-button
        onClick={() => openWhatsAppModal()}
        className="flex items-center justify-center w-14 h-14 rounded-full bg-[hsl(var(--whatsapp))] text-[hsl(var(--whatsapp-foreground))] shadow-lg hover:scale-110 transition-transform animate-pulse-glow"
        aria-label="Fale conosco pelo WhatsApp"
      >
        <MessageCircle className="h-7 w-7" />
      </button>
    </div>
  );
}
