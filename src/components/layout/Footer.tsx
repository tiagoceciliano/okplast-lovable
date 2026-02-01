import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import { COMPANY } from "@/lib/constants";
import logoImg from "@/assets/logo-lab-acrilicos.png";
import { GoogleMapEmbed } from "@/components/ui/GoogleMapEmbed";
import { useEmailQuoteModal } from "@/contexts/EmailQuoteModalContext";
import { useWhatsAppModal } from "@/contexts/WhatsAppModalContext";

export function Footer() {
  const { openEmailModal } = useEmailQuoteModal();
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
                <button 
                  onClick={() => openEmailModal()} 
                  className="hover:text-primary-foreground transition-colors text-left"
                >
                  {COMPANY.email}
                </button>
              </li>
            </ul>
          </div>

          {/* Atendimento */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg uppercase tracking-wide">Atendimento</h3>
            <ul className="space-y-3 text-sm text-primary-foreground/80">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" />
                <button 
                  onClick={() => openWhatsAppModal()} 
                  className="hover:text-primary-foreground transition-colors text-left"
                >
                  {COMPANY.phone}
                </button>
              </li>
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
            {/* Policies */}
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
        <div className="mt-8 pt-6 border-t border-primary-foreground/20 flex flex-col items-center gap-1">
          <div className="h-24 overflow-hidden">
            <img src={logoImg} alt="Lab Acrílicos" className="h-40 w-auto brightness-0 invert opacity-90 -mt-8" />
          </div>
          <p className="text-sm text-primary-foreground/60">
            © {currentYear} {COMPANY.name}. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>;
}