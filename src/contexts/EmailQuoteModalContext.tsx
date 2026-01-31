import { createContext, useContext, useState, ReactNode } from "react";
import { EmailQuoteModal } from "@/components/layout/EmailQuoteModal";

interface EmailQuoteModalContextType {
  openEmailModal: (defaultProduto?: string) => void;
  closeEmailModal: () => void;
}

const EmailQuoteModalContext = createContext<EmailQuoteModalContextType | undefined>(undefined);

export function EmailQuoteModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [defaultProduto, setDefaultProduto] = useState<string | undefined>();

  const openEmailModal = (produto?: string) => {
    setDefaultProduto(produto);
    setIsOpen(true);
  };

  const closeEmailModal = () => {
    setIsOpen(false);
  };

  return (
    <EmailQuoteModalContext.Provider value={{ openEmailModal, closeEmailModal }}>
      {children}
      <EmailQuoteModal 
        open={isOpen} 
        onOpenChange={setIsOpen}
        defaultProduto={defaultProduto}
      />
    </EmailQuoteModalContext.Provider>
  );
}

export function useEmailQuoteModal() {
  const context = useContext(EmailQuoteModalContext);
  if (context === undefined) {
    throw new Error("useEmailQuoteModal must be used within a EmailQuoteModalProvider");
  }
  return context;
}
