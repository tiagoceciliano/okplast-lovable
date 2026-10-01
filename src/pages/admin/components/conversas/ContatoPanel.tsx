import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Phone, Mail, User, Tag, StickyNote, Workflow } from "lucide-react";
import { toast } from "sonner";
import { ETAPAS, brl, type Negociacao } from "../kanban/types";
import { TAGS, tagDef } from "./tags";
import type { Conversa } from "./ConversaChat";

interface Nota {
  id: string;
  texto: string;
  autor_id: string | null;
  created_at: string;
}

interface Props {
  conversa: Conversa;
  onNomeAtualizado?: (nome: string) => void;
}

const fmt = (iso: string) =>
  new Date(iso).toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit",
  });

export function ContatoPanel({ conversa, onNomeAtualizado }: Props) {
  const [neg, setNeg] = useState<Negociacao | null>(null);
  const [notas, setNotas] = useState<Nota[]>([]);
  const [novaNota, setNovaNota] = useState("");
  const [nome, setNome] = useState(conversa.nome_contato ?? "");
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    setNome(conversa.nome_contato ?? "");
    let ativo = true;
    (async () => {
      setCarregando(true);
      let query = supabase.from("negociacoes").select("*").limit(1);
      query = conversa.negociacao_id
        ? query.eq("id", conversa.negociacao_id)
        : query.eq("telefone", conversa.telefone);
      const { data } = await query.maybeSingle();
      if (!ativo) return;
      const n = (data as Negociacao | null) ?? null;
      setNeg(n);
      if (n) {
        const { data: cms } = await supabase
          .from("negociacao_comentarios")
          .select("id,texto,autor_id,created_at")
          .eq("negociacao_id", n.id)
          .order("created_at", { ascending: false });
        if (ativo) setNotas((cms as Nota[]) || []);
      } else {
        setNotas([]);
      }
      if (ativo) setCarregando(false);
    })();
    return () => { ativo = false; };
  }, [conversa.id, conversa.negociacao_id, conversa.telefone, conversa.nome_contato]);

  const salvarNome = async () => {
    const valor = nome.trim();
    if (!valor || valor === conversa.nome_contato) return;
    const { error } = await supabase.from("whatsapp_conversas").update({ nome_contato: valor }).eq("id", conversa.id);
    if (error) { toast.error(error.message); return; }
    onNomeAtualizado?.(valor);
    toast.success("Nome atualizado");
  };

  const mudarEtapa = async (etapa: string) => {
    if (!neg) return;
    const { error } = await supabase
      .from("negociacoes")
      .update({ etapa: etapa as Negociacao["etapa"] })
      .eq("id", neg.id);
    if (error) { toast.error(error.message); return; }
    setNeg({ ...neg, etapa: etapa as Negociacao["etapa"] });
    toast.success("Etapa atualizada");
  };

  const alternarTag = async (tagId: string) => {
    if (!neg) return;
    const atuais = neg.tags || [];
    const proximas = atuais.includes(tagId) ? atuais.filter((t) => t !== tagId) : [...atuais, tagId];
    const anterior = atuais;
    setNeg({ ...neg, tags: proximas });
    const { error } = await supabase.from("negociacoes").update({ tags: proximas }).eq("id", neg.id);
    if (error) { setNeg({ ...neg, tags: anterior }); toast.error(error.message); }
  };

  const adicionarNota = async () => {
    if (!neg || !novaNota.trim()) return;
    setSalvando(true);
    const { data: { session } } = await supabase.auth.getSession();
    const { data, error } = await supabase
      .from("negociacao_comentarios")
      .insert({ negociacao_id: neg.id, texto: novaNota.trim(), autor_id: session?.user.id ?? null })
      .select("id,texto,autor_id,created_at")
      .single();
    setSalvando(false);
    if (error) { toast.error(error.message); return; }
    setNotas((prev) => [data as Nota, ...prev]);
    setNovaNota("");
  };

  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto">
      {/* Contato */}
      <div className="border-b p-4">
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <User className="h-3.5 w-3.5" /> Contato
        </div>
        <Input
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          onBlur={salvarNome}
          placeholder="Nome do cliente"
          className="h-9"
        />
        <div className="mt-3 space-y-1.5 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="h-3.5 w-3.5" /> {conversa.telefone}
          </div>
          {neg?.email && (
            <div className="flex items-center gap-2 break-all text-muted-foreground">
              <Mail className="h-3.5 w-3.5 shrink-0" /> {neg.email}
            </div>
          )}
        </div>
      </div>

      {carregando && (
        <div className="flex justify-center p-6"><Loader2 className="h-5 w-5 animate-spin" /></div>
      )}

      {!carregando && !neg && (
        <p className="p-4 text-xs text-muted-foreground">
          Este contato ainda não tem negociação vinculada.
        </p>
      )}

      {!carregando && neg && (
        <>
          {/* Negociação */}
          <div className="border-b p-4">
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <Workflow className="h-3.5 w-3.5" /> Negociação
            </div>
            <Select value={neg.etapa} onValueChange={mudarEtapa}>
              <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                {ETAPAS.map((e) => (
                  <SelectItem key={e.id} value={e.id}>{e.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="mt-3 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Valor</span>
                <span className="font-medium">{brl(neg.valor)}</span>
              </div>
              {(neg.nome_produto || neg.produto) && (
                <div className="flex justify-between gap-3">
                  <span className="text-muted-foreground">Produto</span>
                  <span className="truncate text-right">{neg.nome_produto || neg.produto}</span>
                </div>
              )}
              {neg.utm_campaign && (
                <div className="flex justify-between gap-3">
                  <span className="text-muted-foreground">Campanha</span>
                  <span className="truncate text-right">{neg.utm_campaign}</span>
                </div>
              )}
            </div>
          </div>

          {/* Etiquetas */}
          <div className="border-b p-4">
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <Tag className="h-3.5 w-3.5" /> Etiquetas
            </div>
            <div className="flex flex-wrap gap-1.5">
              {TAGS.map((t) => {
                const ativa = (neg.tags || []).includes(t.id);
                return (
                  <button
                    key={t.id}
                    onClick={() => alternarTag(t.id)}
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold transition ${
                      ativa ? t.className : "border-dashed border-border text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notas internas */}
          <div className="p-4">
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <StickyNote className="h-3.5 w-3.5" /> Notas internas
            </div>
            <Textarea
              value={novaNota}
              onChange={(e) => setNovaNota(e.target.value)}
              rows={2}
              placeholder="Anotação visível só para a equipe…"
              className="resize-none text-sm"
            />
            <Button size="sm" className="mt-2 w-full" disabled={!novaNota.trim() || salvando} onClick={adicionarNota}>
              {salvando ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : null} Salvar nota
            </Button>
            <div className="mt-3 space-y-2">
              {notas.map((n) => (
                <div key={n.id} className="rounded-md bg-muted/50 px-2.5 py-2 text-xs">
                  <p className="whitespace-pre-wrap break-words">{n.texto}</p>
                  <span className="mt-1 block text-[10px] text-muted-foreground">{fmt(n.created_at)}</span>
                </div>
              ))}
              {notas.length === 0 && <p className="text-xs text-muted-foreground">Nenhuma nota ainda.</p>}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
