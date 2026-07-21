import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { COMPANY } from "@/lib/constants";
import { formatPhone, capitalizeName } from "./WhatsAppButton";
import { supabase } from "@/integrations/supabase/client";
import { getStoredUTM } from "@/hooks/useUTM";
import { useWhatsAppNumber } from "@/hooks/useWhatsAppNumber";
import { reportConversion } from "@/lib/conversion";
import logoImage from "@/assets/logo-okplast.png";

// Schema de validação
const whatsappFormSchema = z.object({
  nome: z.string().trim().min(2, "Nome deve ter pelo menos 2 caracteres").max(100),
  email: z.string().trim().email("E-mail inválido").max(255),
  telefone: z.string().min(14, "WhatsApp inválido").max(15),
  mensagem: z.string().trim().min(5, "Mensagem deve ter pelo menos 5 caracteres").max(1000),
});

type WhatsAppFormData = z.infer<typeof whatsappFormSchema>;

interface WhatsAppChatWidgetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WhatsAppChatWidget({ open, onOpenChange }: WhatsAppChatWidgetProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const whatsapp = useWhatsAppNumber();
  const widgetRef = useRef<HTMLDivElement>(null);

  const form = useForm<WhatsAppFormData>({
    resolver: zodResolver(whatsappFormSchema),
    defaultValues: {
      nome: "",
      email: "",
      telefone: "",
      mensagem: "",
    },
  });

  const onSubmit = async (data: WhatsAppFormData) => {
    setIsSubmitting(true);

    try {
      const nomeFormatado = capitalizeName(data.nome);
      const telefoneFormatado = data.telefone;

      const mensagemWhatsApp = [
        `Olá, gostaria de atendimento para um orçamento para os dados abaixo:`,
        ``,
        `Nome: ${nomeFormatado}`,
        `E-mail: ${data.email}`,
        `WhatsApp: ${telefoneFormatado}`,
        `Mensagem: ${data.mensagem}`,
      ].join("\n");

      // Dispara conversão do Google Ads (Enhanced Conversions) ANTES de abrir o WhatsApp.
      // gtag.js normaliza e faz hash SHA-256 do e-mail/telefone antes de enviar.
      const [firstName, ...rest] = nomeFormatado.split(" ");
      reportConversion({
        email: data.email,
        phone: telefoneFormatado,
        firstName,
        lastName: rest.join(" ") || undefined,
      });

      const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsapp.raw}&text=${encodeURIComponent(mensagemWhatsApp)}`;
      window.open(whatsappUrl, "_blank");

      // Dispara webhook de forma assíncrona com UTMs corretos
      const utmData = getStoredUTM();

      supabase.functions.invoke("process-lead", {
        body: {
          nome: nomeFormatado,
          email: data.email,
          telefone: telefoneFormatado,
          produto_interesse: "Chapa Inteira",
          mensagem: data.mensagem,
          current_url: window.location.href,
          destino_whatsapp: whatsapp.raw,
          destino_whatsapp_formatado: whatsapp.formatted,
          ...utmData,
        },
      }).catch(console.error);

      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao processar formulário:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (value: string) => void) => {
    const formatted = formatPhone(e.target.value);
    onChange(formatted);
  };

  const handleNameBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const capitalized = capitalizeName(e.target.value);
    form.setValue("nome", capitalized);
  };

  // Click outside to close
  useEffect(() => {
    if (!open) return;
    
    const handleClickOutside = (event: MouseEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
        const isWhatsAppButton = (event.target as Element)?.closest('[data-whatsapp-button]');
        if (!isWhatsAppButton) {
          onOpenChange(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div 
      ref={widgetRef}
      className="whatsapp-chat-widget animate-slide-up"
    >
      {/* WhatsApp Header */}
      <div className="whatsapp-header flex items-center gap-3 px-4 py-3 rounded-t-2xl">
        <Avatar className="h-10 w-10 border-2 border-white/20">
          <AvatarImage src={logoImage} alt="OK Plast" className="object-cover" />
          <AvatarFallback className="bg-white/20 text-white text-sm font-semibold">OK</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <h3 className="text-white font-semibold text-base leading-tight">OK Plast</h3>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span className="text-white/80 text-xs">Online</span>
          </div>
        </div>

        <button 
          onClick={() => onOpenChange(false)}
          className="text-white/90 hover:text-white transition-colors p-1"
          aria-label="Fechar"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0">
          {/* Chat Area */}
          <ScrollArea className="whatsapp-chat-area flex-1 min-h-0 max-h-[50vh]">
            <div className="p-3 space-y-2">
              {/* Welcome Message Bubble */}
              <div className="whatsapp-bubble-received animate-fade-in">
                <p className="text-sm leading-relaxed">
                  Olá! 👋 Preencha os dados abaixo.
                </p>
                <span className="whatsapp-time">agora</span>
              </div>

              {/* Form Fields Bubble */}
              <div className="whatsapp-bubble-sent animate-fade-in">
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="nome"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input 
                            placeholder="Seu nome" 
                            className="whatsapp-input h-8 text-sm"
                            {...field} 
                            onBlur={(e) => {
                              field.onBlur();
                              handleNameBlur(e);
                            }}
                          />
                        </FormControl>
                        <FormMessage className="text-xs text-red-600" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input 
                            type="email"
                            placeholder="Seu e-mail" 
                            className="whatsapp-input h-8 text-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs text-red-600" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="telefone"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input 
                            placeholder="Seu WhatsApp: (21) 99999-9999" 
                            className="whatsapp-input h-8 text-sm"
                            {...field}
                            onChange={(e) => handlePhoneChange(e, field.onChange)}
                            maxLength={15}
                          />
                        </FormControl>
                        <FormMessage className="text-xs text-red-600" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="mensagem"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea 
                            placeholder="Descreva seu projeto..."
                            className="whatsapp-input min-h-[80px] text-sm resize-none"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage className="text-xs text-red-600" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </ScrollArea>

          {/* Fixed Send Button */}
          <div className="p-3 bg-[#F0F0F0] border-t border-gray-200 rounded-b-2xl">
            <Button 
              type="submit" 
              className="whatsapp-send-button w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Enviando..." : "Iniciar Conversa"}
              <Send className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
