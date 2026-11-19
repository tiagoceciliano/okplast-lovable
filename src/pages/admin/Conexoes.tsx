import { useCallback, useEffect, useState, type ReactNode } from "react";
import QRCode from "react-qr-code";
import { ConfiguracoesLayout } from "./components/ConfiguracoesLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Loader2, Plus, Power, QrCode, RefreshCw, RotateCw, Smartphone, Trash2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { getEquipe, type MembroEquipe } from "@/lib/adminCache";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { acaoConexao, atualizarConexao, autenticarConexao, criarConexao, importarConexoesUnotalk } from "@/lib/uzapi.functions";
import { toast } from "sonner";

type Inst = { id: string; nome: string; user_id: string | null; telefone: string | null; status: string; qr_code: string | null; ultimo_erro: string | null };

const STATUS: Record<string, { label: string; cls: string }> = {
  pausado: { label: "Pausada no UnoTalk", cls: "bg-muted text-muted-foreground" },
  conectado: { label: "Conectado", cls: "bg-emerald-500/15 text-emerald-700" },
  aguardando_qr: { label: "Aguardando QR Code", cls: "bg-amber-500/20 text-amber-700" },
  desconectado: { label: "Desconectado", cls: "bg-destructive/10 text-destructive" },
  pendente: { label: "Criando…", cls: "bg-muted text-muted-foreground" },
  erro: { label: "Erro", cls: "bg-destructive/10 text-destructive" },
};

const fmtTel = (t: string | null) => {
  if (!t) return "Número ainda não conectado";
  const d = t.replace(/^55/, "");
  return d.length === 11 ? `+55 (${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}` : `+${t}`;
};

function QrView({ valor }: { valor: string }) {
  if (valor.startsWith("data:image") || /^[A-Za-z0-9+/=]{400,}$/.test(valor)) {
    const src = valor.startsWith("data:") ? valor : `data:image/png;base64,${valor}`;
    return <img src={src} alt="QR Code para conectar o WhatsApp" className="h-64 w-64" />;
  }
  return <div className="rounded-lg bg-card p-3"><QRCode value={valor} size={232} /></div>;
}

function AcaoIcon({ titulo, onClick, disabled, danger, children }: { titulo: string; onClick: () => void; disabled?: boolean; danger?: boolean; children: ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          aria-label={titulo}
          title={titulo}
          disabled={disabled}
          onClick={onClick}
          className={cn("h-8 w-8", danger && "text-destructive hover:text-destructive")}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top" className="text-xs">{titulo}</TooltipContent>
    </Tooltip>
  );
}

export default function Conexoes() {
  const { user } = useCurrentUser();
  const gestor = !!user?.roles.some((r) => r === "admin" || r === "gestor");
  const [lista, setLista] = useState<Inst[]>([]);
  const [equipe, setEquipe] = useState<MembroEquipe[]>([]);
  const [novo, setNovo] = useState(false);
  const [nome, setNome] = useState("");
  const [resp, setResp] = useState<string>("nenhum");
  const [salvando, setSalvando] = useState(false);
  const [qrId, setQrId] = useState<string | null>(null);
  const [detalheId, setDetalheId] = useState<string | null>(null);
  const [atualizandoId, setAtualizandoId] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    const { data, error } = await supabase.from("whatsapp_instancias").select("id,nome,user_id,telefone,status,qr_code,ultimo_erro").order("created_at");
    if (error) toast.error(error.message);
    setLista((data as Inst[]) ?? []);
  }, []);

  useEffect(() => { carregar(); getEquipe().then(setEquipe).catch(() => {}); }, [carregar]);

  const qrInst = lista.find((i) => i.id === qrId) ?? null;
  const [qrErro, setQrErro] = useState<string | null>(null);
  const [qrTentativa, setQrTentativa] = useState(0);
  const tentarNovamente = () => { setQrErro(null); setQrTentativa((n) => n + 1); };
  // Enquanto o QR estiver aberto, consulta a Uzapi a cada 4s até conectar.
  useEffect(() => {
    if (!qrId) return;
    let ativo = true;
    setQrErro(null);
    const inicio = Date.now();
    void autenticarConexao({ data: { id: qrId } }).catch((e) => {
      if (ativo) setQrErro(`Não foi possível iniciar a autenticação no UnoTalk. ${e instanceof Error ? e.message : ""}`.trim());
    });
    const tick = async () => {
      try { await atualizarConexao({ data: { id: qrId } }); }
      catch (e) { if (ativo) setQrErro(`Não foi possível consultar o status da conexão. ${e instanceof Error ? e.message : ""}`.trim()); }
      if (!ativo) return;
      await carregar();
      if (Date.now() - inicio > 90000) setQrErro((v) => v ?? "O QR Code demorou demais para carregar. Tente novamente.");
    };
    tick();
    const t = window.setInterval(tick, 4000);
    return () => { ativo = false; window.clearInterval(t); };
  }, [qrId, qrTentativa, carregar]);
  // Limpa o aviso de demora quando o QR chega.
  useEffect(() => { if (qrInst?.qr_code) setQrErro((v) => (v?.startsWith("O QR Code demorou") ? null : v)); }, [qrInst?.qr_code]);
  useEffect(() => {
    if (qrInst?.status === "conectado") { toast.success(`${qrInst.nome} conectado e ativo no UnoTalk!`); setQrId(null); }
  }, [qrInst?.status, qrInst?.nome]);
  // Fora do QR, confirma periodicamente o status das conexões ainda não ativas (ex.: Amanda e Allan).
  const pendentes = lista.filter((i) => i.status !== "conectado").map((i) => i.id).join(",");
  useEffect(() => {
    if (qrId || !pendentes) return;
    let ativo = true;
    const tick = async () => {
      const antes = new Map(lista.map((i) => [i.id, i.status]));
      await Promise.all(pendentes.split(",").map((id) => atualizarConexao({ data: { id } }).catch(() => {})));
      if (!ativo) return;
      const { data } = await supabase.from("whatsapp_instancias").select("id,nome,user_id,telefone,status,qr_code,ultimo_erro").order("created_at");
      if (!ativo || !data) return;
      (data as Inst[]).forEach((i) => { if (i.status === "conectado" && antes.get(i.id) !== "conectado") toast.success(`${i.nome} está ativo no UnoTalk`); });
      setLista(data as Inst[]);
    };
    const t = window.setInterval(tick, 15000);
    return () => { ativo = false; window.clearInterval(t); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendentes, qrId]);

  const criar = async () => {
    setSalvando(true);
    try {
      const r = await criarConexao({ data: { nome: nome.trim(), userId: resp === "nenhum" ? null : resp } });
      setNovo(false); setNome(""); setResp("nenhum");
      await carregar();
      setQrId(r.id);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Falha ao criar conexão");
      await carregar();
    } finally { setSalvando(false); }
  };

  const acao = async (id: string, a: "desconectar" | "reiniciar" | "excluir" | "responsavel", userId?: string | null) => {
    if (a === "excluir" && !window.confirm("Excluir esta conexão? As conversas continuam no sistema.")) return;
    try { await acaoConexao({ data: { id, acao: a, userId } }); toast.success("Feito"); await carregar(); if (a === "reiniciar") setQrId(id); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Falha"); }
  };

  const nomeDe = (id: string | null) => equipe.find((m) => m.id === id)?.nome ?? "Sem responsável";
  const detalhe = lista.find((i) => i.id === detalheId);
  const atualizar = async (id: string) => {
    setAtualizandoId(id);
    try {
      await atualizarConexao({ data: { id } });
      await carregar();
      setDetalheId(id);
    } catch (e) { toast.error(e instanceof Error ? e.message : "Falha ao atualizar instância"); }
    finally { setAtualizandoId(null); }
  };

  return (
    <ConfiguracoesLayout active="conexoes">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">Conexões WhatsApp</h2>
          <p className="text-sm text-muted-foreground">Cada vendedor conecta o próprio número pelo QR Code. Toda a equipe pode atender por qualquer número.</p>
        </div>
        {gestor && <div className="flex gap-2"><Button variant="outline" onClick={async () => { try { const r = await importarConexoesUnotalk(); toast.success(r.importadas.length ? `Importadas: ${r.importadas.join(", ")}` : "Nenhuma conexão da Amanda ou do Allan encontrada"); await carregar(); } catch (e) { toast.error(e instanceof Error ? e.message : "Falha ao importar"); } }}>Importar do UnoTalk</Button><Button onClick={() => setNovo(true)}><Plus className="h-4 w-4" /> Nova conexão</Button></div>}
      </div>

      {lista.length === 0 ? (
        <div className="rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">
          <Smartphone className="mx-auto mb-2 h-8 w-8" /> Nenhum número conectado ainda.
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {lista.map((i) => {
            const st = STATUS[i.status] ?? { label: "Criando…", cls: "bg-muted text-muted-foreground" };
            const ocupado = atualizandoId === i.id;
            return (
              <div key={i.id} className="rounded-lg border bg-card p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{i.nome}</p>
                    <p className="text-sm text-muted-foreground">{fmtTel(i.telefone)}</p>
                  </div>
                  <Badge variant="outline" className={`shrink-0 border-0 ${st.cls}`}>{st.label}</Badge>
                </div>
                <div className="mt-3">
                  <Label className="text-xs text-muted-foreground">Responsável pelo número</Label>
                  {gestor ? (
                    <Select value={i.user_id ?? "nenhum"} onValueChange={(v) => acao(i.id, "responsavel", v === "nenhum" ? null : v)}>
                      <SelectTrigger className="mt-1 h-9"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nenhum">Sem responsável</SelectItem>
                        {equipe.map((m) => <SelectItem key={m.id} value={m.id}>{m.nome}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  ) : <p className="text-sm">{nomeDe(i.user_id)}</p>}
                </div>
                {i.ultimo_erro && i.status !== "conectado" && <p className="mt-2 text-xs text-destructive">{i.ultimo_erro}</p>}
                {gestor && (
                  <TooltipProvider delayDuration={200}>
                    <div className="mt-3 flex items-center justify-end gap-1 border-t pt-2">
                      <AcaoIcon titulo="Visualizar Instância" onClick={() => setDetalheId(i.id)} disabled={ocupado}><Eye className="h-4 w-4" /></AcaoIcon>
                      <AcaoIcon titulo="Autenticar" onClick={() => setQrId(i.id)} disabled={ocupado}><QrCode className="h-4 w-4" /></AcaoIcon>
                      <AcaoIcon titulo="Desconectar / Resetar Sessão" disabled={ocupado} onClick={() => { if (window.confirm(`Desconectar / resetar a sessão de ${i.nome}? Será necessário autenticar novamente.`)) void acao(i.id, "desconectar"); }}><Power className="h-4 w-4" /></AcaoIcon>
                      <AcaoIcon titulo="Reiniciar Instância" onClick={() => acao(i.id, "reiniciar")} disabled={ocupado}><RotateCw className="h-4 w-4" /></AcaoIcon>
                      <AcaoIcon titulo="Atualizar Instância" onClick={() => atualizar(i.id)} disabled={ocupado}>{ocupado ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}</AcaoIcon>
                      <AcaoIcon titulo="Deletar Instância" danger onClick={() => acao(i.id, "excluir")} disabled={ocupado}><Trash2 className="h-4 w-4" /></AcaoIcon>
                    </div>
                  </TooltipProvider>
                )}
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={!!detalheId} onOpenChange={(open) => !open && setDetalheId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Visualizar Instância</DialogTitle><DialogDescription>{detalhe?.nome}</DialogDescription></DialogHeader>
          {detalhe && <dl className="space-y-3 text-sm">
            <div><dt className="text-muted-foreground">Número</dt><dd>{fmtTel(detalhe.telefone)}</dd></div>
            <div><dt className="text-muted-foreground">Status</dt><dd>{STATUS[detalhe.status]?.label ?? detalhe.status}</dd></div>
            <div><dt className="text-muted-foreground">Responsável pelo número</dt><dd>{nomeDe(detalhe.user_id)}</dd></div>
            {detalhe.ultimo_erro && <div><dt className="text-muted-foreground">Último erro</dt><dd className="break-words text-destructive">{detalhe.ultimo_erro}</dd></div>}
          </dl>}
        </DialogContent>
      </Dialog>

      <Dialog open={novo} onOpenChange={setNovo}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Nova conexão</DialogTitle><DialogDescription>Depois de criar, o QR Code aparece para escanear.</DialogDescription></DialogHeader>
          <div className="space-y-3">
            <div><Label htmlFor="cx-nome">Nome da conexão</Label><Input id="cx-nome" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex.: WhatsApp Allan" /></div>
            <div>
              <Label>Vendedor responsável</Label>
              <Select value={resp} onValueChange={setResp}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="nenhum">Sem responsável</SelectItem>
                  {equipe.map((m) => <SelectItem key={m.id} value={m.id}>{m.nome}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter><Button onClick={criar} disabled={salvando || nome.trim().length < 2}>{salvando && <Loader2 className="h-4 w-4 animate-spin" />} Criar e gerar QR Code</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!qrId} onOpenChange={(o) => !o && setQrId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Conectar {qrInst?.nome}</DialogTitle><DialogDescription>No celular: WhatsApp Business → Aparelhos conectados → Conectar aparelho, e aponte para o código.</DialogDescription></DialogHeader>
          <div className="flex min-h-64 items-center justify-center">
            {qrErro && !qrInst?.qr_code ? (
              <div className="space-y-3 text-center text-sm">
                <p className="font-medium text-destructive">Erro ao carregar o QR Code</p>
                <p className="text-muted-foreground">{qrErro}</p>
                <Button variant="outline" onClick={tentarNovamente}><RotateCw className="h-4 w-4" /> Tentar novamente</Button>
              </div>
            ) : qrInst?.qr_code ? (
              <div className="flex flex-col items-center gap-2">
                <QrView valor={qrInst.qr_code} />
                {qrErro && <div className="text-center text-xs text-destructive">{qrErro} <Button variant="link" size="sm" className="h-auto p-0" onClick={tentarNovamente}>Tentar novamente</Button></div>}
              </div>
            ) : (
              <div className="text-center text-sm text-muted-foreground"><Loader2 className="mx-auto mb-2 h-6 w-6 animate-spin" />Gerando QR Code…{qrInst?.ultimo_erro && <p className="mt-2 text-destructive">{qrInst.ultimo_erro}</p>}</div>
            )}
          </div>
          <p className="text-center text-xs text-muted-foreground">O código se atualiza sozinho. Esta janela fecha quando o número conectar.</p>
        </DialogContent>
      </Dialog>
    </ConfiguracoesLayout>
  );
}
