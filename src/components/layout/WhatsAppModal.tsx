import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MessageCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { COMPANY, PRODUTOS_WHATSAPP } from "@/lib/constants";
import { formatPhone, capitalizeName } from "./WhatsAppButton";
import { supabase } from "@/integrations/supabase/client";

// Schema de validação
const whatsappFormSchema = z.object({
  nome: z.string().trim().min(2, "Nome deve ter pelo menos 2 caracteres").max(100),
  email: z.string().trim().email("E-mail inválido").max(255),
  telefone: z.string().min(14, "Telefone inválido").max(15),
  produto: z.string().min(1, "Selecione um produto de interesse"),
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
      // Formata o nome
      const nomeFormatado = capitalizeName(data.nome);
      const telefoneFormatado = data.telefone;

      // Monta a mensagem para o WhatsApp
      const mensagemWhatsApp = [
        `Olá, gostaria de atendimento para um orçamento para os dados abaixo:`,
        ``,
        `Nome: ${nomeFormatado}`,
        `E-mail: ${data.email}`,
        `Telefone: ${telefoneFormatado}`,
        `Produto: ${data.produto}`,
        `Mensagem: ${data.mensagem}`,
      ].join("\n");

      // Abre o WhatsApp
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${COMPANY.whatsapp}&text=${encodeURIComponent(mensagemWhatsApp)}`;
      window.open(whatsappUrl, "_blank");

      // Dispara webhook de forma assíncrona (não bloqueia)
      const utmData = {
        utm_source: localStorage.getItem("utm_source") || null,
        utm_medium: localStorage.getItem("utm_medium") || null,
        utm_campaign: localStorage.getItem("utm_campaign") || null,
        utm_term: localStorage.getItem("utm_term") || null,
        utm_content: localStorage.getItem("utm_content") || null,
      };

      // Salva lead via edge function (fire and forget)
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

      // Limpa formulário e fecha modal
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao processar formulário:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler para máscara de telefone
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (value: string) => void) => {
    const formatted = formatPhone(e.target.value);
    onChange(formatted);
  };

  // Handler para capitalizar nome no blur
  const handleNameBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const capitalized = capitalizeName(e.target.value);
    form.setValue("nome", capitalized);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <MessageCircle className="h-5 w-5 text-[hsl(var(--whatsapp))]" />
            Contato via WhatsApp
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Seu nome completo" 
                      {...field} 
                      onBlur={(e) => {
                        field.onBlur();
                        handleNameBlur(e);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail *</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="seu@email.com" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="telefone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="(21) 99999-9999" 
                      {...field}
                      onChange={(e) => handlePhoneChange(e, field.onChange)}
                      maxLength={15}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="produto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Produto de Interesse *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
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
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mensagem"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mensagem *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descreva seu projeto ou dúvida..."
                      className="min-h-[80px] resize-none"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full btn-whatsapp text-base py-6"
              disabled={isSubmitting}
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              {isSubmitting ? "Enviando..." : "Clique aqui para falar pelo WhatsApp"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
