import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getEquipe } from "@/lib/adminCache";
import { whatsappSend } from "@/lib/whatsapp-send.functions";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Check, X, Trash2, Plus, UserCheck, MessageCirclePlus, Link2, MessageCircle, History, RotateCcw, ListTodo, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { ETAPAS, brl, type EtapaId, type Negociacao, type VendedorLite } from "./types";
import { usePermissions } from "@/hooks/usePermissions";
import { type Conversa } from "../conversas/ConversaChat";
import { useNavigate } from "@/lib/router-compat";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { tagDef, tagsDe, useEtiquetas } from "../conversas/tags";
import { confirmacaoEtapa, statusDaEtapa } from "./negociacaoStatus";

interface Props {
  negociacao: Negociacao | null;
  vendedores: VendedorLite[];
  numeroMap?: Record<string, { user_id: string | null; nome: string; formatado: string }>;
  onClose: () => void;
  onChanged: () => void;
  onRequestGanho?: (n: Negociacao) => void;
}

interface Tarefa { id: string; titulo: string; data_vencimento: string | null; concluida: boolean; created_by: string | null; }
interface Comentario { id: string; texto: string; autor_id: string | null; created_at: string; }
interface Hist { id: string; autor_id: string | null; tipo: string; descricao: string | null; created_at: string; }

interface ProdutoLite { id: string; nome: string; material: string | null; }

export function NegociacaoModal({ negociacao, vendedores, numeroMap = {}, onClose, onChanged, onRequestGanho }: Props) {
  const { can, user } = usePermissions();
  const userId = user?.id ?? null;
  const [formAberto, setFormAberto] = useState<"tarefa" | "comentario" | null>(null);
  const [n, setN] = useState<Negociacao | null>(negociacao);
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [coments, setComents] = useState<Comentario[]>([]);
  const [hist, setHist] = useState<Hist[]>([]);
  const [novoComent, setNovoComent] = useState("");
  const [novaTarefa, setNovaTarefa] = useState("");
  const [novaData, setNovaData] = useState("");
  const [produtos, setProdutos] = useState<ProdutoLite[]>([]);
  const [conversa, setConversa] = useState<Conversa | null>(null);
  const navigate = useNavigate();
  const etiquetas = useEtiquetas();
  const [nomesEquipe, setNomesEquipe] = useState<Record<string, string>>({});
  const [salvandoEtapa, setSalvandoEtapa] = useState(false);
  useEffect(() => { getEquipe().then((data) => setNomesEquipe(Object.fromEntries((data).map((u) => [u.id, u.nome])))); }, []);

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
  useEffect(() => {
    supabase.from("produtos").select("id,nome,material").eq("ativo", true).order("nome")
      .then(({ data }) => setProdutos((data as ProdutoLite[]) || []));
  }, []);

  // Localiza a conversa WhatsApp: primeiro pelo vínculo, depois pelo telefone
  const [semVinculo, setSemVinculo] = useState<Conversa[]>([]);
  const [vincSel, setVincSel] = useState("");
  const [vinculando, setVinculando] = useState(false);
  const buscarConversa = async () => {
    setConversa(null);
    if (!negociacao) return;
    const { data: porNeg } = await supabase.from("whatsapp_conversas").select("*").eq("negociacao_id", negociacao.id).limit(1);
    if (porNeg?.[0]) { setConversa(porNeg[0] as Conversa); return; }
    const d = (negociacao.telefone || "").replace(/\D/g, "");
    if (d.length >= 10) {
      const normalizado = d.startsWith("55") && d.length > 11 ? d.slice(2) : d;
      const { data } = await supabase.from("whatsapp_conversas").select("*").limit(500);
      const c = (data as Conversa[] | null)?.find((item) => {
        const telefone = item.telefone.replace(/\D/g, "");
        const telefoneNormalizado = telefone.startsWith("55") && telefone.length > 11 ? telefone.slice(2) : telefone;
        return telefoneNormalizado === normalizado;
      });
      if (c) {
        const { data: vinculada, error } = await supabase.from("whatsapp_conversas").update({ negociacao_id: negociacao.id }).eq("id", c.id).select("*").single();
        if (!error && vinculada) setConversa(vinculada as Conversa);
        if (!error) onChanged();
        return;
      }
    }
    const { data: livres } = await supabase.from("whatsapp_conversas").select("*").is("negociacao_id", null)
      .order("ultima_mensagem_em", { ascending: false, nullsFirst: false }).limit(100);
    setSemVinculo((livres as Conversa[]) || []);
  };
  useEffect(() => { buscarConversa(); }, [negociacao?.id, negociacao?.telefone]);

  const vincularExistente = async () => {
    if (!negociacao || !vincSel) return;
    setVinculando(true);
    const { error } = await supabase.from("whatsapp_conversas").update({ negociacao_id: negociacao.id }).eq("id", vincSel);
    setVinculando(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Chat vinculado"); setVincSel(""); buscarConversa(); onChanged();
  };
  const abrirNovoChat = async () => {
    if (!negociacao) return;
    let tel = (negociacao.telefone || "").replace(/\D/g, "");
    if (tel.length >= 10 && !tel.startsWith("55")) tel = `55${tel}`;
    if (tel.length < 12) { toast.error("Cadastre o telefone com DDD na negociação primeiro."); return; }
    setVinculando(true);
    const { data, error } = await whatsappSend({
      body: { telefone: tel, tipo: "text", criar_apenas: true, nome_contato: negociacao.nome_cliente },
    });
    const conv = (data as { conversa?: Conversa } | null)?.conversa;
    if (!error && conv) await supabase.from("whatsapp_conversas").update({ negociacao_id: negociacao.id }).eq("id", conv.id);
    setVinculando(false);
    if (error || !conv) { toast.error("Não foi possível abrir o chat."); return; }
    toast.success("Chat aberto e vinculado"); buscarConversa(); onChanged();
  };

  if (!n) return null;
  const tarefasOrdenadas = [...tarefas].sort((a, b) => {
    const da = a.data_vencimento ? new Date(a.data_vencimento).getTime() : Infinity;
    const db = b.data_vencimento ? new Date(b.data_vencimento).getTime() : Infinity;
    return da - db;
  });
  const canEdit = can("negociacoes", "edit", n.responsavel_id);
  const canDelete = can("negociacoes", "delete", n.responsavel_id);

  const patchN = async (patch: Partial<Negociacao>) => {
    if (!canEdit || salvandoEtapa) return;
    const etapa = patch.etapa;
    if (etapa) setSalvandoEtapa(true);
    const dados = etapa ? { ...patch, status: statusDaEtapa(etapa) } : patch;
    try {
      const { data, error } = await supabase.from("negociacoes").update(dados).eq("id", n.id).select("*").single();
      if (error) throw error;
      setN(data as Negociacao);
      if (etapa) {
        toast.success(confirmacaoEtapa(etapa, n.status));
        const { data: historico } = await supabase.from("negociacao_historico").select("*").eq("negociacao_id", n.id).order("created_at", { ascending: false });
        if (historico) setHist(historico as Hist[]);
      }
      onChanged();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível salvar a negociação");
    } finally {
      if (etapa) setSalvandoEtapa(false);
    }
  };

  const addTarefa = async () => {
    if (!novaTarefa.trim()) return;
    const { data, error } = await supabase.from("negociacao_tarefas").insert({
      negociacao_id: n.id, titulo: novaTarefa.trim(),
      data_vencimento: novaData ? new Date(novaData).toISOString() : null,
      created_by: userId,
    }).select().single();
    if (error) { toast.error(error.message); return; }
    setTarefas((p) => [...p, data as Tarefa]);
    setNovaTarefa(""); setNovaData(""); setFormAberto(null);
    toast.success("Tarefa criada");
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

  // Produtos filtrados pelo material atual
  const produtosDoMaterial = n.material
    ? produtos.filter((p) => (p.material || "").toLowerCase() === (n.material || "").toLowerCase())
    : produtos;

  const irParaVenda = () => {
    if (onRequestGanho) onRequestGanho(n);
  };

  return (
    <Dialog open={!!negociacao} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="h-[92vh] max-h-[92vh] w-[94vw] max-w-[1180px] overflow-y-auto p-0">
        <div className="sticky top-0 z-10 border-b bg-background px-5 py-4">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle className="text-xl flex-1">{n.nome_cliente}</DialogTitle>
            <Button size="sm" variant="outline" className="border-primary/30 bg-primary/10 text-primary hover:bg-primary/15" onClick={() => setFormAberto((f) => f === "tarefa" ? null : "tarefa")}>
              <ListTodo className="h-4 w-4 mr-1" /> Nova tarefa
            </Button>
            <Button size="sm" variant="outline" className="border-gold/40 bg-gold/15 text-foreground hover:bg-gold/25" onClick={() => setFormAberto((f) => f === "comentario" ? null : "comentario")}>
              <MessageSquare className="h-4 w-4 mr-1" /> Novo comentário
            </Button>
            {conversa ? (
              <Button size="icon" variant="ghost" className="relative text-whatsapp" title="Ir para conversa" aria-label="Ir para conversa" onClick={() => navigate(`/admin/conversas?conversa=${conversa.id}`)}>
                <MessageCircle className="h-5 w-5" />
                {conversa.nao_lidas > 0 && <span className="absolute -right-0.5 -top-0.5 min-w-[14px] rounded-full bg-accent px-1 text-[9px] font-bold leading-[14px] text-accent-foreground">{conversa.nao_lidas}</span>}
              </Button>
            ) : (
              <Popover>
                <PopoverTrigger asChild>
                  <Button size="icon" variant="ghost" className="text-muted-foreground" title="Abrir ou vincular conversa" aria-label="Abrir ou vincular conversa"><MessageCirclePlus className="h-5 w-5" /></Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-80 space-y-2 p-3">
                  <p className="text-xs text-muted-foreground">Esta negociação ainda não tem chat vinculado.</p>
                  <Button size="sm" className="w-full" onClick={abrirNovoChat} disabled={vinculando}>
                    <MessageCirclePlus className="h-4 w-4 mr-1" /> Abrir chat com {n.telefone || "o cliente"}
                  </Button>
                  {semVinculo.length > 0 && (
                    <div className="flex gap-2">
                      <Select value={vincSel} onValueChange={setVincSel}>
                        <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Ou vincular conversa existente…" /></SelectTrigger>
                        <SelectContent>
                          {semVinculo.map((c) => (
                            <SelectItem key={c.id} value={c.id}>{c.nome_contato ? `${c.nome_contato} · ${c.telefone}` : c.telefone}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button size="sm" variant="outline" onClick={vincularExistente} disabled={!vincSel || vinculando}><Link2 className="h-4 w-4" /></Button>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            )}
            {canEdit && (
              <>
                {n.status !== "aberto" && <Button size="sm" variant="outline" disabled={salvandoEtapa} onClick={() => patchN({ etapa: "negociacao" })}><RotateCcw className="h-4 w-4 mr-1" /> Reabrir</Button>}
                <Button size="sm" variant="outline" className="text-accent" disabled={salvandoEtapa || n.status === "ganho"} onClick={irParaVenda}>
                  <Check className="h-4 w-4 mr-1" /> Ganho
                </Button>
                <Button size="sm" variant="outline" className="text-destructive" disabled={salvandoEtapa || n.status === "perdido"} onClick={() => patchN({ etapa: "perdido" })}>
                  <X className="h-4 w-4 mr-1" /> Perdido
                </Button>
              </>
            )}
            {canDelete && (
              <Button size="icon" variant="ghost" className="border border-transparent hover:border-destructive/30" title="Excluir negociação" aria-label="Excluir negociação" onClick={removerNegociacao}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            )}
            <div className="ml-1 h-6 w-px bg-border" />
            <Button size="icon" variant="outline" className="rounded-full" title="Fechar" aria-label="Fechar negociação" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            {n.telefone && <span>{n.telefone}</span>}
            <span className={`px-2 py-0.5 rounded-full text-xs border ${
              n.status === "ganho" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30" :
              n.status === "perdido" ? "bg-destructive/10 text-destructive border-destructive/30" :
              "bg-muted text-foreground"
            }`}>Status: {n.status}</span>
          </div>
        </DialogHeader>

        {/* Barra de etapas */}
        <div className="mt-3 grid grid-cols-3 overflow-hidden rounded-md border sm:grid-cols-6">
          {ETAPAS.map((e) => (
            <button
              key={e.id}
              disabled={!canEdit || salvandoEtapa}
              onClick={() => {
                if (e.id === "venda_realizada" && n.etapa !== "venda_realizada") {
                  irParaVenda();
                  return;
                }
                patchN({ etapa: e.id as EtapaId });
              }}
              className={`border-r px-2 py-2 text-[10px] font-semibold uppercase transition ${
                n.etapa === e.id ? "bg-primary text-primary-foreground" : "bg-muted/40 hover:bg-muted"
              } disabled:opacity-60`}
            >
              {e.label}
            </button>
          ))}
        </div>
        </div>

        <div className="grid min-h-0 lg:grid-cols-[minmax(0,1fr)_300px]">
          {/* Coluna esquerda: tarefas + comentarios + historico */}
          <div className="space-y-5 p-5">
            {formAberto === "tarefa" && (
              <div className="rounded-md border border-primary/30 bg-primary/5 p-3">
                <Label className="text-xs">Nova tarefa</Label>
                <div className="flex gap-2">
                  <Input autoFocus value={novaTarefa} onChange={(e) => setNovaTarefa(e.target.value)} placeholder="Ligar para…" onKeyDown={(e) => { if (e.key === "Enter") addTarefa(); }} />
                  <Input type="datetime-local" value={novaData} onChange={(e) => setNovaData(e.target.value)} className="w-48" />
                  <Button size="sm" onClick={addTarefa} disabled={!novaTarefa.trim()}>Salvar</Button>
                </div>
              </div>
            )}
            {formAberto === "comentario" && (
              <div className="rounded-md border border-gold/40 bg-gold/10 p-3">
                <Label className="text-xs">Novo comentário</Label>
                <Textarea autoFocus value={novoComent} onChange={(e) => setNovoComent(e.target.value)} rows={2} placeholder="Escreva uma nota interna…" />
                <div className="flex justify-end mt-1">
                  <Button size="sm" onClick={addComent} disabled={!novoComent.trim()}>Adicionar</Button>
                </div>
              </div>
            )}

            <div>
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold"><ListTodo className="h-4 w-4 text-primary" /> Tarefas ({tarefas.length})</div>
              <ul className="space-y-1">
                {tarefasOrdenadas.map((t) => {
                  const venc = !!t.data_vencimento && !t.concluida && new Date(t.data_vencimento) < new Date();
                  return (
                    <li key={t.id} className={`flex items-center gap-2 text-sm p-2 rounded border ${venc ? "border-destructive/30 bg-destructive/10 text-destructive" : "border-transparent bg-muted/40"}`}>
                      <Checkbox checked={t.concluida} onCheckedChange={() => toggleTarefa(t)} />
                      <span className={`flex-1 ${t.concluida ? "line-through" : ""}`}>{t.titulo}</span>
                      <span className={`text-xs ${venc ? "font-semibold" : "text-muted-foreground"}`}>
                        {venc && "Atrasada · "}
                        {t.data_vencimento ? new Date(t.data_vencimento).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo", day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "Sem prazo"}
                      </span>
                      {t.created_by && t.created_by === userId && (
                        <Button size="icon" variant="ghost" className="h-7 w-7" title="Excluir tarefa" onClick={() => removeTarefa(t.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </li>
                  );
                })}
                {tarefas.length === 0 && <li className="text-xs text-muted-foreground">Nenhuma tarefa.</li>}
              </ul>
            </div>

            <div>
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold"><MessageSquare className="h-4 w-4 text-gold" /> Comentários ({coments.length})</div>
              <ul className="space-y-1 max-h-60 overflow-y-auto">
                {coments.map((c) => (
                  <li key={c.id} className="text-sm bg-muted/40 rounded p-2">
                    <div className="text-[11px] text-muted-foreground mb-0.5">
                      <span className="font-semibold text-foreground/80">{c.autor_id ? nomesEquipe[c.autor_id] || "Usuário" : "Sistema"}</span>
                      {" · "}
                      {new Date(c.created_at).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo", day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </div>
                    <div className="whitespace-pre-wrap">{c.texto}</div>
                  </li>
                ))}
                {coments.length === 0 && <li className="text-xs text-muted-foreground">Nenhum comentário.</li>}
              </ul>
            </div>

            <div className="rounded-md border bg-muted/30 p-3">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold"><History className="h-4 w-4 text-primary" /> Histórico</div>
              <ol className="relative max-h-56 space-y-2.5 overflow-y-auto border-l-2 border-primary/30 pl-4">
                {hist.map((h) => (
                  <li key={h.id} className="relative text-sm">
                    <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-primary" />
                    <div className="flex items-baseline gap-3">
                      <p className="min-w-0 flex-1 truncate font-medium" title={h.descricao || h.tipo}>{h.descricao || h.tipo}</p>
                      <p className="shrink-0 whitespace-nowrap text-right text-[11px] text-muted-foreground">
                        <span className="font-semibold text-foreground/80">{h.autor_id ? nomesEquipe[h.autor_id] || "Usuário" : "Sistema (automático)"}</span>
                        {" · "}
                        {new Date(h.created_at).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo", day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </li>
                ))}
                {hist.length === 0 && <li className="text-xs text-muted-foreground">Sem histórico.</li>}
              </ol>
            </div>
          </div>

          {/* Coluna direita: dados */}
          <div className="space-y-3 border-l bg-muted/20 p-4">
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
                <Select value={n.material ?? ""} onValueChange={(v) => patchN({ material: v })} disabled={!canEdit}>
                  <SelectTrigger><SelectValue placeholder="Selecione…" /></SelectTrigger>
                  <SelectContent>
                    {Array.from(new Set([...(n.material ? [n.material] : []), ...produtos.map((p) => p.material).filter((m): m is string => !!m)])).map((m) => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-xs">Produto</Label>
              <Select
                value={n.produto ?? ""}
                onValueChange={(v) => patchN({ produto: v })}
                disabled={!canEdit}
              >
                <SelectTrigger><SelectValue placeholder="Selecione um produto…" /></SelectTrigger>
                <SelectContent>
                  {produtosDoMaterial.map((p) => (
                    <SelectItem key={p.id} value={p.nome}>{p.nome}</SelectItem>
                  ))}
                  {produtosDoMaterial.length === 0 && (
                    <div className="px-2 py-1.5 text-xs text-muted-foreground">Nenhum produto cadastrado para este material.</div>
                  )}
                </SelectContent>
              </Select>
            </div>
            {n.status === "ganho" && (
              <div>
                <Label className="text-xs">Link PV do Bling</Label>
                <Input value={n.link_pv_bling ?? ""} disabled={!canEdit}
                  onChange={(e) => setN({ ...n, link_pv_bling: e.target.value })}
                  onBlur={() => patchN({ link_pv_bling: n.link_pv_bling })} />
                {n.link_pv_bling && (
                  <a href={n.link_pv_bling} target="_blank" rel="noopener noreferrer"
                    className="text-[11px] text-primary underline">Abrir pedido no Bling</a>
                )}
              </div>
            )}
            <div>
              <Label className="text-xs">Etiquetas</Label>
              <div className="mt-1 flex flex-wrap items-center gap-1">
                {n.tags.map((id) => { const t = tagDef(id, etiquetas); return (
                  <button key={id} type="button" disabled={!canEdit} onClick={() => patchN({ tags: n.tags.filter((x) => x !== id) })} className={`rounded border px-1.5 py-0.5 text-[10px] font-semibold ${t.className}`}>{t.label}{canEdit && " ×"}</button>
                ); })}
                {canEdit && (
                  <Popover>
                    <PopoverTrigger asChild><Button size="sm" variant="ghost" className="h-6 px-1.5 text-[11px]"><Plus className="h-3 w-3" /> Adicionar</Button></PopoverTrigger>
                    <PopoverContent align="start" className="max-h-64 w-60 overflow-y-auto p-2">
                      {tagsDe(etiquetas, "negociacao").map((t) => (
                        <Button key={t.id} variant="ghost" className="h-8 w-full justify-start" onClick={() => patchN({ tags: n.tags.includes(t.id) ? n.tags.filter((x) => x !== t.id) : [...n.tags, t.id] })}>
                          <span className={`rounded border px-1.5 py-0.5 text-[10px] ${t.className}`}>{t.label}</span>
                          {n.tags.includes(t.id) && <Check className="ml-auto h-4 w-4" />}
                        </Button>
                      ))}
                    </PopoverContent>
                  </Popover>
                )}
                {n.tags.length === 0 && !canEdit && <span className="text-xs text-muted-foreground">Nenhuma</span>}
              </div>
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
              <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-0.5">
                <div><span className="font-medium text-foreground">utm_source:</span> {n.utm_source || "—"}</div>
                <div><span className="font-medium text-foreground">utm_medium:</span> {n.utm_medium || "—"}</div>
                <div><span className="font-medium text-foreground">utm_campaign:</span> {n.utm_campaign || "—"}</div>
                <div><span className="font-medium text-foreground">utm_term:</span> {n.utm_term || "—"}</div>
                <div className="col-span-2"><span className="font-medium text-foreground">utm_content:</span> {n.utm_content || "—"}</div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
