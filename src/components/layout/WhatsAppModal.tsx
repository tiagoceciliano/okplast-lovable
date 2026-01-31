import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Send } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { COMPANY, PRODUTOS_WHATSAPP } from "@/lib/constants";
import { formatPhone, capitalizeName } from "./WhatsAppButton";
import { supabase } from "@/integrations/supabase/client";
import logoImage from "@/assets/logo-lab-acrilicos.png";

// Schema de validação
const whatsappFormSchema = z.object({
  nome: z.string().trim().min(2, "Nome deve ter pelo menos 2 caracteres").max(100),
  email: z.string().trim().email("E-mail inválido").max(255),
  telefone: z.string().min(14, "Telefone inválido").max(15),
  produto: z.string().min(1, "Selecione um produto"),
  mensagem: z.string().trim().min(5, "Mensagem deve ter pelo menos 5 caracteres").max(1000),
});

type WhatsAppFormData = z.infer<typeof whatsappFormSchema>;

interface WhatsAppModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultProduto?: string;
}

export function WhatsAppModal({ open, onOpenChange, defaultProduto }: WhatsAppModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<WhatsAppFormData>({
    resolver: zodResolver(whatsappFormSchema),
    defaultValues: {
      nome: "",
      email: "",
      telefone: "",
      produto: defaultProduto || "",
      mensagem: "",
    },
  });

  // Atualiza produto padrão quando modal abre
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen && defaultProduto) {
      form.setValue("produto", defaultProduto);
    }
    onOpenChange(isOpen);
  };

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
        `Telefone: ${telefoneFormatado}`,
        `Produto: ${data.produto}`,
        `Mensagem: ${data.mensagem}`,
      ].join("\n");

      const whatsappUrl = `https://api.whatsapp.com/send?phone=${COMPANY.whatsapp}&text=${encodeURIComponent(mensagemWhatsApp)}`;
      window.open(whatsappUrl, "_blank");

      // Dispara webhook de forma assíncrona
      const utmData = {
        utm_source: localStorage.getItem("utm_source") || null,
        utm_medium: localStorage.getItem("utm_medium") || null,
        utm_campaign: localStorage.getItem("utm_campaign") || null,
        utm_term: localStorage.getItem("utm_term") || null,
        utm_content: localStorage.getItem("utm_content") || null,
      };

      supabase.functions.invoke("process-lead", {
        body: {
          nome: nomeFormatado,
          email: data.email,
          telefone: telefoneFormatado,
          produto_interesse: data.produto,
          mensagem: data.mensagem,
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

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="p-0 gap-0 overflow-hidden max-w-[400px] rounded-2xl border-0 whatsapp-modal">
        {/* WhatsApp Header */}
        <div className="whatsapp-header flex items-center gap-3 px-4 py-3">
          <button 
            onClick={() => onOpenChange(false)}
            className="text-white/90 hover:text-white transition-colors"
            aria-label="Fechar"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          
          <Avatar className="h-10 w-10 border-2 border-white/20">
            <AvatarImage src={logoImage} alt="Lab Acrílicos" className="object-cover" />
            <AvatarFallback className="bg-white/20 text-white text-sm font-semibold">LA</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <h3 className="text-white font-semibold text-base leading-tight">Lab Acrílicos</h3>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-white/80 text-xs">Online</span>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <ScrollArea className="whatsapp-chat-area h-[450px]">
          <div className="p-4 space-y-4">
            {/* Welcome Message Bubble */}
            <div className="whatsapp-bubble-received animate-fade-in">
              <p className="text-sm leading-relaxed">
                Olá! 👋 Bem-vindo à <strong>Lab Acrílicos</strong>!
              </p>
              <p className="text-sm leading-relaxed mt-2">
                Para agilizar seu atendimento, preencha os dados abaixo e clique em enviar.
              </p>
              <span className="whatsapp-time">agora</span>
            </div>

            {/* Form as Chat */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                {/* Form Fields Bubble */}
                <div className="whatsapp-bubble-sent animate-fade-in" style={{ animationDelay: "0.1s" }}>
                  <div className="space-y-3">
                    <FormField
                      control={form.control}
                      name="nome"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input 
                              placeholder="Seu nome completo" 
                              className="whatsapp-input"
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
                              placeholder="seu@email.com" 
                              className="whatsapp-input"
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
                              placeholder="(21) 99999-9999" 
                              className="whatsapp-input"
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
                      name="produto"
                      render={({ field }) => (
                        <FormItem>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="whatsapp-input">
                                <SelectValue placeholder="Selecione o produto" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {PRODUTOS_WHATSAPP.map((produto) => (
                                <SelectItem key={produto} value={produto}>
                                  {produto}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
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
                              placeholder="Descreva seu projeto ou dúvida..."
                              className="whatsapp-input min-h-[70px] resize-none"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage className="text-xs text-red-600" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Send Button */}
                <div className="flex justify-end pt-2">
                  <Button 
                    type="submit" 
                    className="whatsapp-send-button"
                    disabled={isSubmitting}
                    size="lg"
                  >
                    {isSubmitting ? "Enviando..." : "Iniciar Conversa"}
                    <Send className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
