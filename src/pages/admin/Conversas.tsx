import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "./AdminLayout";
import { ConversaChat, type Conversa } from "./components/conversas/ConversaChat";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessageCircle, Plus, Search, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

function fmtData(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit",
  });
}

export default function Conversas() {
  const [conversas, setConversas] = useState<Conversa[]>([]);
  const [selecionada, setSelecionada] = useState<Conversa | null>(null);
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);
  const [novaAberta, setNovaAberta] = useState(false);
  const [novoTelefone, setNovoTelefone] = useState("");
  const [novoNome, setNovoNome] = useState("");
  const [criando, setCriando] = useState(false);

  const carregar = async () => {
    const { data, error } = await supabase
      .from("whatsapp_conversas")
      .select("*")
      .order("ultima_mensagem_em", { ascending: false, nullsFirst: false });
    if (error) toast.error(error.message);
    setConversas((data as Conversa[]) || []);
    setLoading(false);
  };

  useEffect(() => { carregar(); }, []);

  // Realtime: conversas novas/atualizadas
  useEffect(() => {
    const canal = supabase
      .channel("wa-conversas")
      .on("postgres_changes", { event: "*", schema: "public", table: "whatsapp_conversas" }, () => carregar())
      .subscribe();
    return () => { supabase.removeChannel(canal); };
  }, []);

  const filtradas = useMemo(() => {
    const q = busca.trim().toLowerCase();
    if (!q) return conversas;
    return conversas.filter((c) =>
      (c.nome_contato || "").toLowerCase().includes(q) || c.telefone.includes(q.replace(/\D/g, "")),
    );
  }, [conversas, busca]);

  const criarConversa = async () => {
    const tel = novoTelefone.replace(/\D/g, "");
    if (tel.length < 12) { toast.error("Informe o número com DDI e DDD, ex: 5521999998888"); return; }
    setCriando(true);
    // Conversa nova: janela fechada, então o primeiro contato precisa ser por
    // mensagem pronta — o envio em si acontece na tela da conversa.
    const { data, error } = await supabase.functions.invoke("whatsapp-send", {
      body: { telefone: tel, tipo: "text", texto: "__noop__" },
    });
    setCriando(false);
    // Se a janela estiver fechada (esperado), a função devolve 422 mas já criou a conversa
    if (error) {
      const { data: existente } = await supabase
        .from("whatsapp_conversas").select("*").eq("telefone", tel).maybeSingle();
      if (existente) {
        if (novoNome.trim()) {
          await supabase.from("whatsapp_conversas").update({ nome_contato: novoNome.trim() }).eq("id", existente.id);
        }
        await carregar();
        setSelecionada(existente as Conversa);
        setNovaAberta(false); setNovoTelefone(""); setNovoNome("");
        toast.success("Conversa criada. Envie uma mensagem pronta para iniciar o contato.");
        return;
      }
      toast.error("Não foi possível criar a conversa.");
      return;
    }
    await carregar();
    if ((data as any)?.conversa_id) {
      const { data: conv } = await supabase.from("whatsapp_conversas").select("*").eq("id", (data as any).conversa_id).single();
      if (conv) setSelecionada(conv as Conversa);
    }
    setNovaAberta(false); setNovoTelefone(""); setNovoNome("");
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <MessageCircle className="h-6 w-6" /> Conversas WhatsApp
        </h1>
        <Button size="sm" onClick={() => setNovaAberta(true)}>
          <Plus className="h-4 w-4 mr-1" /> Nova conversa
        </Button>
      </div>

      <div className="grid md:grid-cols-[320px_1fr] gap-4 h-[calc(100vh-180px)] min-h-[400px]">
        {/* Lista */}
        <div className="border rounded-lg flex flex-col min-h-0">
          <div className="p-2 border-b">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar nome ou número…"
                className="pl-8 h-9"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading && <div className="p-6 flex justify-center"><Loader2 className="animate-spin h-5 w-5" /></div>}
            {!loading && filtradas.length === 0 && (
              <p className="p-4 text-sm text-muted-foreground">Nenhuma conversa ainda.</p>
            )}
            {filtradas.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelecionada(c)}
                className={`w-full text-left px-3 py-2.5 border-b hover:bg-muted/50 transition ${
                  selecionada?.id === c.id ? "bg-muted" : ""
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-sm truncate">
                    {c.nome_contato || c.telefone}
                  </span>
                  <span className="text-[10px] text-muted-foreground shrink-0">{fmtData(c.ultima_mensagem_em)}</span>
                </div>
                <div className="flex items-center justify-between gap-2 mt-0.5">
                  <span className="text-xs text-muted-foreground truncate">{c.ultima_mensagem || "—"}</span>
                  {c.nao_lidas > 0 && (
                    <span className="bg-primary text-primary-foreground text-[10px] rounded-full px-1.5 py-0.5 shrink-0">
                      {c.nao_lidas}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat */}
        <div className="border rounded-lg p-3 flex flex-col min-h-0">
          {selecionada ? (
            <>
              <div className="pb-2 border-b mb-2">
                <div className="font-semibold">{selecionada.nome_contato || selecionada.telefone}</div>
                <div className="text-xs text-muted-foreground">{selecionada.telefone}</div>
              </div>
              <ConversaChat
                conversa={selecionada}
                onMarcarLida={() => {
                  setConversas((prev) => prev.map((c) => (c.id === selecionada.id ? { ...c, nao_lidas: 0 } : c)));
                }}
              />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
              Selecione uma conversa à esquerda.
            </div>
          )}
        </div>
      </div>

      {/* Nova conversa */}
      <Dialog open={novaAberta} onOpenChange={setNovaAberta}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Nova conversa</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Número com DDI e DDD</Label>
              <Input
                value={novoTelefone}
                onChange={(e) => setNovoTelefone(e.target.value)}
                placeholder="5521999998888"
              />
            </div>
            <div>
              <Label className="text-xs">Nome do contato (opcional)</Label>
              <Input value={novoNome} onChange={(e) => setNovoNome(e.target.value)} placeholder="Nome do cliente" />
            </div>
            <p className="text-xs text-muted-foreground">
              O primeiro contato com um número novo precisa ser uma <strong>mensagem pronta</strong> aprovada pela Meta.
            </p>
            <Button onClick={criarConversa} disabled={criando} className="w-full">
              {criando ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
              Criar conversa
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
