import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import { COMPANY } from "@/lib/constants";
import logoImg from "@/assets/logo-lab-acrilicos.png";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Logo e Descrição */}
          <div className="space-y-4">
            <img
              src={logoImg}
              alt="Lab Acrílicos"
              className="h-12 w-auto brightness-0 invert"
            />
            <p className="text-sm text-primary-foreground/80">
              Fábrica e loja especializada em chapas de acrílico e produtos
              personalizados. Mais de 30 anos de experiência no mercado.
            </p>
          </div>

          {/* Contato */}
          <div className="space-y-4">
            <h3 className="font-display font-semibold text-lg">Contato</h3>
            <ul className="space-y-3 text-sm text-primary-foreground/80">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{COMPANY.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" />
                <a
                  href={`tel:${COMPANY.phone.replace(/\D/g, "")}`}
                  className="hover:text-primary-foreground transition-colors"
                >
                  {COMPANY.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 shrink-0" />
                <a
                  href={`https://wa.me/${COMPANY.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-foreground transition-colors"
                >
                  {COMPANY.whatsappFormatted}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0" />
                <a
                  href={`mailto:${COMPANY.email}`}
                  className="hover:text-primary-foreground transition-colors"
                >
                  {COMPANY.email}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 shrink-0" />
                <span>{COMPANY.businessHours}</span>
              </li>
            </ul>
          </div>

          {/* Links Rápidos */}
          <div className="space-y-4">
            <h3 className="font-display font-semibold text-lg">Links Rápidos</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li>
                <Link
                  to="/home/sobre-nos"
                  className="hover:text-primary-foreground transition-colors"
                >
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link
                  to="/home/orcamento"
                  className="hover:text-primary-foreground transition-colors"
                >
                  Solicitar Orçamento
                </Link>
              </li>
              <li>
                <Link
                  to="/acrilico-sob-medida"
                  className="hover:text-primary-foreground transition-colors"
                >
                  Acrílico Sob Medida
                </Link>
              </li>
              <li>
                <Link
                  to="/chapas-de-acrilico"
                  className="hover:text-primary-foreground transition-colors"
                >
                  Chapas de Acrílico
                </Link>
              </li>
            </ul>
          </div>

          {/* Políticas */}
          <div className="space-y-4">
            <h3 className="font-display font-semibold text-lg">Políticas</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li>
                <Link
                  to="/home/politica-de-revenda"
                  className="hover:text-primary-foreground transition-colors"
                >
                  Política de Revenda
                </Link>
              </li>
              <li>
                <Link
                  to="/home/politica-de-venda"
                  className="hover:text-primary-foreground transition-colors"
                >
                  Política de Venda
                </Link>
              </li>
              <li>
                <Link
                  to="/home/termo-de-uso"
                  className="hover:text-primary-foreground transition-colors"
                >
                  Termo de Uso
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/20 text-center text-sm text-primary-foreground/60">
          <p>
            © {currentYear} {COMPANY.name}. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
