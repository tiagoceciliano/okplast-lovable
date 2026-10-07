import { useEffect, useState } from "react";
import { ListTodo, MessageSquare, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

interface Tarefa { id: string; titulo: string; concluida: boolean; data_vencimento: string | null; created_by: string | null; }
interface Coment { id: string; texto: string; autor_id: string | null; created_at: string; }

const fmt = (d: string) => new Date(d).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo", day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });

/** Ícones de tarefas e comentários do card de negociação, com lista e criação. */
export function NegAtividades({ negociacaoId, podeEditar, equipe, userId }: { negociacaoId: string; podeEditar: boolean; equipe: Record<string, string>; userId: string | null }) {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [coments, setComents] = useState<Coment[]>([]);
  const [novaTarefa, setNovaTarefa] = useState("");
  const [novaData, setNovaData] = useState("");
  const [novoComent, setNovoComent] = useState("");

  useEffect(() => {
    let ativo = true;
    Promise.all([
      supabase.from("negociacao_tarefas").select("id,titulo,concluida,data_vencimento,created_by").eq("negociacao_id", negociacaoId),
      supabase.from("negociacao_comentarios").select("id,texto,autor_id,created_at").eq("negociacao_id", negociacaoId).order("created_at", { ascending: false }),
    ]).then(([t, c]) => { if (!ativo) return; setTarefas((t.data as Tarefa[]) || []); setComents((c.data as Coment[]) || []); });
    return () => { ativo = false; };
  }, [negociacaoId]);

  const ordenadas = [...tarefas].sort((a, b) => (a.data_vencimento ? +new Date(a.data_vencimento) : Infinity) - (b.data_vencimento ? +new Date(b.data_vencimento) : Infinity));
  const pend = tarefas.filter((t) => !t.concluida).length;
  const atrasada = tarefas.some((t) => !t.concluida && t.data_vencimento && new Date(t.data_vencimento) < new Date());

  const addTarefa = async () => {
    if (!novaTarefa.trim()) return;
    const { data, error } = await supabase.from("negociacao_tarefas").insert({ negociacao_id: negociacaoId, titulo: novaTarefa.trim(), data_vencimento: novaData ? new Date(novaData).toISOString() : null, created_by: userId }).select("id,titulo,concluida,data_vencimento,created_by").single();
    if (error) { toast.error(error.message); return; }
    setTarefas((p) => [...p, data as Tarefa]); setNovaTarefa(""); setNovaData(""); toast.success("Tarefa criada");
  };
  const toggle = async (t: Tarefa) => {
    const { error } = await supabase.from("negociacao_tarefas").update({ concluida: !t.concluida }).eq("id", t.id);
    if (error) toast.error(error.message); else setTarefas((p) => p.map((x) => x.id === t.id ? { ...x, concluida: !t.concluida } : x));
  };
  const remover = async (id: string) => {
    const { error } = await supabase.from("negociacao_tarefas").delete().eq("id", id);
    if (error) toast.error(error.message); else setTarefas((p) => p.filter((x) => x.id !== id));
  };
  const addComent = async () => {
    if (!novoComent.trim()) return;
    const { data, error } = await supabase.from("negociacao_comentarios").insert({ negociacao_id: negociacaoId, texto: novoComent.trim(), autor_id: userId }).select("id,texto,autor_id,created_at").single();
    if (error) { toast.error(error.message); return; }
    setComents((p) => [data as Coment, ...p]); setNovoComent(""); toast.success("Comentário adicionado");
  };

  return (
    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
      <Popover>
        <PopoverTrigger asChild>
          <Button size="sm" variant="ghost" className={`h-6 gap-0.5 px-1.5 text-[10px] ${atrasada ? "text-destructive" : tarefas.length ? "text-primary" : "text-muted-foreground"}`} title="Tarefas">
            <ListTodo className="h-3.5 w-3.5" />{tarefas.length > 0 && `${pend}/${tarefas.length}`}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" side="left" className="w-80 space-y-2 p-3">
          <p className="text-xs font-semibold">Tarefas</p>
          <ul className="max-h-56 space-y-1 overflow-y-auto">
            {ordenadas.map((t) => {
              const venc = !t.concluida && !!t.data_vencimento && new Date(t.data_vencimento) < new Date();
              return (
                <li key={t.id} className={`flex items-center gap-2 rounded p-1.5 text-xs ${venc ? "bg-destructive/10 text-destructive" : "bg-muted/40"}`}>
                  <Checkbox disabled={!podeEditar} checked={t.concluida} onCheckedChange={() => toggle(t)} />
                  <span className={`flex-1 ${t.concluida ? "line-through" : ""}`}>{t.titulo}</span>
                  {t.data_vencimento && <span className="text-[10px] opacity-80">{fmt(t.data_vencimento)}</span>}
                  {t.created_by && t.created_by === userId && <button type="button" title="Excluir tarefa" onClick={() => remover(t.id)}><Trash2 className="h-3 w-3" /></button>}
                </li>
              );
            })}
            {tarefas.length === 0 && <li className="text-xs text-muted-foreground">Nenhuma tarefa.</li>}
          </ul>
          {podeEditar && (
            <div className="space-y-1 border-t pt-2">
              <Input value={novaTarefa} onChange={(e) => setNovaTarefa(e.target.value)} placeholder="Nova tarefa" className="h-8 text-xs" />
              <div className="flex gap-1">
                <Input type="datetime-local" value={novaData} onChange={(e) => setNovaData(e.target.value)} className="h-8 text-xs" />
                <Button size="sm" className="h-8" onClick={addTarefa} disabled={!novaTarefa.trim()}><Plus className="h-3.5 w-3.5" /> Criar</Button>
              </div>
            </div>
          )}
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger asChild>
          <Button size="sm" variant="ghost" className={`h-6 gap-0.5 px-1.5 text-[10px] ${coments.length ? "text-foreground" : "text-muted-foreground"}`} title="Comentários">
            <MessageSquare className="h-3.5 w-3.5" />{coments.length > 0 && coments.length}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" side="left" className="w-80 space-y-2 p-3">
          <p className="text-xs font-semibold">Comentários</p>
          <ul className="max-h-56 space-y-1 overflow-y-auto">
            {coments.map((c) => (
              <li key={c.id} className="rounded bg-gold/10 p-1.5 text-xs">
                <div className="text-[10px] text-muted-foreground"><span className="font-semibold text-foreground/80">{c.autor_id ? equipe[c.autor_id] || "Usuário" : "Sistema"}</span> · {fmt(c.created_at)}</div>
                <div className="whitespace-pre-wrap">{c.texto}</div>
              </li>
            ))}
            {coments.length === 0 && <li className="text-xs text-muted-foreground">Nenhum comentário.</li>}
          </ul>
          {podeEditar && (
            <div className="space-y-1 border-t pt-2">
              <Textarea value={novoComent} onChange={(e) => setNovoComent(e.target.value)} rows={2} placeholder="Novo comentário" className="resize-none text-xs" />
              <Button size="sm" className="h-8 w-full" onClick={addComent} disabled={!novoComent.trim()}><Plus className="h-3.5 w-3.5" /> Adicionar comentário</Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
