import { createContext, useContext, useState, ReactNode } from "react";
import { WhatsAppModal } from "@/components/layout/WhatsAppModal";

interface WhatsAppModalContextType {
  openWhatsAppModal: (defaultProduto?: string) => void;
  closeWhatsAppModal: () => void;
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
    <WhatsAppModalContext.Provider value={{ openWhatsAppModal, closeWhatsAppModal }}>
      {children}
      <WhatsAppModal 
        open={isOpen} 
        onOpenChange={setIsOpen}
        defaultProduto={defaultProduto}
      />
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
