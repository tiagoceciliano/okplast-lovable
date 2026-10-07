import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarClock, CalendarIcon, Loader2, AlertCircle, LayoutTemplate, Pencil, X } from "lucide-react";
import { ptBR } from "date-fns/locale";
import { format, startOfDay } from "date-fns";
import { toast } from "sonner";

export interface AgTemplate { nome: string; idioma: string; texto: string; variaveis: number }
export interface AgendamentoItem {
  id: string;
  texto: string;
  enviar_em: string;
  status: string;
  erro: string | null;
  tipo?: string;
  template?: { name: string; language?: string; parametros?: string[] } | null;
}

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  conversaId: string;
  janelaAberta: boolean;
  janelaLimite: number;
  templates: AgTemplate[];
  item?: AgendamentoItem | null; // quando informado, abre em modo visualização/edição
  onSaved: () => void;
}

const pad = (n: number) => String(n).padStart(2, "0");

export function AgendamentoDialog({ open, onOpenChange, conversaId, janelaAberta, janelaLimite, templates, item, onSaved }: Props) {
  const [editando, setEditando] = useState(!item);
  const [data, setData] = useState<Date>();
  const [hora, setHora] = useState("");
  const [texto, setTexto] = useState("");
  const [templateSel, setTemplateSel] = useState("");
  const [params, setParams] = useState<string[]>([]);
  const [salvando, setSalvando] = useState(false);
  const [calOpen, setCalOpen] = useState(false);

  // Tipo: no novo agendamento depende da janela agora; na edição mantém o tipo salvo
  const ehTemplate = item ? item.tipo === "template" : !janelaAberta;

  useEffect(() => {
    if (!open) return;
    setEditando(!item);
    if (item) {
      const d = new Date(item.enviar_em);
      setData(d); setHora(`${pad(d.getHours())}:${pad(d.getMinutes())}`);
      setTexto(item.tipo === "template" ? "" : item.texto);
      setTemplateSel(item.template?.name ?? ""); setParams(item.template?.parametros ?? []);
    } else {
      setData(undefined); setHora(""); setTexto(""); setTemplateSel(""); setParams([]);
    }
  }, [open, item]);

  const quando = useMemo(() => {
    if (!data || !hora) return null;
    const [h, m] = hora.split(":").map(Number);
    const v = new Date(data); v.setHours(h || 0, m || 0, 0, 0);
    return v;
  }, [data, hora]);
  const passado = !!quando && quando.getTime() <= Date.now();
  const tSel = templates.find((t) => t.nome === templateSel);
  const conteudoOk = ehTemplate ? !!tSel && params.slice(0, tSel.variaveis).filter((p) => p?.trim()).length === tSel.variaveis : !!texto.trim();
  const podeSalvar = !!quando && !passado && conteudoOk && !salvando;
  const minHora = data && startOfDay(data).getTime() === startOfDay(new Date()).getTime()
    ? `${pad(new Date().getHours())}:${pad(new Date().getMinutes() + 1 > 59 ? 59 : new Date().getMinutes() + 1)}` : undefined;

  const salvar = async () => {
    if (!podeSalvar || !quando) return;
    const tpl = ehTemplate && tSel ? { name: tSel.nome, language: tSel.idioma, parametros: params.slice(0, tSel.variaveis) } : null;
    const conteudo = tpl ? `[Mensagem pronta] ${tpl.name}${tpl.parametros.length ? " — " + tpl.parametros.join(" | ") : ""}` : texto.trim();
    setSalvando(true);
    let error: { message: string } | null = null;
    if (item) {
      const r = await supabase.rpc("update_whatsapp_agendamento", { _id: item.id, _texto: conteudo, _enviar_em: quando.toISOString(), _template: tpl });
      error = r.error ?? (r.data ? null : { message: "Não foi possível editar este agendamento." });
    } else {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setSalvando(false); toast.error("Sessão inválida."); return; }
      const r = await supabase.from("whatsapp_agendamentos").insert({
        conversa_id: conversaId, autor_id: user.id, texto: conteudo, enviar_em: quando.toISOString(),
        janela_limite: new Date(janelaLimite || quando.getTime()).toISOString(),
        tipo: tpl ? "template" : "texto", template: tpl,
      });
      error = r.error;
    }
    setSalvando(false);
    if (error) { toast.error(error.message); return; }
    toast.success(item ? "Agendamento atualizado" : "Mensagem agendada");
    onSaved(); onOpenChange(false);
  };

  const cancelar = async () => {
    if (!item) return;
    const { error } = await supabase.rpc("cancel_whatsapp_agendamento", { _id: item.id });
    if (error) { toast.error(error.message); return; }
    toast.success("Agendamento cancelado"); onSaved(); onOpenChange(false);
  };

  const fmt = (iso: string) => new Date(iso).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo", day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><CalendarClock className="h-5 w-5 text-info" /> {item ? "Mensagem agendada" : "Agendar mensagem"}</DialogTitle>
          <DialogDescription>{ehTemplate ? "A janela de 24h está fechada: escolha uma mensagem pronta (template)." : "Escreva a mensagem e escolha quando ela será enviada."}</DialogDescription>
        </DialogHeader>

        {item && !editando ? (
          <div className="space-y-3 text-sm">
            <div><p className="text-xs text-muted-foreground">Envio em</p><p className="font-medium">{fmt(item.enviar_em)}</p></div>
            <div><p className="text-xs text-muted-foreground">Mensagem</p><p className="whitespace-pre-wrap rounded-md border bg-muted/40 p-2">{item.texto}</p></div>
            {item.status === "falhou" && item.erro && <p className="flex gap-1.5 text-xs text-destructive"><AlertCircle className="h-4 w-4 shrink-0" /> {item.erro}</p>}
            <div className="flex gap-2 pt-1">
              {item.status === "pendente" && <Button variant="outline" className="flex-1" onClick={cancelar}><X /> Cancelar envio</Button>}
              {(item.status === "pendente" || item.status === "falhou") && <Button className="flex-1" onClick={() => setEditando(true)}><Pencil /> Editar mensagem</Button>}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-medium">Data</label>
                <Popover open={calOpen} onOpenChange={setCalOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="mt-1 h-9 w-full justify-start font-normal"><CalendarIcon className="h-4 w-4" />{data ? format(data, "dd/MM/yyyy") : <span className="text-muted-foreground">Selecionar</span>}</Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-3" align="start">
                    <Calendar mode="single" locale={ptBR} selected={data} onSelect={(d) => { setData(d); setCalOpen(false); }} disabled={{ before: startOfDay(new Date()) }} className="pointer-events-auto p-0" />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <label htmlFor="ag-hora" className="text-xs font-medium">Horário</label>
                <Input id="ag-hora" type="time" min={minHora} value={hora} onChange={(e) => setHora(e.target.value)} className="mt-1 h-9" />
              </div>
            </div>
            {passado && <p className="text-xs text-destructive">Escolha uma data e horário no futuro.</p>}

            {ehTemplate ? (
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-xs font-medium"><LayoutTemplate className="h-3.5 w-3.5" /> Mensagem pronta</label>
                <Select value={templateSel} onValueChange={(v) => { setTemplateSel(v); setParams([]); }}>
                  <SelectTrigger className="h-9"><SelectValue placeholder="Escolher template aprovado…" /></SelectTrigger>
                  <SelectContent>
                    {templates.map((t) => <SelectItem key={t.nome} value={t.nome}>{t.nome}</SelectItem>)}
                    {templates.length === 0 && <div className="px-2 py-1.5 text-xs text-muted-foreground">Nenhum template aprovado.</div>}
                  </SelectContent>
                </Select>
                {tSel && <p className="whitespace-pre-wrap rounded-md border bg-muted/40 p-2 text-xs">{tSel.texto}</p>}
                {tSel && Array.from({ length: tSel.variaveis }).map((_, i) => (
                  <Input key={i} className="h-8 text-sm" placeholder={`Variável {{${i + 1}}}`} value={params[i] ?? ""} onChange={(e) => { const n = [...params]; n[i] = e.target.value; setParams(n); }} />
                ))}
              </div>
            ) : (
              <div>
                <label htmlFor="ag-texto" className="text-xs font-medium">Mensagem</label>
                <Textarea id="ag-texto" rows={4} value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Digite a mensagem que será enviada" className="mt-1" />
                <p className="mt-1.5 text-xs font-medium text-destructive">Atenção: se a janela de 24h estiver fechada no horário agendado, a mensagem não será enviada.</p>
              </div>
            )}

            <div className="flex gap-2">
              {item && <Button variant="outline" className="flex-1" onClick={() => setEditando(false)}>Voltar</Button>}
              <Button className="flex-1" onClick={salvar} disabled={!podeSalvar}>{salvando ? <Loader2 className="animate-spin" /> : <CalendarClock />} {item ? "Salvar alterações" : "Agendar"}</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
