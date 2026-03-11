import { Link } from "react-router-dom";
import { MessageCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWhatsAppModal } from "@/contexts/WhatsAppModalContext";
import { useEmailQuoteModal } from "@/contexts/EmailQuoteModalContext";
import logoImage from "@/assets/logo-okplast.png";

export function Header() {
  const { openWhatsAppModal } = useWhatsAppModal();
  const { openEmailModal } = useEmailQuoteModal();

  return (
    <header className="sticky top-0 z-50 w-full bg-primary">
      <div className="container-custom">
        <div className="flex h-16 md:h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src={logoImage}
              alt="OK Plast"
              className="h-10 md:h-12 lg:h-14 w-auto object-contain brightness-0 invert"
              width={180}
              height={56}
              fetchPriority="high"
            />
          </Link>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3 md:gap-4">
            <Button
              onClick={() => openWhatsAppModal()}
              className="btn-whatsapp rounded-full px-4 md:px-6 py-2 md:py-3 text-sm md:text-base font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              <MessageCircle className="h-4 w-4 md:h-5 md:w-5 mr-2" />
              <span className="hidden sm:inline">Orçamento via </span>WhatsApp
            </Button>

            <Button
              onClick={() => openEmailModal()}
              variant="ghost"
              className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 rounded-full px-3 md:px-4 py-2 text-xs md:text-sm hidden sm:flex"
            >
              <Mail className="h-4 w-4 mr-1" />
              Orçamento via e-mail
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
