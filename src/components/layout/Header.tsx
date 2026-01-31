import { Link } from "react-router-dom";
import { MessageCircle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { COMPANY } from "@/lib/constants";
import logoImg from "@/assets/logo-lab-acrilicos.png";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-primary">
      <div className="container-custom">
        <div className="flex h-20 md:h-24 items-center justify-between">
          {/* Logo - Larger */}
          <Link to="/" className="flex items-center">
            <img
              src={logoImg}
              alt="Lab Acrílicos"
              className="h-14 md:h-16 lg:h-[70px] w-auto brightness-0 invert"
            />
          </Link>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* WhatsApp Button - Green */}
            <Button
              asChild
              className="btn-whatsapp rounded-full px-4 md:px-6 py-2 md:py-3 text-sm md:text-base font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              <a
                href={`https://wa.me/${COMPANY.whatsapp}?text=${encodeURIComponent(`Olá! Gostaria de solicitar um orçamento.`)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                <span className="hidden sm:inline">Orçamento via </span>WhatsApp
              </a>
            </Button>

            {/* Email Button - Light Blue */}
            <Button
              asChild
              className="btn-cta-email rounded-full px-4 md:px-6 py-2 md:py-3 text-sm md:text-base font-semibold shadow-lg hover:shadow-xl transition-all hidden sm:flex"
            >
              <Link to="/home/orcamento">
                <Calendar className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                Orçamento via e-mail
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
