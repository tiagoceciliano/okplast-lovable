import { useState, useEffect, lazy, Suspense } from "react";
import { MessageCircle, X } from "lucide-react";

// Lazy load do widget de chat (não-crítico)
const WhatsAppChatWidget = lazy(() => import("./WhatsAppChatWidget").then(m => ({ default: m.WhatsAppChatWidget })));

export function WhatsAppFloatingButton() {
  const [showProactiveMessage, setShowProactiveMessage] = useState(false);
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowProactiveMessage(true);
      
      // Tocar som de notificação apenas no momento necessário
      try {
        const audio = new Audio('/sounds/notification.mp3');
        audio.volume = 0.5;
        audio.play().catch(() => {});
      } catch {
        // Ignora erro de áudio
      }
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);

  // Hide proactive message when widget opens
  useEffect(() => {
    if (isWidgetOpen) {
      setShowProactiveMessage(false);
    }
  }, [isWidgetOpen]);

  const handleMessageClick = () => {
    setShowProactiveMessage(false);
    setIsWidgetOpen(true);
  };

  const handleCloseMessage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowProactiveMessage(false);
  };

  const handleButtonClick = () => {
    setIsWidgetOpen(!isWidgetOpen);
  };

  return (
    <>
      {/* Chat Widget */}
      {isWidgetOpen && (
        <Suspense fallback={null}>
          <WhatsAppChatWidget open={isWidgetOpen} onOpenChange={setIsWidgetOpen} />
        </Suspense>
      )}

      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {/* Proactive Message */}
        {showProactiveMessage && !isWidgetOpen && (
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
          onClick={handleButtonClick}
          className="flex items-center justify-center w-14 h-14 rounded-full bg-[hsl(var(--whatsapp))] text-[hsl(var(--whatsapp-foreground))] shadow-lg hover:scale-110 transition-transform animate-pulse-glow"
          aria-label="Fale conosco pelo WhatsApp"
        >
          <MessageCircle className="h-7 w-7" />
        </button>
      </div>
    </>
  );
}
