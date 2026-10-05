import { useEffect, useMemo, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { ConfiguracoesLayout } from "./components/ConfiguracoesLayout";
import { createWhatsappTemplate, deleteWhatsappTemplate, syncWhatsappTemplates } from "@/lib/whatsapp-template-admin.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenuLite } from "./components/modelos/DropdownLite";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Megaphone, Bell, KeyRound, Plus, RefreshCw, Trash2, Copy, Loader2, Check, CircleDashed, CircleDot,
  Bold, Italic, Strikethrough, Code, Smile, Info, ExternalLink, Phone, Reply, Image as ImageIcon, Video, FileText, MapPin, X, MessageCircle, Search, AlertTriangle,
} from "lucide-react";

type Categoria = "MARKETING" | "UTILITY" | "AUTHENTICATION";
type Midia = "NONE" | "IMAGE" | "VIDEO" | "DOCUMENT" | "LOCATION";
type Botao = { tipo: "QUICK_REPLY" | "URL" | "PHONE_NUMBER" | "COPY_CODE"; texto: string; valor: string };

interface Template {
  id: string; meta_id: string | null; nome: string; idioma: string; categoria: string; categoria_anterior: string | null;
  status: string; motivo: string | null; qualidade: string | null; componentes: any[]; updated_at: string;
}

const CAT_LABEL: Record<string, string> = { MARKETING: "Marketing", UTILITY: "Utilidade", AUTHENTICATION: "Autenticação" };
const STATUS: Record<string, { label: string; cls: string }> = {
  APPROVED: { label: "Aprovado", cls: "bg-success/15 text-success border-success/30" },
  PENDING: { label: "Em análise", cls: "bg-warning/15 text-warning-foreground border-warning/40" },
  REJECTED: { label: "Rejeitado", cls: "bg-destructive/10 text-destructive border-destructive/30" },
  PAUSED: { label: "Pausado", cls: "bg-muted text-muted-foreground" },
  DISABLED: { label: "Desativado", cls: "bg-muted text-muted-foreground" },
};
const IDIOMAS = [{ v: "pt_BR", l: "Português (BR)" }, { v: "en_US", l: "English (US)" }, { v: "es", l: "Español" }];

const TIPOS: Record<Categoria, { id: string; titulo: string; desc: string; ok: boolean }[]> = {
  MARKETING: [
    { id: "padrao", titulo: "Padrão", desc: "Envie mensagens com mídia e botões personalizados para engajar seus clientes.", ok: true },
    { id: "catalogo", titulo: "Catálogo", desc: "Envie mensagens para aumentar as vendas conectando seu catálogo de produtos.", ok: false },
    { id: "flows", titulo: "Flows", desc: "Envie um formulário para coletar interesses dos clientes e pedidos de horas marcadas ou fazer pesquisas.", ok: false },
    { id: "pedido", titulo: "Detalhes do pedido", desc: "Envie mensagens que os clientes podem usar para fazer pagamentos para você.", ok: false },
    { id: "ligacao", titulo: "Solicitação de permissões para ligação", desc: "Pergunte aos clientes se você pode ligar para eles no WhatsApp.", ok: false },
  ],
  UTILITY: [
    { id: "padrao", titulo: "Padrão", desc: "Envie mensagens sobre uma conta ou pedido existente.", ok: true },
    { id: "flows", titulo: "Flows", desc: "Envie um formulário para coletar feedback, enviar lembretes ou gerenciar pedidos.", ok: false },
    { id: "status", titulo: "Status do pedido", desc: "Envie mensagens para informar os clientes sobre o andamento de pedidos.", ok: false },
    { id: "pedido", titulo: "Detalhes do pedido", desc: "Envie mensagens que os clientes podem usar para fazer pagamentos para você.", ok: false },
    { id: "ligacao", titulo: "Solicitação de permissões para ligação", desc: "Pergunte aos clientes se você pode ligar para eles no WhatsApp.", ok: false },
  ],
  AUTHENTICATION: [
    { id: "otp", titulo: "Código de acesso de uso único", desc: "Envie códigos para verificar uma transação ou login.", ok: true },
  ],
};
const IDEAL: Record<Categoria, [string, string]> = {
  MARKETING: ["Mensagens de boas-vindas, promoções, ofertas, cupons, boletins informativos, anúncios", "Mídia, cabeçalho, corpo, rodapé e botão"],
  UTILITY: ["Confirmações de pedidos, atualização de conta, recibos, lembretes de horas marcadas, cobrança", "Mídia, cabeçalho, corpo, rodapé e botão"],
  AUTHENTICATION: ["Senha temporária, código de recuperação da conta, verificação da conta, desafios de integridade", "Método de entrega do código"],
};
const EXEMPLO: Record<Categoria, Draft> = {
  MARKETING: { header: "Oferta da semana 🎉", body: "Olá! Chapas de *acrílico* com 10% de desconto até sexta. Use o código *OKPLAST10*.", footer: "OK Plast - Rio de Janeiro", botoes: [{ tipo: "URL", texto: "Ver chapas", valor: "" }], midia: "NONE" } as Draft,
  UTILITY: { header: "", body: "Boa notícia! Seu pedido 12345 foi separado e sai hoje para entrega.\n\nQualquer dúvida, responda esta mensagem.", footer: "", botoes: [{ tipo: "QUICK_REPLY", texto: "Confirmar recebimento", valor: "" }], midia: "NONE" } as Draft,
  AUTHENTICATION: { header: "", body: "*123456* é o seu código de verificação. Para sua segurança, não compartilhe este código.", footer: "", botoes: [{ tipo: "COPY_CODE", texto: "Copiar código", valor: "" }], midia: "NONE" } as Draft,
};

interface Draft { header: string; body: string; footer: string; botoes: Botao[]; midia: Midia }

const varsIn = (s: string) => Array.from(new Set((s.match(/\{\{([a-z0-9_]+)\}\}/g) ?? []).map((m) => m.slice(2, -2))));

function fmt(text: string) {
  // Formatação do WhatsApp: *negrito* _itálico_ ~tachado~ ```código```
  const esc = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return esc
    .replace(/```([^`]+)```/g, "<code class='font-mono text-[12px]'>$1</code>")
    .replace(/\*([^*\n]+)\*/g, "<strong>$1</strong>")
    .replace(/_([^_\n]+)_/g, "<em>$1</em>")
    .replace(/~([^~\n]+)~/g, "<s>$1</s>")
    .replace(/\n/g, "<br/>");
}

function fill(text: string, ex: Record<string, string>) {
  return text.replace(/\{\{([a-z0-9_]+)\}\}/g, (m, k) => ex[k] || m);
}

// ---------------- Prévia ----------------
function Previa({ d, exemplos, categoria, mostrarInfo }: { d: Draft; exemplos: Record<string, string>; categoria: Categoria; mostrarInfo: boolean }) {
  const hora = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  const MidiaIcon = { IMAGE: ImageIcon, VIDEO: Video, DOCUMENT: FileText, LOCATION: MapPin, NONE: null }[d.midia];
  const vazio = !d.body && !d.header && !d.footer;
  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <h3 className="mb-3 font-semibold">Prévia do modelo</h3>
      <div className="min-h-[220px] rounded-md bg-chat-bg p-3">
        {!vazio && (
          <div className="max-w-[260px] overflow-hidden rounded-lg bg-chat-in text-[13.5px] leading-snug text-foreground shadow-sm">
            {MidiaIcon && (
              <div className="m-1 flex h-32 items-center justify-center rounded-md bg-muted text-muted-foreground"><MidiaIcon className="h-10 w-10" /></div>
            )}
            <div className="px-2.5 pb-1 pt-2">
              {d.header && <div className="mb-1 font-bold">{fill(d.header, exemplos)}</div>}
              {d.body && <div dangerouslySetInnerHTML={{ __html: fmt(fill(d.body, exemplos)) }} />}
              {d.footer && <div className="mt-1 text-[12px] text-muted-foreground">{d.footer}</div>}
              <div className="mt-0.5 text-right text-[10.5px] text-muted-foreground">{hora}</div>
            </div>
            {d.botoes.slice(0, d.botoes.length > 3 ? 2 : 3).map((b, i) => {
              const I = b.tipo === "URL" ? ExternalLink : b.tipo === "PHONE_NUMBER" ? Phone : b.tipo === "COPY_CODE" ? Copy : Reply;
              return <div key={i} className="flex items-center justify-center gap-1.5 border-t py-2 text-[13.5px] font-medium text-info"><I className="h-3.5 w-3.5" />{b.texto || "Botão"}</div>;
            })}
            {d.botoes.length > 3 && <div className="flex items-center justify-center gap-1.5 border-t py-2 text-[13.5px] font-medium text-info">Ver todas as opções</div>}
          </div>
        )}
      </div>
      {mostrarInfo && (
        <div className="mt-4 space-y-3 text-sm">
          <div><p className="font-semibold">Este modelo é ideal para</p><p className="text-muted-foreground">{IDEAL[categoria][0]}</p></div>
          <div><p className="font-semibold">Áreas do modelo que você pode personalizar</p><p className="text-muted-foreground">{IDEAL[categoria][1]}</p></div>
        </div>
      )}
    </div>
  );
}

// ---------------- Etapas ----------------
function Etapas({ passo }: { passo: number }) {
  const itens = ["Configurar modelo", "Editar modelo", "Enviar para análise"];
  return (
    <div className="flex flex-wrap items-center gap-1 text-sm">
      {itens.map((t, i) => {
        const done = i < passo, cur = i === passo;
        const I = done ? Check : cur ? CircleDot : CircleDashed;
        return (
          <div key={t} className={cn("flex items-center gap-1.5 rounded-md px-2.5 py-1.5", cur && "bg-info/10 font-semibold text-info", done && "font-medium", !done && !cur && "text-muted-foreground")}>
            <I className={cn("h-4 w-4", done && "rounded-full bg-success p-0.5 text-success-foreground")} />{t}
          </div>
        );
      })}
    </div>
  );
}

function Contador({ n, max }: { n: number; max: number }) {
  return <span className={cn("pointer-events-none absolute right-3 top-2.5 text-xs", n > max ? "text-destructive" : "text-muted-foreground")}>{n}/{max}</span>;
}

// ---------------- Wizard ----------------
function Wizard({ onClose, base }: { onClose: () => void; base?: Template | null }) {
  const criar = useServerFn(createWhatsappTemplate);
  const [passo, setPasso] = useState(0);
  const [categoria, setCategoria] = useState<Categoria>((base?.categoria as Categoria) || "MARKETING");
  const [tipo, setTipo] = useState("padrao");
  const [nome, setNome] = useState(base ? `${base.nome}_copia` : "");
  const [idioma, setIdioma] = useState(base?.idioma || "pt_BR");
  const [formato, setFormato] = useState<"POSITIONAL" | "NAMED">("POSITIONAL");
  const [d, setD] = useState<Draft>(() => {
    if (!base) return { header: "", body: "Olá", footer: "", botoes: [], midia: "NONE" };
    const c = base.componentes || [];
    const h = c.find((x: any) => x.type === "HEADER");
    return {
      header: h?.format === "TEXT" ? h.text : "", body: c.find((x: any) => x.type === "BODY")?.text ?? "",
      footer: c.find((x: any) => x.type === "FOOTER")?.text ?? "", midia: h && h.format !== "TEXT" ? h.format : "NONE",
      botoes: (c.find((x: any) => x.type === "BUTTONS")?.buttons ?? []).map((b: any) => ({ tipo: b.type, texto: b.text, valor: b.url ?? b.phone_number ?? "" })),
    };
  });
  const [exemplos, setExemplos] = useState<Record<string, string>>({});
  const [validade, setValidade] = useState(false);
  const [ttl, setTtl] = useState(600);
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState<{ ok: boolean; msg: string } | null>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { setTipo(TIPOS[categoria][0]!.id); }, [categoria]);

  const nomeOk = nome.toLowerCase().replace(/[^a-z0-9_]+/g, "_");
  const auth = categoria === "AUTHENTICATION";
  const headerVars = varsIn(d.header), bodyVars = varsIn(d.body);
  const todasVars = [...new Set([...headerVars, ...bodyVars])];

  const nextVar = (texto: string) => {
    if (formato === "NAMED") {
      let i = 1; while (texto.includes(`{{variavel_${i}}}`) || d.body.includes(`{{variavel_${i}}}`) || d.header.includes(`{{variavel_${i}}}`)) i++;
      return `{{variavel_${i}}}`;
    }
    return `{{${varsIn(texto).filter((v) => /^\d+$/.test(v)).length + 1}}}`;
  };

  const wrap = (a: string, b = a) => {
    const el = bodyRef.current; if (!el) return;
    const s = el.selectionStart, e = el.selectionEnd;
    const sel = d.body.slice(s, e) || "texto";
    setD({ ...d, body: d.body.slice(0, s) + a + sel + b + d.body.slice(e) });
  };
  const insertBody = (t: string) => {
    const el = bodyRef.current; const s = el?.selectionStart ?? d.body.length;
    setD({ ...d, body: d.body.slice(0, s) + t + d.body.slice(s) });
  };

  const erros = useMemo(() => {
    const e: string[] = [];
    if (!nomeOk || !/^[a-z0-9_]+$/.test(nomeOk)) e.push("Dê um nome ao modelo");
    if (!auth) {
      if (!d.body.trim()) e.push("O corpo é obrigatório");
      if (d.body.length > 1024) e.push("Corpo acima de 1024 caracteres");
      if (d.header.length > 60) e.push("Cabeçalho acima de 60 caracteres");
      if (d.footer.length > 60) e.push("Rodapé acima de 60 caracteres");
      if (headerVars.length > 1) e.push("O cabeçalho aceita só 1 variável");
      if (formato === "POSITIONAL") {
        const nums = bodyVars.map(Number).sort((a, b) => a - b);
        if (nums.some((n, i) => n !== i + 1)) e.push("Variáveis do corpo devem seguir {{1}}, {{2}}…");
      }
      if (todasVars.some((v) => !exemplos[v]?.trim())) e.push("Preencha o exemplo de cada variável");
      if (/^\s*\{\{|\}\}\s*$/.test(d.body)) e.push("O corpo não pode começar nem terminar com variável");
      if (d.midia !== "NONE") e.push("Cabeçalho com mídia ainda não disponível");
      d.botoes.forEach((b, i) => {
        if (!b.texto.trim()) e.push(`Botão ${i + 1}: informe o texto`);
        if (b.tipo === "URL" && !/^https:\/\//.test(b.valor)) e.push(`Botão ${i + 1}: URL deve começar com https://`);
        if (b.tipo === "PHONE_NUMBER" && b.valor.replace(/\D/g, "").length < 10) e.push(`Botão ${i + 1}: telefone inválido`);
      });
    }
    return e;
  }, [nomeOk, d, exemplos, auth, formato]);

  const montar = () => {
    if (auth) {
      return [{ type: "BODY", add_security_recommendation: true }, { type: "FOOTER", code_expiration_minutes: 10 }, { type: "BUTTONS", buttons: [{ type: "OTP", otp_type: "COPY_CODE", text: "Copiar código" }] }];
    }
    const comp: any[] = [];
    const ex = (vs: string[]) => formato === "NAMED"
      ? vs.map((v) => ({ param_name: v, example: exemplos[v] }))
      : vs.map((v) => exemplos[v]);
    if (d.header) comp.push({ type: "HEADER", format: "TEXT", text: d.header, ...(headerVars.length ? { example: formato === "NAMED" ? { header_text_named_params: ex(headerVars) } : { header_text: ex(headerVars) } } : {}) });
    comp.push({ type: "BODY", text: d.body, ...(bodyVars.length ? { example: formato === "NAMED" ? { body_text_named_params: ex(bodyVars) } : { body_text: [ex(bodyVars)] } } : {}) });
    if (d.footer) comp.push({ type: "FOOTER", text: d.footer });
    if (d.botoes.length) comp.push({ type: "BUTTONS", buttons: d.botoes.map((b) => b.tipo === "URL" ? { type: "URL", text: b.texto, url: b.valor } : b.tipo === "PHONE_NUMBER" ? { type: "PHONE_NUMBER", text: b.texto, phone_number: "+" + b.valor.replace(/\D/g, "") } : { type: "QUICK_REPLY", text: b.texto }) });
    return comp;
  };

  const enviar = async () => {
    setEnviando(true); setPasso(2); setResultado(null);
    try {
      const r = await criar({ data: { nome: nomeOk, idioma, categoria, componentes: montar(), formato, validade: validade && categoria !== "MARKETING" ? ttl : undefined } });
      if (r.ok) setResultado({ ok: true, msg: r.status === "APPROVED" ? "Modelo aprovado pela Meta!" : `Modelo enviado. Situação: ${STATUS[r.status]?.label ?? r.status}.${r.categoria && r.categoria !== categoria ? ` A Meta classificou como ${CAT_LABEL[r.categoria]}.` : ""}` });
      else setResultado({ ok: false, msg: r.erro });
    } catch (e: any) { setResultado({ ok: false, msg: e.message ?? "Erro ao enviar" }); }
    setEnviando(false);
  };

  const previaDraft: Draft = passo === 0 ? EXEMPLO[categoria] : auth ? EXEMPLO.AUTHENTICATION : d;
  const CatIcon = { MARKETING: Megaphone, UTILITY: Bell, AUTHENTICATION: KeyRound }[categoria];

  return (
    <div className="pb-24">
      <div className="mb-4 flex items-center gap-2 text-lg"><button onClick={onClose} className="font-semibold hover:underline">Modelos de mensagem</button><span className="text-muted-foreground">›</span><span className="font-semibold">Criar modelo</span></div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_330px]">
        <div className="space-y-4">
          <Etapas passo={passo} />

          {passo === 0 && (
            <div className="rounded-lg border bg-card p-4">
              <h2 className="text-lg font-semibold">Configurar seu modelo</h2>
              <p className="mb-3 text-sm text-muted-foreground">Escolha a categoria que melhor descreve seu modelo de mensagem. Em seguida, selecione o tipo de mensagem que deseja enviar.</p>
              <div className="grid grid-cols-3 overflow-hidden rounded-md border">
                {(["MARKETING", "UTILITY", "AUTHENTICATION"] as Categoria[]).map((c) => {
                  const I = { MARKETING: Megaphone, UTILITY: Bell, AUTHENTICATION: KeyRound }[c];
                  return <button key={c} onClick={() => setCategoria(c)} className={cn("flex items-center justify-center gap-2 border-r py-2 text-sm last:border-r-0", categoria === c ? "bg-muted font-medium" : "hover:bg-muted/50")}><I className="h-4 w-4" />{CAT_LABEL[c]}</button>;
                })}
              </div>
              <div className="mt-2 space-y-1">
                {TIPOS[categoria].map((t) => (
                  <button key={t.id} disabled={!t.ok} onClick={() => setTipo(t.id)} className={cn("flex w-full items-start gap-3 rounded-md px-3 py-2.5 text-left", tipo === t.id ? "bg-info/10" : "hover:bg-muted/50", !t.ok && "cursor-not-allowed opacity-60")}>
                    <span className={cn("mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border", tipo === t.id && "border-info")}>{tipo === t.id && <span className="h-2 w-2 rounded-full bg-info" />}</span>
                    <span><span className="text-sm">{t.titulo}</span>{!t.ok && <Badge variant="outline" className="ml-2 text-[10px]">em breve</Badge>}<span className="block text-xs text-muted-foreground">{t.desc}</span></span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {passo >= 1 && (
            <>
              <div className="flex items-center gap-3 rounded-lg border bg-card p-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-md bg-success text-success-foreground"><CatIcon className="h-5 w-5" /></div>
                <div><p className="font-semibold">{nomeOk || "nome_do_modelo"} • {IDIOMAS.find((i) => i.v === idioma)?.l}</p><p className="text-xs text-muted-foreground">{CAT_LABEL[categoria]} • {TIPOS[categoria].find((t) => t.id === tipo)?.titulo}</p></div>
              </div>

              <div className="rounded-lg border bg-card p-4">
                <h3 className="mb-2 font-semibold">Nome e idioma do modelo</h3>
                <div className="grid gap-3 sm:grid-cols-[1fr_200px]">
                  <div><label className="text-sm font-medium">Dê um nome ao seu modelo</label>
                    <div className="relative"><Input value={nome} maxLength={512} onChange={(e) => setNome(e.target.value)} placeholder="Insira um nome para o modelo" className="pr-16" /><Contador n={nome.length} max={512} /></div>
                    {nome && nome !== nomeOk && <p className="mt-1 text-xs text-muted-foreground">Será salvo como <code>{nomeOk}</code></p>}
                  </div>
                  <div><label className="text-sm font-medium">Selecione o idioma</label>
                    <Select value={idioma} onValueChange={setIdioma}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{IDIOMAS.map((i) => <SelectItem key={i.v} value={i.v}>{i.l}</SelectItem>)}</SelectContent></Select>
                  </div>
                </div>
              </div>

              {auth ? (
                <div className="rounded-lg border bg-card p-4 text-sm">
                  <h3 className="mb-1 font-semibold">Conteúdo</h3>
                  <p className="text-muted-foreground">O texto de autenticação é padrão da Meta: código, aviso de segurança, validade de 10 minutos e botão "Copiar código".</p>
                </div>
              ) : (
                <div className="space-y-4 rounded-lg border bg-card p-4">
                  <div><h3 className="font-semibold">Conteúdo</h3><p className="text-sm text-muted-foreground">Adicione um cabeçalho, corpo de texto e rodapé para seu modelo. A Meta vai analisar as variáveis e o conteúdo do modelo.</p></div>
                  <div className="grid gap-3 sm:grid-cols-2 sm:max-w-md">
                    <div><label className="text-sm font-medium">Tipo de variável</label>
                      <Select value={formato} onValueChange={(v) => setFormato(v as any)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="NAMED">Nome</SelectItem><SelectItem value="POSITIONAL">Número</SelectItem></SelectContent></Select></div>
                    <div><label className="text-sm font-medium">Amostra de mídia <span className="font-normal text-muted-foreground">• Opcional</span></label>
                      <Select value={d.midia} onValueChange={(v) => setD({ ...d, midia: v as Midia })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>
                        <SelectItem value="NONE">Nenhum</SelectItem><SelectItem value="IMAGE">Imagem</SelectItem><SelectItem value="VIDEO">Vídeo</SelectItem><SelectItem value="DOCUMENT">Documento</SelectItem><SelectItem value="LOCATION">Localização</SelectItem>
                      </SelectContent></Select></div>
                  </div>
                  {d.midia !== "NONE" && <p className="flex items-center gap-2 rounded-md bg-warning/15 p-2 text-xs"><AlertTriangle className="h-4 w-4" />O envio do arquivo de exemplo para a Meta ainda não está disponível pela conexão atual. Por enquanto, use cabeçalho de texto.</p>}

                  {d.midia === "NONE" && (
                    <div><label className="text-sm font-medium">Cabeçalho <span className="font-normal text-muted-foreground">• Opcional</span></label>
                      <div className="relative"><Input value={d.header} onChange={(e) => setD({ ...d, header: e.target.value })} placeholder="Adicione uma pequena linha de texto ao cabeçalho da sua mensagem" className="pr-14" /><Contador n={d.header.length} max={60} /></div>
                      <div className="mt-1 flex justify-end"><Button variant="ghost" size="sm" disabled={headerVars.length >= 1} onClick={() => setD({ ...d, header: d.header + nextVar(d.header) })}><Plus className="mr-1 h-4 w-4" />Adicionar variável</Button></div>
                    </div>
                  )}

                  <div><label className="text-sm font-medium">Corpo</label>
                    <div className="relative"><Textarea ref={bodyRef} rows={5} value={d.body} onChange={(e) => setD({ ...d, body: e.target.value })} className="pr-16" /><Contador n={d.body.length} max={1024} /></div>
                    <div className="mt-1 flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" title="Emoji" onClick={() => insertBody("😊")}><Smile className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" title="Negrito" onClick={() => wrap("*")}><Bold className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" title="Itálico" onClick={() => wrap("_")}><Italic className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" title="Tachado" onClick={() => wrap("~")}><Strikethrough className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" title="Código" onClick={() => wrap("```")}><Code className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => insertBody(nextVar(d.body))}><Plus className="mr-1 h-4 w-4" />Adicionar variável</Button>
                    </div>
                  </div>

                  {todasVars.length > 0 && (
                    <div className="rounded-md bg-muted/40 p-3">
                      <p className="mb-2 text-sm font-medium">Exemplos das variáveis <span className="font-normal text-muted-foreground">(a Meta exige um exemplo para analisar)</span></p>
                      <div className="grid gap-2 sm:grid-cols-2">{todasVars.map((v) => (
                        <div key={v} className="flex items-center gap-2"><code className="w-28 shrink-0 text-xs">{`{{${v}}}`}</code><Input value={exemplos[v] ?? ""} onChange={(e) => setExemplos({ ...exemplos, [v]: e.target.value })} placeholder="Ex.: Maria" /></div>
                      ))}</div>
                    </div>
                  )}

                  <div><label className="text-sm font-medium">Rodapé <span className="font-normal text-muted-foreground">• Opcional</span></label>
                    <div className="relative"><Input value={d.footer} onChange={(e) => setD({ ...d, footer: e.target.value })} placeholder="Adicione uma pequena linha de texto à parte inferior da sua mensagem" className="pr-14" /><Contador n={d.footer.length} max={60} /></div>
                  </div>
                </div>
              )}

              {!auth && (
                <div className="rounded-lg border bg-card p-4">
                  <h3 className="font-semibold">Botões <span className="text-sm font-normal text-muted-foreground">• Opcional</span></h3>
                  <p className="mb-3 text-sm text-muted-foreground">Crie botões para que os clientes respondam à sua mensagem ou realizem uma ação. É possível adicionar até 10 botões. Se você adicionar mais de 3 botões, eles aparecerão em uma lista.</p>
                  <div className="space-y-2">
                    {d.botoes.map((b, i) => (
                      <div key={i} className="grid items-center gap-2 rounded-md border p-2 sm:grid-cols-[140px_1fr_1fr_auto]">
                        <span className="text-xs font-medium">{b.tipo === "URL" ? "Acessar o site" : b.tipo === "PHONE_NUMBER" ? "Ligar" : "Personalizado"}</span>
                        <div className="relative"><Input value={b.texto} maxLength={25} placeholder="Texto do botão" onChange={(e) => setD({ ...d, botoes: d.botoes.map((x, j) => j === i ? { ...x, texto: e.target.value } : x) })} /><Contador n={b.texto.length} max={25} /></div>
                        {b.tipo !== "QUICK_REPLY" ? <Input value={b.valor} placeholder={b.tipo === "URL" ? "https://okplast.com.br" : "5521999999999"} onChange={(e) => setD({ ...d, botoes: d.botoes.map((x, j) => j === i ? { ...x, valor: e.target.value } : x) })} /> : <span />}
                        <Button variant="ghost" size="icon" onClick={() => setD({ ...d, botoes: d.botoes.filter((_, j) => j !== i) })}><X className="h-4 w-4" /></Button>
                      </div>
                    ))}
                  </div>
                  <DropdownMenuLite
                    disabled={d.botoes.length >= 10}
                    trigger={<><Plus className="mr-1 h-4 w-4" />Adicionar botão</>}
                    items={[
                      { label: "Personalizado", icon: Reply, onClick: () => setD({ ...d, botoes: [...d.botoes, { tipo: "QUICK_REPLY", texto: "", valor: "" }] }) },
                      { label: "Acessar o site", icon: ExternalLink, disabled: d.botoes.filter((b) => b.tipo === "URL").length >= 2, onClick: () => setD({ ...d, botoes: [...d.botoes, { tipo: "URL", texto: "", valor: "https://okplast.com.br" }] }) },
                      { label: "Ligar no WhatsApp", icon: MessageCircle, disabled: true, hint: "em breve" },
                      { label: "Ligar", icon: Phone, disabled: d.botoes.some((b) => b.tipo === "PHONE_NUMBER"), onClick: () => setD({ ...d, botoes: [...d.botoes, { tipo: "PHONE_NUMBER", texto: "", valor: "" }] }) },
                      { label: "Concluir flow", icon: FileText, disabled: true, hint: "em breve" },
                      { label: "Pedir pagamento", icon: FileText, disabled: true, hint: "em breve" },
                      { label: "Compartilhar informações de contato", icon: FileText, disabled: true, hint: "em breve" },
                    ]}
                  />
                </div>
              )}

              {categoria !== "MARKETING" && (
                <div className="rounded-lg border bg-card p-4">
                  <h3 className="font-semibold">Período de validade da mensagem</h3>
                  <p className="text-sm text-muted-foreground">Se a mensagem não for entregue dentro desse período, você não será cobrado e o cliente não vai vê-la.</p>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div><p className="text-sm font-medium">Defina um período de validade personalizado</p><p className="text-xs text-muted-foreground">Sem isso, vale o período padrão do WhatsApp.</p></div>
                    <Switch checked={validade} onCheckedChange={setValidade} />
                  </div>
                  {validade && (
                    <Select value={String(ttl)} onValueChange={(v) => setTtl(Number(v))}><SelectTrigger className="mt-2 w-48"><SelectValue /></SelectTrigger><SelectContent>
                      {[[60, "1 minuto"], [300, "5 minutos"], [600, "10 minutos"], [1800, "30 minutos"], [3600, "1 hora"], [10800, "3 horas"], [43200, "12 horas"]].map(([v, l]) => <SelectItem key={v} value={String(v)}>{l}</SelectItem>)}
                    </SelectContent></Select>
                  )}
                </div>
              )}

              {passo === 2 && (
                <div className={cn("rounded-lg border p-4 text-sm", resultado?.ok ? "border-success/40 bg-success/10" : resultado ? "border-destructive/40 bg-destructive/10" : "bg-card")}>
                  {enviando ? <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" />Enviando para análise da Meta…</span> : resultado?.msg}
                </div>
              )}
            </>
          )}
        </div>

        <div className="xl:sticky xl:top-4 xl:self-start"><Previa d={previaDraft} exemplos={exemplos} categoria={categoria} mostrarInfo={passo === 0} /></div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t bg-card">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-3 px-6 py-3">
          {passo === 0 ? <Button variant="outline" onClick={onClose}>Descartar</Button> : <Button variant="outline" disabled={enviando} onClick={() => resultado?.ok ? onClose() : setPasso(1)}>{resultado?.ok ? "Fechar" : "Voltar"}</Button>}
          {passo === 0 && <Button className="bg-info text-info-foreground hover:bg-info/90" onClick={() => setPasso(1)}>Avançar</Button>}
          {passo >= 1 && !resultado?.ok && (
            <TooltipProvider><Tooltip><TooltipTrigger asChild><span>
              <Button className="bg-info text-info-foreground hover:bg-info/90" disabled={erros.length > 0 || enviando} onClick={enviar}>{enviando && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Enviar para análise</Button>
            </span></TooltipTrigger>{erros.length > 0 && <TooltipContent side="top"><ul className="text-xs">{erros.map((e) => <li key={e}>• {e}</li>)}</ul></TooltipContent>}</Tooltip></TooltipProvider>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------- Lista ----------------
export default function ModelosPage() {
  const sync = useServerFn(syncWhatsappTemplates);
  const remover = useServerFn(deleteWhatsappTemplate);
  const [lista, setLista] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [wizard, setWizard] = useState<{ base: Template | null } | null>(null);
  const [busca, setBusca] = useState("");
  const [fStatus, setFStatus] = useState("all");
  const [fCat, setFCat] = useState("all");

  const load = async () => {
    const { data } = await supabase.from("whatsapp_templates").select("*").order("updated_at", { ascending: false });
    setLista((data as any) ?? []); setLoading(false);
  };
  const sincronizar = async (silencioso = false) => {
    setSyncing(true);
    try { const r = await sync(); if (!silencioso) toast.success(`${r.total} modelo(s) sincronizados com a Meta`); await load(); }
    catch (e: any) { if (!silencioso) toast.error(e.message ?? "Falha ao sincronizar"); }
    setSyncing(false);
  };
  useEffect(() => {
    load(); sincronizar(true);
    const ch = supabase.channel("tpl").on("postgres_changes", { event: "*", schema: "public", table: "whatsapp_templates" }, () => load()).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const filtrada = lista.filter((t) => (fStatus === "all" || t.status === fStatus) && (fCat === "all" || t.categoria === fCat) && t.nome.includes(busca.toLowerCase()));

  const excluir = async (t: Template) => {
    if (!confirm(`Excluir o modelo "${t.nome}" também na Meta?`)) return;
    const r = await remover({ data: { id: t.id } });
    if (r.ok) { toast.success("Modelo excluído"); load(); } else toast.error(r.erro);
  };

  return (
    <ConfiguracoesLayout active="modelos" wide={!!wizard}>
      {wizard ? <Wizard base={wizard.base} onClose={() => { setWizard(null); sincronizar(true); }} /> : (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div><h2 className="text-xl font-bold">Modelos de mensagem</h2><p className="text-sm text-muted-foreground">Crie e acompanhe a aprovação dos modelos do WhatsApp sem sair do sistema.</p></div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => sincronizar()} disabled={syncing}><RefreshCw className={cn("mr-2 h-4 w-4", syncing && "animate-spin")} />Sincronizar com a Meta</Button>
              <Button onClick={() => setWizard({ base: null })}><Plus className="mr-2 h-4 w-4" />Criar modelo</Button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="relative"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar por nome" className="w-60 pl-8" /></div>
            <Select value={fStatus} onValueChange={setFStatus}><SelectTrigger className="w-40"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Todas as situações</SelectItem>{Object.entries(STATUS).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}</SelectContent></Select>
            <Select value={fCat} onValueChange={setFCat}><SelectTrigger className="w-44"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Todas as categorias</SelectItem>{Object.entries(CAT_LABEL).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent></Select>
          </div>
          <div className="overflow-hidden rounded-lg border bg-card">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left text-xs text-muted-foreground"><tr><th className="p-3">Nome</th><th className="p-3">Categoria</th><th className="p-3">Idioma</th><th className="p-3">Situação</th><th className="p-3">Última mudança</th><th className="p-3" /></tr></thead>
              <tbody>
                {loading ? <tr><td colSpan={6} className="p-6 text-center"><Loader2 className="mx-auto animate-spin" /></td></tr> :
                  filtrada.length === 0 ? <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">Nenhum modelo ainda. Clique em "Criar modelo".</td></tr> :
                  filtrada.map((t) => {
                    const s = STATUS[t.status] ?? { label: t.status, cls: "" };
                    return (
                      <tr key={t.id} className="border-t">
                        <td className="p-3 font-medium">{t.nome}</td>
                        <td className="p-3">{CAT_LABEL[t.categoria] ?? t.categoria}
                          {t.categoria_anterior && t.categoria_anterior !== t.categoria && <span className="ml-2 inline-flex items-center gap-1 rounded bg-warning/15 px-1.5 py-0.5 text-[11px]"><AlertTriangle className="h-3 w-3" />Meta mudou de {CAT_LABEL[t.categoria_anterior] ?? t.categoria_anterior}</span>}
                        </td>
                        <td className="p-3">{IDIOMAS.find((i) => i.v === t.idioma)?.l ?? t.idioma}</td>
                        <td className="p-3">
                          <TooltipProvider><Tooltip><TooltipTrigger asChild><Badge variant="outline" className={cn("gap-1", s.cls)}>{s.label}{t.motivo && <Info className="h-3 w-3" />}</Badge></TooltipTrigger>{t.motivo && <TooltipContent>Motivo: {t.motivo}</TooltipContent>}</Tooltip></TooltipProvider>
                          {t.qualidade && t.qualidade !== "UNKNOWN" && <span className="ml-2 text-xs text-muted-foreground">Qualidade: {t.qualidade}</span>}
                        </td>
                        <td className="p-3 text-muted-foreground">{new Date(t.updated_at).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo", dateStyle: "short", timeStyle: "short" })}</td>
                        <td className="p-3 text-right">
                          <Button variant="ghost" size="icon" title="Duplicar" onClick={() => setWizard({ base: t })}><Copy className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" title="Excluir" onClick={() => excluir(t)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </ConfiguracoesLayout>
  );
}
