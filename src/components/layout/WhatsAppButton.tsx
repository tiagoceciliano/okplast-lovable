import { MessageCircle } from "lucide-react";
import { COMPANY } from "@/lib/constants";

interface WhatsAppButtonProps {
  message?: string;
}

export function WhatsAppButton({ message }: WhatsAppButtonProps) {
  const defaultMessage = `Olá! Gostaria de mais informações sobre os produtos da ${COMPANY.name}.`;
  const encodedMessage = encodeURIComponent(message || defaultMessage);
  const whatsappUrl = `https://wa.me/${COMPANY.whatsapp}?text=${encodedMessage}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-whatsapp text-whatsapp-foreground shadow-lg hover:scale-110 transition-transform animate-pulse-glow"
      aria-label="Fale conosco pelo WhatsApp"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}

// Função utilitária para gerar mensagem personalizada do WhatsApp
export function generateWhatsAppMessage(data: {
  nome?: string;
  telefone?: string;
  email?: string;
  produto?: string;
  mensagem?: string;
}): string {
  const { nome, telefone, email, produto, mensagem } = data;

  const lines: string[] = [
    `Olá! Meu nome é ${capitalizeName(nome || "")}.`,
  ];

  if (telefone) {
    lines.push(`Telefone: ${telefone}`);
  }

  if (email) {
    lines.push(`E-mail: ${email}`);
  }

  if (produto) {
    lines.push(`Produto de interesse: ${produto}`);
  }

  if (mensagem) {
    lines.push(`\nMensagem: ${mensagem}`);
  }

  return lines.join("\n");
}

// Capitaliza a primeira letra de cada palavra do nome
export function capitalizeName(name: string): string {
  return name
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Aplica máscara de telefone brasileiro
export function formatPhone(value: string): string {
  const numbers = value.replace(/\D/g, "");
  
  if (numbers.length <= 2) {
    return numbers;
  }
  
  if (numbers.length <= 7) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  }
  
  if (numbers.length <= 11) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
  }
  
  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
}
