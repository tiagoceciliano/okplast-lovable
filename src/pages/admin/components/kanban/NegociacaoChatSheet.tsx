import { useEffect, useMemo, useState } from "react";
import { MessageCirclePlus, Link2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConversaChat, type Conversa } from "../conversas/ConversaChat";
import { toast } from "sonner";
import type { Negociacao } from "./types";

interface Props {
  negociacao: Negociacao | null;
  onClose: () => void;
  onChanged: () => void;
}

const digits = (value: string | null) => (value || "").replace(/\D/g, "").replace(/^55/, "");

export function NegociacaoChatSheet({ negociacao, onClose, onChanged }: Props) {
  const [conversa, setConversa] = useState<Conversa | null>(null);
  const [livres, setLivres] = useState<Conversa[]>([]);
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(false);

  const carregar = async () => {
    setConversa(null); setLivres([]);
    if (!negociacao) return;
    const { data: vinculada } = await supabase.from("whatsapp_conversas").select("*").eq("negociacao_id", negociacao.id).limit(1);
    if (vinculada?.[0]) { setConversa(vinculada[0] as Conversa); return; }
    const telefone = digits(negociacao.telefone);
    if (telefone.length >= 10) {
      const { data: candidatas } = await supabase.from("whatsapp_conversas").select("*").or(`telefone.eq.${telefone},telefone.eq.55${telefone}`).limit(1);
      if (candidatas?.[0]) { setLivres(candidatas as Conversa[]); return; }
    }
    const { data } = await supabase.from("whatsapp_conversas").select("*").is("negociacao_id", null).order("ultima_mensagem_em", { ascending: false, nullsFirst: false }).limit(100);
    setLivres((data as Conversa[]) || []);
  };

  useEffect(() => { carregar(); }, [negociacao?.id]);

  const filtradas = useMemo(() => {
    const query = busca.trim().toLowerCase();
    if (!query) return livres;
    return livres.filter((item) => `${item.nome_contato || ""} ${item.telefone}`.toLowerCase().includes(query));
  }, [livres, busca]);

  const vincular = async (item: Conversa) => {
    if (!negociacao) return;
    setLoading(true);
    const { data, error } = await supabase.from("whatsapp_conversas").update({ negociacao_id: negociacao.id }).eq("id", item.id).select("*").single();
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    setConversa(data as Conversa); onChanged(); toast.success("Conversa associada");
  };

  const criar = async () => {
    if (!negociacao) return;
    let telefone = (negociacao.telefone || "").replace(/\D/g, "");
    if (telefone.length >= 10 && !telefone.startsWith("55")) telefone = `55${telefone}`;
    if (telefone.length < 12) { toast.error("Cadastre o telefone com DDD primeiro."); return; }
    setLoading(true);
    const { data, error } = await supabase.functions.invoke("whatsapp-send", { body: { telefone, tipo: "text", criar_apenas: true, nome_contato: negociacao.nome_cliente } });
    const criada = (data as { conversa?: Conversa } | null)?.conversa;
    if (!error && criada) {
      const { data: linked, error: linkError } = await supabase.from("whatsapp_conversas").update({ negociacao_id: negociacao.id }).eq("id", criada.id).select("*").single();
      if (!linkError && linked) setConversa(linked as Conversa);
    }
    setLoading(false);
    if (error || !criada) { toast.error("Não foi possível abrir a conversa."); return; }
    onChanged(); toast.success("Conversa criada e associada");
  };

  return (
    <Sheet open={Boolean(negociacao)} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="flex w-[min(720px,92vw)] max-w-none flex-col gap-0 p-0 sm:max-w-none">
        <SheetHeader className="border-b px-4 py-3 text-left">
          <SheetTitle className="pr-8">{negociacao?.nome_cliente || "Conversa"}</SheetTitle>
          <SheetDescription>{negociacao?.telefone || "Associe uma conversa para continuar"}</SheetDescription>
        </SheetHeader>
        {conversa ? (
          <div className="min-h-0 flex-1"><ConversaChat conversa={conversa} /></div>
        ) : (
          <div className="flex flex-1 flex-col p-5">
            <div className="mx-auto w-full max-w-lg space-y-4">
              <div className="rounded-md border border-dashed p-4 text-center">
                <MessageCirclePlus className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                <p className="text-sm font-semibold">Esta negociação ainda não tem conversa</p>
                <p className="mb-3 text-xs text-muted-foreground">Crie uma conversa para este telefone ou associe uma já existente.</p>
                <Button onClick={criar} disabled={loading}><MessageCirclePlus /> Criar nova conversa</Button>
              </div>
              <div className="space-y-2">
                <Input value={busca} onChange={(event) => setBusca(event.target.value)} placeholder="Buscar conversa existente…" />
                <div className="max-h-[45vh] overflow-y-auto rounded-md border">
                  {filtradas.map((item) => (
                    <Button key={item.id} variant="ghost" className="h-auto w-full justify-start rounded-none border-b px-3 py-2 text-left" onClick={() => vincular(item)} disabled={loading}>
                      <Link2 className="shrink-0" /><span className="min-w-0"><span className="block truncate text-sm font-medium">{item.nome_contato || item.telefone}</span><span className="block text-xs text-muted-foreground">{item.telefone}</span></span>
                    </Button>
                  ))}
                  {loading && <div className="flex justify-center p-4"><Loader2 className="animate-spin" /></div>}
                  {!loading && filtradas.length === 0 && <p className="p-4 text-center text-xs text-muted-foreground">Nenhuma conversa livre encontrada.</p>}
                </div>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}