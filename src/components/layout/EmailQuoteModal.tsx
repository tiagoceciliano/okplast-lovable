import { useState } from "react";
import { useForm } from "react-hook-form";
import { getStoredUTM } from "@/hooks/useUTM";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Send, CheckCircle, X } from "lucide-react";
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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PRODUTOS_WHATSAPP } from "@/lib/constants";
import { formatPhone, capitalizeName } from "./WhatsAppButton";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Schema de validação
const emailFormSchema = z.object({
  nome: z.string().trim().min(2, "Nome deve ter pelo menos 2 caracteres").max(100),
  email: z.string().trim().email("E-mail inválido").max(255),
  telefone: z.string().min(14, "Telefone inválido").max(15),
  produto: z.string().min(1, "Selecione um produto"),
  mensagem: z.string().trim().min(5, "Mensagem deve ter pelo menos 5 caracteres").max(1000),
});

type EmailFormData = z.infer<typeof emailFormSchema>;

interface EmailQuoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultProduto?: string;
}

export function EmailQuoteModal({ open, onOpenChange, defaultProduto }: EmailQuoteModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const form = useForm<EmailFormData>({
    resolver: zodResolver(emailFormSchema),
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
    if (!isOpen) {
      setIsSuccess(false);
    }
    onOpenChange(isOpen);
  };

  const onSubmit = async (data: EmailFormData) => {
    setIsSubmitting(true);

    try {
      const nomeFormatado = capitalizeName(data.nome);
      const telefoneFormatado = data.telefone;

      // Coleta dados UTM usando a função centralizada
      const utmData = getStoredUTM();

      // Envia para edge function que salva no banco + envia email
      const { data: response, error } = await supabase.functions.invoke("send-quote-email", {
        body: {
          nome: nomeFormatado,
          email: data.email,
          telefone: telefoneFormatado,
          produto_interesse: data.produto,
          mensagem: data.mensagem,
          ...utmData,
        },
      });

      if (error) {
        throw error;
      }

      setIsSuccess(true);
      form.reset();
      
      // Fecha modal após 3 segundos
      setTimeout(() => {
        onOpenChange(false);
        setIsSuccess(false);
      }, 3000);

    } catch (error) {
      console.error("Erro ao enviar orçamento:", error);
      toast({
        variant: "destructive",
        title: "Erro ao enviar",
        description: "Não foi possível enviar seu orçamento. Tente novamente ou use o WhatsApp.",
      });
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
      <DialogContent className="p-0 gap-0 overflow-hidden max-w-[400px] max-h-[80vh] rounded-2xl border-0 flex flex-col">
        {/* Header Compacto */}
        <div className="bg-primary flex items-center justify-between px-3 py-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <Mail className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-primary-foreground font-semibold text-sm leading-tight">Orçamento por E-mail</h3>
              <span className="text-primary-foreground/70 text-[11px]">Resposta em até 24h</span>
            </div>
          </div>
          <button 
            onClick={() => onOpenChange(false)}
            className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="flex-1 flex flex-col items-center justify-center p-5 text-center">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-base font-semibold text-foreground mb-1">Orçamento Enviado!</h3>
            <p className="text-muted-foreground text-xs">
              Entraremos em contato em breve pelo e-mail informado.
            </p>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0">
              <ScrollArea className="flex-1 min-h-0">
                <div className="px-3 py-2 space-y-2">
                  <p className="text-[11px] text-muted-foreground leading-tight">
                    Preencha os dados e receba seu orçamento no e-mail.
                  </p>

                  <FormField
                    control={form.control}
                    name="nome"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-xs">Nome completo</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Seu nome" 
                            className="h-9 text-sm"
                            {...field} 
                            onBlur={(e) => {
                              field.onBlur();
                              handleNameBlur(e);
                            }}
                          />
                        </FormControl>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-xs">E-mail</FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="seu@email.com" 
                            className="h-9 text-sm"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="telefone"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-xs">Telefone</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="(21) 99999-9999" 
                            className="h-9 text-sm"
                            {...field}
                            onChange={(e) => handlePhoneChange(e, field.onChange)}
                            maxLength={15}
                          />
                        </FormControl>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="produto"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-xs">Produto de interesse</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-9 text-sm">
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
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="mensagem"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-xs">Mensagem</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Descreva seu projeto, medidas, quantidades..."
                            className="min-h-[60px] text-sm resize-none"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )}
                  />
                </div>
              </ScrollArea>

              {/* Fixed Send Button */}
              <div className="p-2 bg-secondary border-t">
                <Button 
                  type="submit" 
                  className="w-full h-10"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Enviando..." : "Enviar Orçamento"}
                  <Send className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
