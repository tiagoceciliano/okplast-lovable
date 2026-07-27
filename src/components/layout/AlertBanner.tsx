import { useState, useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";

const STORAGE_KEY = "okplast-alert-banner-closed";

const FULL_MESSAGE =
  "Não trabalhamos com placas customizadas, somente com chapas vendidas inteiras (podendo cortá-las para facilitar o transporte).";

interface AlertBannerProps {
  onVisibilityChange?: (visible: boolean) => void;
}

export function AlertBanner({ onVisibilityChange }: AlertBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const closed = localStorage.getItem(STORAGE_KEY);
      if (closed === "true") setIsVisible(false);
    } catch {
      // localStorage indisponível (modo privado, etc.)
    }
  }, []);

  useEffect(() => {
    onVisibilityChange?.(isVisible);
  }, [isVisible, onVisibilityChange]);

  const handleClose = () => {
    setIsVisible(false);
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // ignore
    }
  };

  if (!isMounted || !isVisible) return null;

  return (
    <div
      role="alert"
      className="fixed bottom-0 left-0 right-0 z-50 w-full bg-gold text-gold-foreground text-xs sm:text-sm"
    >
      <div className="container-custom flex items-center justify-center gap-2 py-2 sm:py-2.5">
        <AlertTriangle
          className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0"
          aria-hidden="true"
        />
        <span className="text-center leading-tight">{FULL_MESSAGE}</span>
        <button
          type="button"
          onClick={handleClose}
          className="ml-2 p-1 rounded hover:bg-gold-foreground/20 transition-colors shrink-0"
          aria-label="Fechar aviso"
        >
          <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </button>
      </div>
    </div>
  );
}
