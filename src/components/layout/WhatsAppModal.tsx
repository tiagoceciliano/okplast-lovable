import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { COMPANY } from "@/lib/constants";
import { formatPhone, capitalizeName } from "./WhatsAppButton";
import { supabase } from "@/integrations/supabase/client";
import { getStoredUTM } from "@/hooks/useUTM";
import logoImage from "@/assets/logo-okplast.png";

// Schema de validação
const whatsappFormSchema = z.object({
  nome: z.string().trim().min(2, "Nome deve ter pelo menos 2 caracteres").max(100),
  email: z.string().trim().email("E-mail inválido").max(255),
  telefone: z.string().min(14, "WhatsApp inválido").max(15),
  tipo_material: z.string().min(1, "Selecione o tipo de material"),
  mensagem: z.string().trim().min(5, "Mensagem deve ter pelo menos 5 caracteres").max(1000),
});

type WhatsAppFormData = z.infer<typeof whatsappFormSchema>;

const TIPOS_MATERIAL = [
  "Policarbonato Alveolar",
  "Policarbonato Compacto",
  "Acrílico",
  "Poliestireno (PS)",
  "PVC Expandido",
  "ACM",
  "PETG",
  "Outros",
];

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
      tipo_material: "",
      mensagem: "",
    },
  });

  const handleOpenChange = (isOpen: boolean) => {
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
        `WhatsApp: ${telefoneFormatado}`,
        `Tipo de Material: ${data.tipo_material}`,
        `Mensagem: ${data.mensagem}`,
      ].join("\n");

      const whatsappUrl = `https://api.whatsapp.com/send?phone=${COMPANY.whatsapp}&text=${encodeURIComponent(mensagemWhatsApp)}`;
      window.open(whatsappUrl, "_blank");

      const utmData = getStoredUTM();

      supabase.functions.invoke("process-lead", {
        body: {
          nome: nomeFormatado,
          email: data.email,
          telefone: telefoneFormatado,
          produto_interesse: data.tipo_material,
          tipo_material: data.tipo_material,
          mensagem: data.mensagem,
          current_url: window.location.href,
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
      <DialogContent className="p-0 gap-0 max-w-[360px] w-[90vw] overflow-hidden border-0 rounded-2xl max-h-[85vh] flex flex-col">
        {/* WhatsApp Header */}
        <DialogHeader className="whatsapp-header flex-row items-center gap-3 px-4 py-3 rounded-t-2xl space-y-0">
          <Avatar className="h-10 w-10 border-2 border-white/20">
            <AvatarImage src={logoImage} alt="OK Plast" className="object-cover" />
            <AvatarFallback className="bg-white/20 text-white text-sm font-semibold">OK</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <DialogTitle className="text-white font-semibold text-base leading-tight">OK Plast</DialogTitle>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-white/80 text-xs">Online</span>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0">
            <ScrollArea className="whatsapp-chat-area flex-1 min-h-0 max-h-[60vh]">
              <div className="p-3 space-y-2">
                <div className="whatsapp-bubble-received animate-fade-in">
                  <p className="text-sm leading-relaxed">
                    Olá! 👋 Preencha os dados abaixo.
                  </p>
                  <span className="whatsapp-time">agora</span>
                </div>

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
                      name="tipo_material"
                      render={({ field }) => (
                        <FormItem>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="whatsapp-input h-8 text-sm">
                                <SelectValue placeholder="Tipo de Material" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {TIPOS_MATERIAL.map((tipo) => (
                                <SelectItem key={tipo} value={tipo}>
                                  {tipo}
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
                              placeholder="Descreva o tipo de chapa, espessura, medidas..."
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
      </DialogContent>
    </Dialog>
  );
}
