import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { requireCaller } from "@/lib/supabase-server";

const CUSTOMER_ID = "4787025931"; // OKPLAST + LAB
const GATEWAY = "https://connector-gateway.lovable.dev/google_ads";

interface GaqlRow {
  segments?: { date?: string };
  metrics?: {
    costMicros?: string | number;
    clicks?: string | number;
    impressions?: string | number;
    conversions?: string | number;
  };
  campaign?: { id: string | number; name?: string; status?: string };
  label?: { id?: string | number; name?: string };
}

async function gaql(query: string): Promise<GaqlRow[]> {
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const connectionKey = process.env["GOOGLE_ADS_API_KEY"];
  if (!lovableKey || !connectionKey) {
    throw new Error("Conexão com Google Ads não configurada");
  }
  const res = await fetch(`${GATEWAY}/v25/customers/${CUSTOMER_ID}/googleAds:search`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": connectionKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) {
    const body = await res.text();
    console.error(`Google Ads API failed [${res.status}]: ${body}`);
    throw new Error(`Google Ads API [${res.status}]`);
  }
  const data = (await res.json()) as { results?: GaqlRow[] };
  return data.results ?? [];
}

const micros = (v: unknown) => Number(v ?? 0) / 1_000_000;
const num = (v: unknown) => Number(v ?? 0);

export interface GoogleAdsStatsPayload {
  startDate: string;
  endDate: string;
}

export const getGoogleAdsStats = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => input as GoogleAdsStatsPayload)
  .handler(async ({ data }) => {
    const { admin } = await requireCaller(getRequestHeader("Authorization"), [
      "admin",
      "gestor",
    ]);

    const { startDate, endDate } = data;
    if (!startDate || !endDate) throw new Error("startDate e endDate são obrigatórios");
    const range = `segments.date BETWEEN '${startDate}' AND '${endDate}'`;

    // 1) Gasto diário (conta inteira)
    const dailyRows = await gaql(
      `SELECT segments.date, metrics.cost_micros, metrics.clicks, metrics.impressions, metrics.conversions FROM customer WHERE ${range}`
    );
    const daily = dailyRows.map((r) => ({
      date: r.segments?.date ?? "",
      cost: micros(r.metrics?.costMicros),
      clicks: num(r.metrics?.clicks),
      impressions: num(r.metrics?.impressions),
      conversions: num(r.metrics?.conversions),
    }));

    // 2) Por campanha
    const campaignRows = await gaql(
      `SELECT campaign.id, campaign.name, campaign.status, metrics.cost_micros, metrics.clicks, metrics.impressions, metrics.conversions FROM campaign WHERE campaign.status != 'REMOVED' AND ${range}`
    );

    // 3) Rótulos das campanhas
    const labelRows = await gaql(
      `SELECT campaign.id, label.id, label.name FROM campaign_label WHERE campaign.status != 'REMOVED'`
    );
    const labelsByCampaign: Record<string, string[]> = {};
    for (const r of labelRows) {
      const cid = String(r.campaign?.id ?? "");
      if (!cid) continue;
      if (!labelsByCampaign[cid]) labelsByCampaign[cid] = [];
      if (r.label?.name) labelsByCampaign[cid].push(r.label.name);
    }

    const campaigns = campaignRows.map((r) => ({
      id: String(r.campaign?.id ?? ""),
      name: r.campaign?.name ?? "",
      status: r.campaign?.status ?? "",
      cost: micros(r.metrics?.costMicros),
      clicks: num(r.metrics?.clicks),
      impressions: num(r.metrics?.impressions),
      conversions: num(r.metrics?.conversions),
      labels: labelsByCampaign[String(r.campaign?.id ?? "")] ?? [],
      leads: 0,
    }));

    // 4) Leads do sistema vindos do Google Ads, por utm_campaign
    const { data: leads } = await admin
      .from("leads")
      .select("utm_campaign, utm_source")
      .eq("utm_source", "googleads")
      .gte("created_at", `${startDate}T00:00:00-03:00`)
      .lte("created_at", `${endDate}T23:59:59-03:00`)
      .limit(50000);

    // Chave canônica: "8. Chapas - ACM" e "chapas-acm-rj" => "chapas|acm"
    const IGNORAR = new Set(["rj", "riodejaneiro", "sm"]);
    const chave = (s: string) =>
      s
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .split(/[^a-z0-9]+/)
        .filter((t) => t && !/^\d+$/.test(t) && !IGNORAR.has(t))
        .join("|");

    const leadsByKey: Record<string, number> = {};
    let totalLeads = 0;
    for (const l of leads ?? []) {
      totalLeads++;
      const k = chave(String(l.utm_campaign ?? ""));
      if (k) leadsByKey[k] = (leadsByKey[k] ?? 0) + 1;
    }

    // Igualdade exata: cada lead conta em no máximo uma campanha
    const usadas = new Set<string>();
    for (const c of campaigns) {
      const k = chave(c.name);
      if (k && leadsByKey[k] && !usadas.has(k)) {
        c.leads = leadsByKey[k];
        usadas.add(k);
      }
    }
    const leadsSemCampanha = totalLeads - [...usadas].reduce((s, k) => s + (leadsByKey[k] ?? 0), 0);

    const totalCost = campaigns.reduce((s, c) => s + c.cost, 0);

    return {
      daily,
      campaigns,
      leadsSemCampanha,
      totals: {
        cost: totalCost,
        clicks: campaigns.reduce((s, c) => s + c.clicks, 0),
        impressions: campaigns.reduce((s, c) => s + c.impressions, 0),
        conversions: campaigns.reduce((s, c) => s + c.conversions, 0),
        leads: totalLeads,
        costPerLead: totalLeads > 0 ? totalCost / totalLeads : null,
      },
    };
  });
