import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PRODUTOS_INTERESSE, COMPANY } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const formSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  telefone: z.string().min(10, "Telefone inválido"),
  whatsapp: z.string().optional(),
  produto_interesse: z.string().min(1, "Selecione um produto"),
  mensagem: z.string().optional(),
  aceita_politica: z.boolean().refine(val => val === true, "Você deve aceitar a política de privacidade"),
});

type FormData = z.infer<typeof formSchema>;

interface EmbeddedQuoteFormProps {
  className?: string;
  variant?: "light" | "dark";
}

export function EmbeddedQuoteForm({ className, variant = "dark" }: EmbeddedQuoteFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      email: "",
      telefone: "",
      whatsapp: "",
      produto_interesse: "",
      mensagem: "",
      aceita_politica: false,
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // Get UTM params from sessionStorage
      const utmSource = sessionStorage.getItem("utm_source");
      const utmMedium = sessionStorage.getItem("utm_medium");
      const utmCampaign = sessionStorage.getItem("utm_campaign");
      const utmTerm = sessionStorage.getItem("utm_term");
      const utmContent = sessionStorage.getItem("utm_content");

      // Get current page URL
      const pageUrl = window.location.href;

      const { error } = await supabase.functions.invoke("send-quote-email", {
        body: {
          nome: data.nome,
          email: data.email,
          telefone: data.telefone,
          produto_interesse: data.produto_interesse,
          mensagem: data.mensagem || null,
          utm_source: utmSource,
          utm_medium: utmMedium,
          utm_campaign: utmCampaign,
          utm_term: utmTerm,
          utm_content: utmContent,
          page_url: pageUrl,
        },
      });

      if (error) throw error;

      toast({
        title: "Orçamento enviado!",
        description: "Entraremos em contato em breve.",
      });

      form.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Erro ao enviar",
        description: "Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDark = variant === "dark";

  return (
    <div className={cn(
      "rounded-lg p-6 md:p-8",
      isDark ? "bg-primary/90 text-primary-foreground" : "bg-card",
      className
    )}>
      <h3 className={cn(
        "text-xl md:text-2xl font-bold mb-6 text-center uppercase",
        isDark ? "text-primary-foreground" : "text-foreground"
      )}>
        Solicite seu Orçamento
      </h3>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={isDark ? "text-primary-foreground/80" : ""}>Nome *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Seu nome completo" 
                      {...field} 
                      className={isDark ? "bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50" : ""}
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
                  <FormLabel className={isDark ? "text-primary-foreground/80" : ""}>E-mail *</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="seu@email.com" 
                      {...field}
                      className={isDark ? "bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50" : ""}
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
                  <FormLabel className={isDark ? "text-primary-foreground/80" : ""}>Telefone *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="(21) 99999-9999" 
                      {...field}
                      className={isDark ? "bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="whatsapp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={isDark ? "text-primary-foreground/80" : ""}>WhatsApp</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="(21) 99999-9999" 
                      {...field}
                      className={isDark ? "bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="produto_interesse"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={isDark ? "text-primary-foreground/80" : ""}>Produto de Interesse *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className={isDark ? "bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground" : ""}>
                      <SelectValue placeholder="Selecione um produto" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {PRODUTOS_INTERESSE.map((produto) => (
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
                <FormLabel className={isDark ? "text-primary-foreground/80" : ""}>Mensagem</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Descreva seu projeto ou necessidade..."
                    rows={4}
                    {...field}
                    className={isDark ? "bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50" : ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="aceita_politica"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className={cn("text-sm", isDark ? "text-primary-foreground/80" : "")}>
                    Li e concordo com a{" "}
                    <Link to="/home/politica-de-venda" className="underline hover:no-underline">
                      política de privacidade
                    </Link>
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full btn-gold text-lg py-6"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Enviando..." : "ENVIAR MENSAGEM"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
