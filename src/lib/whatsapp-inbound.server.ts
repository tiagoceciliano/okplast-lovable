// Lógica compartilhada para receber mensagens (API oficial e números via QR Code).
export type Db = any;

export const digits = (s: unknown) => String(s ?? "").replace(/\D/g, "");
export const formatBR = (wa: string) => {
  const d = wa.replace(/^55/, "");
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return wa;
};

export function textFromMessage(m: any): { tipo: string; conteudo: string } {
  switch (m.type) {
    case "text": return { tipo: "text", conteudo: m.text?.body ?? "" };
    case "button": return { tipo: "button", conteudo: m.button?.text ?? "" };
    case "interactive":
      return { tipo: "interactive", conteudo: m.interactive?.button_reply?.title ?? m.interactive?.list_reply?.title ?? "" };
    case "image": return { tipo: "image", conteudo: m.image?.caption || "[Imagem]" };
    case "document": return { tipo: "document", conteudo: m.document?.filename || "[Documento]" };
    case "audio": return { tipo: "audio", conteudo: "[Áudio]" };
    case "video": return { tipo: "video", conteudo: m.video?.caption || "[Vídeo]" };
    case "sticker": return { tipo: "sticker", conteudo: "[Figurinha]" };
    case "location": return { tipo: "location", conteudo: `[Localização] ${m.location?.latitude},${m.location?.longitude}` };
    case "reaction": return { tipo: "reaction", conteudo: m.reaction?.emoji ?? "" };
    default: return { tipo: m.type || "unknown", conteudo: `[${m.type}]` };
  }
}

export async function findOrCreateConversa(db: Db, from: string, nome: string | null, conteudo: string, opts: { responsavelPreferido?: string | null; instanciaId?: string | null } = {}) {
  // Um único atendimento por número: casa pelos 8 últimos dígitos (cobre variação do 9º dígito).
  const { data: convs, error } = await db.from("whatsapp_conversas").select("*")
    .like("telefone", `%${from.slice(-8)}`).order("created_at").limit(1);
  if (error) throw error;
  if (convs?.[0]) return convs[0];

  const tail = from.replace(/^55/, "");
  const { data: negs } = await db.from("negociacoes")
    .select("id, telefone, responsavel_id")
    .ilike("telefone", `%${tail.slice(-4)}%`)
    .order("created_at", { ascending: false }).limit(50);
  let neg: any = (negs ?? []).find((n: any) => digits(n.telefone).endsWith(tail.slice(-8)));
  let responsavel: string | null = neg?.responsavel_id ?? opts.responsavelPreferido ?? null;

  if (!neg) {
    if (!responsavel) {
    const { data: ativos } = await db.from("whatsapp_numbers")
      .select("user_id, peso").eq("ativo", true).eq("recebe_lead", true).not("user_id", "is", null);
    if (ativos?.length) {
      const total = ativos.reduce((s: number, n: any) => s + Math.max(0, n.peso ?? 0), 0);
      let pick: any = ativos[0];
      if (total > 0) {
        let r = Math.random() * total;
        for (const n of ativos) { r -= Math.max(0, n.peso ?? 0); if (r <= 0) { pick = n; break; } }
      }
      responsavel = pick.user_id;
    }
    }
    const { data: last } = await db.from("negociacoes").select("posicao")
      .eq("etapa", "entrada").order("posicao", { ascending: false }).limit(1).maybeSingle();
    const { data: created, error: negErr } = await db.from("negociacoes").insert({
      nome_cliente: nome || formatBR(from),
      telefone: formatBR(from),
      etapa: "entrada",
      responsavel_id: responsavel,
      produto: "Chapa Inteira",
      mensagem: conteudo,
      utm_source: "whatsapp_api",
      posicao: (last?.posicao ?? 0) + 1,
    }).select("id").single();
    if (negErr) throw negErr;
    neg = created;
  }

  const { data: novo, error: convErr } = await db.from("whatsapp_conversas").upsert({
    telefone: from, nome_contato: nome, negociacao_id: neg?.id ?? null, responsavel_id: responsavel, instancia_id: opts.instanciaId ?? null,
  }, { onConflict: "telefone" }).select("*").single();
  if (convErr) throw convErr;
  return novo;
}

