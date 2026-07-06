import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Check, X, Trash2, Plus, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { ETAPAS, brl, type EtapaId, type Negociacao, type VendedorLite } from "./types";
import { usePermissions } from "@/hooks/usePermissions";

interface Props {
  negociacao: Negociacao | null;
  vendedores: VendedorLite[];
  numeroMap?: Record<string, { user_id: string | null; nome: string; formatado: string }>;
  onClose: () => void;
  onChanged: () => void;
}

interface Tarefa { id: string; titulo: string; data_vencimento: string | null; concluida: boolean; }
interface Comentario { id: string; texto: string; autor_id: string | null; created_at: string; }
interface Hist { id: string; tipo: string; descricao: string | null; created_at: string; }

export function NegociacaoModal({ negociacao, vendedores, numeroMap = {}, onClose, onChanged }: Props) {
  const { can } = usePermissions();
  const [n, setN] = useState<Negociacao | null>(negociacao);
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [coments, setComents] = useState<Comentario[]>([]);
  const [hist, setHist] = useState<Hist[]>([]);
  const [novoComent, setNovoComent] = useState("");
  const [novaTarefa, setNovaTarefa] = useState("");
  const [novaData, setNovaData] = useState("");

  useEffect(() => setN(negociacao), [negociacao]);
  useEffect(() => {
    if (!negociacao) return;
    (async () => {
      const [t, c, h] = await Promise.all([
        supabase.from("negociacao_tarefas").select("*").eq("negociacao_id", negociacao.id).order("data_vencimento"),
        supabase.from("negociacao_comentarios").select("*").eq("negociacao_id", negociacao.id).order("created_at", { ascending: false }),
        supabase.from("negociacao_historico").select("*").eq("negociacao_id", negociacao.id).order("created_at", { ascending: false }),
      ]);
      setTarefas((t.data as Tarefa[]) || []);
      setComents((c.data as Comentario[]) || []);
      setHist((h.data as Hist[]) || []);
    })();
  }, [negociacao?.id]);

  if (!n) return null;
  const canEdit = can("negociacoes", "edit", n.responsavel_id);
  const canDelete = can("negociacoes", "delete", n.responsavel_id);

  const patchN = async (patch: Partial<Negociacao>) => {
    setN((prev) => (prev ? { ...prev, ...patch } as Negociacao : prev));
    const { error } = await supabase.from("negociacoes").update(patch).eq("id", n.id);
    if (error) toast.error(error.message);
    else onChanged();
  };

  const addTarefa = async () => {
    if (!novaTarefa.trim()) return;
    const { data, error } = await supabase.from("negociacao_tarefas").insert({
      negociacao_id: n.id, titulo: novaTarefa.trim(),
      data_vencimento: novaData ? new Date(novaData).toISOString() : null,
    }).select().single();
    if (error) { toast.error(error.message); return; }
    setTarefas((p) => [...p, data as Tarefa]);
    setNovaTarefa(""); setNovaData("");
  };

  const toggleTarefa = async (t: Tarefa) => {
    await supabase.from("negociacao_tarefas").update({ concluida: !t.concluida }).eq("id", t.id);
    setTarefas((p) => p.map((x) => (x.id === t.id ? { ...x, concluida: !t.concluida } : x)));
  };

  const removeTarefa = async (id: string) => {
    await supabase.from("negociacao_tarefas").delete().eq("id", id);
    setTarefas((p) => p.filter((x) => x.id !== id));
  };

  const addComent = async () => {
    if (!novoComent.trim()) return;
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase.from("negociacao_comentarios").insert({
      negociacao_id: n.id, texto: novoComent.trim(), autor_id: user?.id ?? null,
    }).select().single();
    if (error) { toast.error(error.message); return; }
    setComents((p) => [data as Comentario, ...p]);
    setNovoComent("");
  };

  const removerNegociacao = async () => {
    if (!confirm("Excluir esta negociação?")) return;
    const { error } = await supabase.from("negociacoes").delete().eq("id", n.id);
    if (error) { toast.error(error.message); return; }
    toast.success("Negociação excluída");
    onChanged(); onClose();
  };

  const vendedoresElegiveis = vendedores;

  const destinoInfo = n.destino_whatsapp ? numeroMap[n.destino_whatsapp] : null;
  const atribuirDoDestino = async () => {
    if (!destinoInfo?.user_id) return;
    await patchN({ responsavel_id: destinoInfo.user_id });
    toast.success(`Atribuído a ${destinoInfo.nome}`);
  };

  return (
    <Dialog open={!!negociacao} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle className="text-xl flex-1">{n.nome_cliente}</DialogTitle>
            {canEdit && (
              <>
                <Button size="sm" variant="outline" className="text-emerald-600" onClick={() => patchN({ etapa: "ganho" })}>
                  <Check className="h-4 w-4 mr-1" /> Ganho
                </Button>
                <Button size="sm" variant="outline" className="text-destructive" onClick={() => patchN({ etapa: "perdido" })}>
                  <X className="h-4 w-4 mr-1" /> Perdido
                </Button>
              </>
            )}
            {canDelete && (
              <Button size="icon" variant="ghost" onClick={removerNegociacao}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            )}
          </div>
          {n.telefone && <p className="text-sm text-muted-foreground">{n.telefone}</p>}
        </DialogHeader>

        {/* Barra de etapas */}
        <div className="flex gap-1 flex-wrap">
          {ETAPAS.map((e) => (
            <button
              key={e.id}
              disabled={!canEdit}
              onClick={() => patchN({ etapa: e.id as EtapaId })}
              className={`text-xs px-3 py-1.5 rounded-full border transition ${
                n.etapa === e.id ? "bg-primary text-primary-foreground border-primary" : "bg-background hover:bg-muted"
              } disabled:opacity-60`}
            >
              {e.label}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Coluna esquerda: comentarios + tarefas + historico */}
          <div className="space-y-4">
            <div>
              <Label className="text-xs">Novo comentário</Label>
              <Textarea value={novoComent} onChange={(e) => setNovoComent(e.target.value)} rows={2} placeholder="Escreva uma nota interna…" />
              <div className="flex justify-end mt-1">
                <Button size="sm" onClick={addComent} disabled={!novoComent.trim()}>Adicionar</Button>
              </div>
            </div>

            <div>
              <Label className="text-xs">Nova tarefa</Label>
              <div className="flex gap-2">
                <Input value={novaTarefa} onChange={(e) => setNovaTarefa(e.target.value)} placeholder="Ligar para…" />
                <Input type="datetime-local" value={novaData} onChange={(e) => setNovaData(e.target.value)} className="w-48" />
                <Button size="sm" onClick={addTarefa}><Plus className="h-4 w-4"/></Button>
              </div>
              <ul className="mt-2 space-y-1">
                {tarefas.map((t) => {
                  const venc = t.data_vencimento && !t.concluida && new Date(t.data_vencimento) < new Date();
                  return (
                    <li key={t.id} className={`flex items-center gap-2 text-sm p-2 rounded ${venc ? "bg-destructive/10" : "bg-muted/40"}`}>
                      <Checkbox checked={t.concluida} onCheckedChange={() => toggleTarefa(t)} />
                      <span className={`flex-1 ${t.concluida ? "line-through text-muted-foreground" : ""}`}>{t.titulo}</span>
                      {t.data_vencimento && (
                        <span className="text-xs text-muted-foreground">
                          {new Date(t.data_vencimento).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })}
                        </span>
                      )}
                      <Button size="icon" variant="ghost" onClick={() => removeTarefa(t.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div>
              <Label className="text-xs">Comentários</Label>
              <ul className="space-y-1 max-h-40 overflow-y-auto">
                {coments.map((c) => (
                  <li key={c.id} className="text-sm bg-muted/40 rounded p-2">
                    <div>{c.texto}</div>
                    <div className="text-[10px] text-muted-foreground mt-1">
                      {new Date(c.created_at).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })}
                    </div>
                  </li>
                ))}
                {coments.length === 0 && <li className="text-xs text-muted-foreground">Nenhum comentário.</li>}
              </ul>
            </div>

            <div>
              <Label className="text-xs">Histórico</Label>
              <ul className="space-y-1 max-h-32 overflow-y-auto text-xs text-muted-foreground">
                {hist.map((h) => (
                  <li key={h.id}>
                    • {h.descricao || h.tipo} — {new Date(h.created_at).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Coluna direita: dados */}
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Responsável</Label>
              <Select
                value={n.responsavel_id ?? "__none__"}
                onValueChange={(v) => patchN({ responsavel_id: v === "__none__" ? null : v })}
                disabled={!canEdit}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">Sem responsável</SelectItem>
                  {vendedoresElegiveis.map((v) => (
                    <SelectItem key={v.user_id} value={v.user_id}>{v.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="rounded-md border bg-muted/30 p-2 text-xs space-y-1">
              <div className="text-muted-foreground">Mensagem recebida no WhatsApp</div>
              {n.destino_whatsapp ? (
                <>
                  <div className="font-medium text-foreground">
                    {destinoInfo?.formatado || n.destino_whatsapp}
                    {destinoInfo?.nome && <span className="text-muted-foreground"> — {destinoInfo.nome}</span>}
                  </div>
                  {canEdit && destinoInfo?.user_id && destinoInfo.user_id !== n.responsavel_id && (
                    <Button size="sm" variant="outline" className="h-7 text-xs" onClick={atribuirDoDestino}>
                      <UserCheck className="h-3 w-3 mr-1" /> Atribuir a {destinoInfo.nome}
                    </Button>
                  )}
                  {destinoInfo && !destinoInfo.user_id && (
                    <div className="text-muted-foreground">Este número não tem vendedor vinculado.</div>
                  )}
                </>
              ) : (
                <div className="text-muted-foreground">Não identificado (lead antigo ou entrada manual).</div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Valor</Label>
                <Input
                  type="number" step="0.01" value={n.valor ?? ""}
                  disabled={!canEdit}
                  onChange={(e) => setN({ ...n, valor: e.target.value ? Number(e.target.value) : null })}
                  onBlur={() => patchN({ valor: n.valor })}
                />
                <div className="text-[11px] text-muted-foreground">{brl(n.valor)}</div>
              </div>
              <div>
                <Label className="text-xs">Material</Label>
                <Input value={n.material ?? ""} disabled={!canEdit}
                  onChange={(e) => setN({ ...n, material: e.target.value })}
                  onBlur={() => patchN({ material: n.material })} />
              </div>
            </div>
            <div>
              <Label className="text-xs">Produto</Label>
              <Input value={n.produto ?? ""} disabled={!canEdit}
                onChange={(e) => setN({ ...n, produto: e.target.value })}
                onBlur={() => patchN({ produto: n.produto })} />
            </div>
            <div>
              <Label className="text-xs">Tags (separadas por vírgula)</Label>
              <Input value={n.tags.join(", ")} disabled={!canEdit}
                onChange={(e) => setN({ ...n, tags: e.target.value.split(",").map((x) => x.trim()).filter(Boolean) })}
                onBlur={() => patchN({ tags: n.tags })} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Telefone</Label>
                <Input value={n.telefone ?? ""} disabled={!canEdit}
                  onChange={(e) => setN({ ...n, telefone: e.target.value })}
                  onBlur={() => patchN({ telefone: n.telefone })} />
              </div>
              <div>
                <Label className="text-xs">E-mail</Label>
                <Input value={n.email ?? ""} disabled={!canEdit}
                  onChange={(e) => setN({ ...n, email: e.target.value })}
                  onBlur={() => patchN({ email: n.email })} />
              </div>
            </div>
            <div>
              <Label className="text-xs">Mensagem</Label>
              <Textarea value={n.mensagem ?? ""} disabled={!canEdit} rows={2}
                onChange={(e) => setN({ ...n, mensagem: e.target.value })}
                onBlur={() => patchN({ mensagem: n.mensagem })} />
            </div>
            <div className="text-[11px] text-muted-foreground pt-2 border-t space-y-0.5">
              <div>Criado: {new Date(n.created_at).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })}</div>
              {(n.utm_source || n.utm_campaign) && (
                <div>UTM: {[n.utm_source, n.utm_medium, n.utm_campaign, n.utm_term].filter(Boolean).join(" / ")}</div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}