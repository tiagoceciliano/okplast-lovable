import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import { COMPANY } from "@/lib/constants";
import logoImg from "@/assets/logo-lab-acrilicos.png";
import { GoogleMapEmbed } from "@/components/ui/GoogleMapEmbed";
export function Footer() {
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
                <a href={`mailto:${COMPANY.email}`} className="hover:text-primary-foreground transition-colors">
                  {COMPANY.email}
                </a>
              </li>
            </ul>
            {/* Logo */}
            <div className="pt-4">
              <img src={logoImg} alt="Lab Acrílicos" className="h-10 w-auto brightness-0 invert opacity-80" />
            </div>
          </div>

          {/* Atendimento */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg uppercase tracking-wide">Atendimento</h3>
            <ul className="space-y-3 text-sm text-primary-foreground/80">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" />
                <a href={`tel:${COMPANY.phone.replace(/\D/g, "")}`} className="hover:text-primary-foreground transition-colors">
                  {COMPANY.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 shrink-0" />
                <a href={`https://wa.me/${COMPANY.whatsapp}`} target="_blank" rel="noopener noreferrer" className="hover:text-primary-foreground transition-colors">
                  {COMPANY.whatsappFormatted}
                </a>
              </li>
            </ul>
            {/* Quick Links */}
            <div className="pt-4 space-y-2">
              <Link to="/home/sobre-nos" className="block text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                Sobre Nós
              </Link>
              <Link to="/home/orcamento" className="block text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                Solicitar Orçamento
              </Link>
              <Link to="/acrilico-sob-medida" className="block text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                9h às 17h
              </Link>
              <Link to="/chapas-de-acrilico" className="block text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                Chapas de Acrílico
              </Link>
            </div>
          </div>

          {/* Horários */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg uppercase tracking-wide">Horários</h3>
            <ul className="space-y-3 text-sm text-primary-foreground/80">
              <li className="flex items-start gap-2">
                <Clock className="h-4 w-4 mt-0.5 shrink-0" />
                <div>
                  <p>Segunda a Sexta</p>
                  <p className="font-semibold text-primary-foreground">8h às 18h</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="h-4 w-4 mt-0.5 shrink-0" />
                <div>
                  <p>Sábado</p>
                  <p className="font-semibold text-primary-foreground">8h às 12h</p>
                </div>
              </li>
            </ul>
            {/* Policies */}
            <div className="pt-4 space-y-2">
              <Link to="/home/politica-de-revenda" className="block text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                Política de Revenda
              </Link>
              <Link to="/home/politica-de-venda" className="block text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                Política de Venda
              </Link>
              <Link to="/home/termo-de-uso" className="block text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                Termo de Uso
              </Link>
            </div>
          </div>

          {/* Mapa */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg uppercase tracking-wide">Localização</h3>
            <GoogleMapEmbed height="200px" />
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/20 text-center text-sm text-primary-foreground/60">
          <p>
            © {currentYear} {COMPANY.name}. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>;
}