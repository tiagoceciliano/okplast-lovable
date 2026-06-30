import { Link } from "react-router-dom";
import { MapPin, Mail, Clock, MessageCircle } from "lucide-react";
import { COMPANY } from "@/lib/constants";
import logoImg from "@/assets/logo-okplast.png";
import { GoogleMapEmbed } from "@/components/ui/GoogleMapEmbed";
import { useWhatsAppModal } from "@/contexts/WhatsAppModalContext";

export function Footer() {
  const { openWhatsAppModal } = useWhatsAppModal();
  const currentYear = new Date().getFullYear();
  return <footer className="bg-primary text-primary-foreground">
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {/* Contato */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg uppercase tracking-wide">Contato</h3>
            <ul className="space-y-3 text-sm text-primary-foreground/80">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{COMPANY.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0" />
                <span>{COMPANY.email}</span>
              </li>
            </ul>
          </div>

          {/* Atendimento */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg uppercase tracking-wide">Atendimento</h3>
            <ul className="space-y-3 text-sm text-primary-foreground/80">
              <li className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 shrink-0" />
                <button 
                  onClick={() => openWhatsAppModal()} 
                  className="hover:text-primary-foreground transition-colors text-left"
                >
                  {COMPANY.whatsappFormatted}
                </button>
              </li>
            </ul>
          </div>

          {/* Horários */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg uppercase tracking-wide">Horários</h3>
            <ul className="space-y-3 text-sm text-primary-foreground/80">
              <li className="flex items-start gap-2">
                <Clock className="h-4 w-4 mt-0.5 shrink-0" />
                <div>
                  <p>Segunda a Sexta</p>
                  <p className="font-semibold text-primary-foreground">9h às 17h</p>
                </div>
              </li>
            </ul>
            <div className="pt-4 space-y-2">
              <Link to="/home/politica-de-venda" className="block text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                Política de Venda
              </Link>
              <Link to="/home/termo-de-uso" className="block text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                Termo de Uso
              </Link>
              <Link to="/home/politica-de-privacidade" className="block text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                Política de Privacidade
              </Link>
            </div>
          </div>

          {/* Mapa */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg uppercase tracking-wide">Localização</h3>
            <GoogleMapEmbed height="200px" />
          </div>
        </div>

        {/* Copyright com Logo */}
        <div className="mt-8 pt-6 border-t border-primary-foreground/20 flex flex-col items-center gap-2">
          <img
            src={logoImg}
            alt="OK Plast"
            width={120}
            height={48}
            loading="lazy"
            decoding="async"
            className="h-12 w-auto brightness-0 invert opacity-90"
          />
          <p className="text-sm text-primary-foreground/60">
            © {currentYear} {COMPANY.legalName}. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>;
}
