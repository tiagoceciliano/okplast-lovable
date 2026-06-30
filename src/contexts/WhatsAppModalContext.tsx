import { createContext, useContext, useState, lazy, Suspense, ReactNode } from "react";

// Modal pesado (react-hook-form + zod + várias primitivas Radix) — só
// carregamos quando o usuário realmente abre o WhatsApp. Reduz drasticamente
// o JS executado na hidratação (TTI).
const WhatsAppModal = lazy(() =>
  import("@/components/layout/WhatsAppModal").then((m) => ({ default: m.WhatsAppModal }))
);

interface WhatsAppModalContextType {
  openWhatsAppModal: (defaultProduto?: string) => void;
  closeWhatsAppModal: () => void;
  isOpen: boolean;
}

const WhatsAppModalContext = createContext<WhatsAppModalContextType | undefined>(undefined);

export function WhatsAppModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [defaultProduto, setDefaultProduto] = useState<string | undefined>();

  const openWhatsAppModal = (produto?: string) => {
    setDefaultProduto(produto);
    setIsOpen(true);
  };

  const closeWhatsAppModal = () => {
    setIsOpen(false);
  };

  return (
    <WhatsAppModalContext.Provider value={{ openWhatsAppModal, closeWhatsAppModal, isOpen }}>
      {children}
      {isOpen && (
        <Suspense fallback={null}>
          <WhatsAppModal
            open={isOpen}
            onOpenChange={setIsOpen}
            defaultProduto={defaultProduto}
          />
        </Suspense>
      )}
    </WhatsAppModalContext.Provider>
  );
}

export function useWhatsAppModal() {
  const context = useContext(WhatsAppModalContext);
  if (context === undefined) {
    throw new Error("useWhatsAppModal must be used within a WhatsAppModalProvider");
  }
  return context;
}
