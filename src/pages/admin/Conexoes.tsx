import { useCallback, useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { ConfiguracoesLayout } from "./components/ConfiguracoesLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, QrCode, RefreshCw, Smartphone, Trash2, Unplug } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getEquipe, type MembroEquipe } from "@/lib/adminCache";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { acaoConexao, atualizarConexao, criarConexao } from "@/lib/uzapi.functions";
import { toast } from "sonner";

type Inst = { id: string; nome: string; user_id: string | null; telefone: string | null; status: string; qr_code: string | null; ultimo_erro: string | null };

const STATUS: Record<string, { label: string; cls: string }> = {
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

  const carregar = useCallback(async () => {
    const { data, error } = await supabase.from("whatsapp_instancias").select("id,nome,user_id,telefone,status,qr_code,ultimo_erro").order("created_at");
    if (error) toast.error(error.message);
    setLista((data as Inst[]) ?? []);
  }, []);

  useEffect(() => { carregar(); getEquipe().then(setEquipe).catch(() => {}); }, [carregar]);

  const qrInst = lista.find((i) => i.id === qrId) ?? null;
  // Enquanto o QR estiver aberto, consulta a Uzapi a cada 4s até conectar.
  useEffect(() => {
    if (!qrId) return;
    let ativo = true;
    const tick = async () => { await atualizarConexao({ data: { id: qrId } }).catch(() => {}); if (ativo) await carregar(); };
    tick();
    const t = window.setInterval(tick, 4000);
    return () => { ativo = false; window.clearInterval(t); };
  }, [qrId, carregar]);
  useEffect(() => {
    if (qrInst?.status === "conectado") { toast.success(`${qrInst.nome} conectado!`); setQrId(null); }
  }, [qrInst?.status, qrInst?.nome]);

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

  return (
    <ConfiguracoesLayout active="conexoes">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">Conexões WhatsApp</h2>
          <p className="text-sm text-muted-foreground">Cada vendedor conecta o próprio número pelo QR Code. Toda a equipe pode atender por qualquer número.</p>
        </div>
        {gestor && <Button onClick={() => setNovo(true)}><Plus className="h-4 w-4" /> Nova conexão</Button>}
      </div>

      {lista.length === 0 ? (
        <div className="rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">
          <Smartphone className="mx-auto mb-2 h-8 w-8" /> Nenhum número conectado ainda.
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {lista.map((i) => {
            const st = STATUS[i.status] ?? { label: "Criando…", cls: "bg-muted text-muted-foreground" };
            return (
              <div key={i.id} className="rounded-lg border bg-card p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{i.nome}</p>
                    <p className="text-sm text-muted-foreground">{fmtTel(i.telefone)}</p>
                  </div>
                  <Badge variant="outline" className={`border-0 ${st.cls}`}>{st.label}</Badge>
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
                  <div className="mt-3 flex flex-wrap gap-2">
                    {i.status !== "conectado" && <Button size="sm" onClick={() => setQrId(i.id)}><QrCode className="h-4 w-4" /> Ler QR Code</Button>}
                    {i.status === "conectado" && <Button size="sm" variant="outline" onClick={() => acao(i.id, "desconectar")}><Unplug className="h-4 w-4" /> Desconectar</Button>}
                    <Button size="sm" variant="ghost" onClick={() => acao(i.id, "reiniciar")}><RefreshCw className="h-4 w-4" /> Reiniciar</Button>
                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => acao(i.id, "excluir")} aria-label="Excluir conexão"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

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
            {qrInst?.qr_code ? <QrView valor={qrInst.qr_code} /> : (
              <div className="text-center text-sm text-muted-foreground"><Loader2 className="mx-auto mb-2 h-6 w-6 animate-spin" />Gerando QR Code…{qrInst?.ultimo_erro && <p className="mt-2 text-destructive">{qrInst.ultimo_erro}</p>}</div>
            )}
          </div>
          <p className="text-center text-xs text-muted-foreground">O código se atualiza sozinho. Esta janela fecha quando o número conectar.</p>
        </DialogContent>
      </Dialog>
    </ConfiguracoesLayout>
  );
}
