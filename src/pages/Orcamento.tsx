import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { COMPANY, PRODUTOS_INTERESSE } from "@/lib/constants";
import { formatPhone, generateWhatsAppMessage } from "@/components/layout/WhatsAppButton";
import { getStoredUTM } from "@/hooks/useUTM";
import { MessageCircle, Send, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  nome: z.string().trim().min(2, "Nome deve ter pelo menos 2 caracteres").max(100, "Nome muito longo"),
  email: z.string().trim().email("E-mail inválido").max(255, "E-mail muito longo"),
  telefone: z.string().trim().min(14, "Telefone inválido").max(15, "Telefone inválido"),
  produto_interesse: z.string().min(1, "Selecione um produto"),
  mensagem: z.string().trim().max(1000, "Mensagem muito longa").optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function Orcamento() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      email: "",
      telefone: "",
      produto_interesse: "",
      mensagem: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      const utm = getStoredUTM();
      
      // Chama a edge function para processar o lead
      const { data: response, error } = await supabase.functions.invoke("process-lead", {
        body: {
          nome: data.nome,
          email: data.email,
          telefone: data.telefone,
          produto_interesse: data.produto_interesse,
          mensagem: data.mensagem || "",
          utm_source: utm.utm_source,
          utm_medium: utm.utm_medium,
          utm_campaign: utm.utm_campaign,
          utm_term: utm.utm_term,
          utm_content: utm.utm_content,
        },
      });

      if (error) throw error;

      toast({
        title: "Orçamento enviado com sucesso!",
        description: "Entraremos em contato em breve.",
      });

      form.reset();
    } catch (error) {
      console.error("Erro ao enviar orçamento:", error);
      toast({
        title: "Erro ao enviar",
        description: "Tente novamente ou entre em contato pelo WhatsApp.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (value: string) => void) => {
    const formatted = formatPhone(e.target.value);
    onChange(formatted);
  };

  const formValues = form.watch();
  const whatsappMessage = generateWhatsAppMessage({
    nome: formValues.nome,
    telefone: formValues.telefone,
    email: formValues.email,
    produto: formValues.produto_interesse,
    mensagem: formValues.mensagem,
  });

  return (
    <>
      {/* Hero */}
      <section className="gradient-primary text-primary-foreground py-16 md:py-24">
        <div className="container-custom">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Solicitar Orçamento
          </h1>
          <p className="text-lg text-primary-foreground/90 max-w-2xl">
            Preencha o formulário abaixo e receba um orçamento personalizado
          </p>
        </div>
      </section>

      {/* Formulário */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Formulário */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Dados para Orçamento</CardTitle>
                  <CardDescription>
                    Preencha seus dados e descreva o que você precisa
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="nome"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nome *</FormLabel>
                              <FormControl>
                                <Input placeholder="Seu nome completo" {...field} />
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
                                <Input type="email" placeholder="seu@email.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="telefone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Telefone *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="(21) 99999-9999"
                                  value={field.value}
                                  onChange={(e) => handlePhoneChange(e, field.onChange)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="produto_interesse"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Produto de Interesse *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione o produto" />
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
                      </div>

                      <FormField
                        control={form.control}
                        name="mensagem"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mensagem (opcional)</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Descreva seu projeto, medidas, quantidades ou outras informações relevantes..."
                                className="min-h-[120px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full md:w-auto">
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Enviando...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Enviar Orçamento
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* WhatsApp CTA */}
              <Card className="bg-whatsapp text-whatsapp-foreground border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Prefere WhatsApp?
                  </CardTitle>
                  <CardDescription className="text-whatsapp-foreground/90">
                    Fale diretamente com nossa equipe
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full"
                    asChild
                  >
                    <a
                      href={`https://wa.me/${COMPANY.whatsapp}?text=${encodeURIComponent(whatsappMessage)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Chamar no WhatsApp
                    </a>
                  </Button>
                </CardContent>
              </Card>

              {/* Contato */}
              <Card>
                <CardHeader>
                  <CardTitle>Outras Formas de Contato</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p>
                    <strong>Telefone:</strong><br />
                    <a href={`tel:${COMPANY.phone.replace(/\D/g, "")}`} className="text-accent hover:underline">
                      {COMPANY.phone}
                    </a>
                  </p>
                  <p>
                    <strong>E-mail:</strong><br />
                    <a href={`mailto:${COMPANY.email}`} className="text-accent hover:underline">
                      {COMPANY.email}
                    </a>
                  </p>
                  <p>
                    <strong>Endereço:</strong><br />
                    {COMPANY.address}
                  </p>
                  <p>
                    <strong>Horário:</strong><br />
                    {COMPANY.businessHours}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
