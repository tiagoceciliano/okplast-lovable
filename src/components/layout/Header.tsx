import { Link } from "react-router-dom";
import { MessageCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWhatsAppModal } from "@/contexts/WhatsAppModalContext";
import { useEmailQuoteModal } from "@/contexts/EmailQuoteModalContext";
import logoImg from "@/assets/logos/logo-horizontal.png";

export function Header() {
  const { openWhatsAppModal } = useWhatsAppModal();
  const { openEmailModal } = useEmailQuoteModal();

  return (
    <header className="sticky top-0 z-50 w-full bg-primary">
      <div className="container-custom">
        <div className="flex h-20 md:h-24 items-center justify-between">
          {/* Logo - Larger */}
          <Link to="/" className="flex items-center">
            <img
              src={logoImg}
              alt="Lab Acrílicos"
              className="h-32 md:h-40 lg:h-48 w-auto brightness-0 invert object-contain"
            />
          </Link>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* WhatsApp Button - Green (Primary) */}
            <Button
              onClick={() => openWhatsAppModal()}
              className="btn-whatsapp rounded-full px-4 md:px-6 py-2 md:py-3 text-sm md:text-base font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              <MessageCircle className="h-4 w-4 md:h-5 md:w-5 mr-2" />
              <span className="hidden sm:inline">Orçamento via </span>WhatsApp
            </Button>

            {/* Email Button - Discrete (Secondary) */}
            <Button
              onClick={() => openEmailModal()}
              variant="ghost"
              className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 rounded-full px-3 md:px-4 py-2 text-xs md:text-sm hidden sm:flex"
            >
              <Mail className="h-4 w-4 mr-1" />
              E-mail
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
