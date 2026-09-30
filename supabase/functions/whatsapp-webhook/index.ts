import { createClient } from "npm:@supabase/supabase-js@2";

// Recebe mensagens e status do WhatsApp Cloud API (Meta) direto.
// GET  -> verificação do webhook (hub.challenge)
// POST -> eventos (assinatura X-Hub-Signature-256 validada com WHATSAPP_APP_SECRET)

function digits(s: string | null | undefined) {
  return (s || "").replace(/\D/g, "");
}

async function validSignature(raw: string, header: string | null, secret: string) {
  if (!header?.startsWith("sha256=")) return false;
  const key = await crypto.subtle.importKey(
    "raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(raw));
  const hex = Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("");
  const expected = header.slice(7);
  if (hex.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < hex.length; i++) diff |= hex.charCodeAt(i) ^ expected.charCodeAt(i);
  return diff === 0;
}

function textFromMessage(m: any): { tipo: string; conteudo: string } {
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

function formatBR(wa: string) {
  const d = wa.replace(/^55/, "");
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return wa;
}

Deno.serve(async (req) => {
  const url = new URL(req.url);

  if (req.method === "GET") {
    const mode = url.searchParams.get("hub.mode");
    const token = url.searchParams.get("hub.verify_token");
    const challenge = url.searchParams.get("hub.challenge");
    if (mode === "subscribe" && token && token === Deno.env.get("WHATSAPP_VERIFY_TOKEN")) {
      return new Response(challenge ?? "", { status: 200 });
    }
    return new Response("forbidden", { status: 403 });
  }

  if (req.method !== "POST") return new Response("method not allowed", { status: 405 });

  const raw = await req.text();
  const appSecret = Deno.env.get("WHATSAPP_APP_SECRET");
  if (!appSecret || !(await validSignature(raw, req.headers.get("x-hub-signature-256"), appSecret))) {
    console.error("Assinatura inválida ou WHATSAPP_APP_SECRET ausente");
    return new Response("invalid signature", { status: 401 });
  }

  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

  try {
    const body = JSON.parse(raw);
    for (const entry of body.entry ?? []) {
      for (const change of entry.changes ?? []) {
        const value = change.value ?? {};

        // Status de mensagens enviadas
        for (const st of value.statuses ?? []) {
          await supabase.from("whatsapp_mensagens")
            .update({ status: st.status, erro: st.errors?.[0]?.title ?? null })
            .eq("wa_message_id", st.id);
        }

        // Mensagens recebidas
        const contacts = value.contacts ?? [];
        for (const m of value.messages ?? []) {
          const from = digits(m.from);
          const nome = contacts.find((c: any) => c.wa_id === m.from)?.profile?.name ?? null;
          const { tipo, conteudo } = textFromMessage(m);
          const when = m.timestamp ? new Date(Number(m.timestamp) * 1000).toISOString() : new Date().toISOString();

          let { data: conv } = await supabase.from("whatsapp_conversas").select("*").eq("telefone", from).maybeSingle();

          if (!conv) {
            // Procura negociação existente pelo telefone (final com DDD + número)
            const tail = from.replace(/^55/, "");
            const { data: negs } = await supabase.from("negociacoes")
              .select("id, telefone, responsavel_id, status")
              .ilike("telefone", `%${tail.slice(-4)}%`)
              .order("created_at", { ascending: false })
              .limit(50);
            let neg = (negs ?? []).find((n: any) => digits(n.telefone).endsWith(tail.slice(-8)));

            let responsavel: string | null = neg?.responsavel_id ?? null;

            if (!neg) {
              // Distribui entre vendedores ativos (peso)
              const { data: ativos } = await supabase.from("whatsapp_numbers")
                .select("user_id, peso").eq("ativo", true).eq("recebe_lead", true).not("user_id", "is", null);
              if (ativos && ativos.length) {
                const total = ativos.reduce((s: number, n: any) => s + Math.max(0, n.peso ?? 0), 0);
                let pick: any = ativos[0];
                if (total > 0) {
                  let r = Math.random() * total;
                  for (const n of ativos as any[]) { r -= Math.max(0, n.peso ?? 0); if (r <= 0) { pick = n; break; } }
                }
                responsavel = pick.user_id;
              }
              const { data: last } = await supabase.from("negociacoes").select("posicao")
                .eq("etapa", "entrada").order("posicao", { ascending: false }).limit(1).maybeSingle();
              const { data: created } = await supabase.from("negociacoes").insert({
                nome_cliente: nome || formatBR(from),
                telefone: formatBR(from),
                etapa: "entrada",
                responsavel_id: responsavel,
                produto: "Chapa Inteira",
                mensagem: conteudo,
                utm_source: "whatsapp_api",
                posicao: (last?.posicao ?? 0) + 1,
              }).select("id").single();
              neg = created as any;
            }

            const { data: novo } = await supabase.from("whatsapp_conversas").insert({
              telefone: from, nome_contato: nome, negociacao_id: neg?.id ?? null, responsavel_id: responsavel,
            }).select("*").single();
            conv = novo;
          }

          if (!conv) continue;

          const { error: insErr } = await supabase.from("whatsapp_mensagens").insert({
            conversa_id: conv.id, wa_message_id: m.id, direcao: "entrada", tipo, conteudo, created_at: when,
          });
          if (insErr && !String(insErr.message).includes("duplicate")) console.error(insErr);
          if (insErr) continue; // duplicado (reentrega da Meta)

          await supabase.from("whatsapp_conversas").update({
            nome_contato: nome ?? conv.nome_contato,
            ultima_mensagem: conteudo,
            ultima_mensagem_em: when,
            ultima_entrada_cliente_em: when,
            nao_lidas: (conv.nao_lidas ?? 0) + 1,
          }).eq("id", conv.id);
        }
      }
    }
  } catch (e) {
    console.error("Erro no webhook WhatsApp:", e);
  }

  return new Response("ok", { status: 200 });
});
