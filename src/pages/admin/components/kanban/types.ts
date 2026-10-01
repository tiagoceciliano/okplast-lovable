export const ETAPAS = [
  { id: "entrada", label: "Entrada" },
  { id: "em_contato", label: "Em Contato" },
  { id: "orcamento", label: "Orçamento Enviado" },
  { id: "negociacao", label: "Negociação" },
  { id: "venda_realizada", label: "Venda Realizada" },
  { id: "perdido", label: "Perdido" },
] as const;

export type EtapaId = typeof ETAPAS[number]["id"];

export interface Negociacao {
  id: string;
  lead_id: string | null;
  nome_cliente: string;
  telefone: string | null;
  email: string | null;
  etapa: EtapaId;
  status: "aberto" | "ganho" | "perdido";
  responsavel_id: string | null;
  valor: number | null;
  produto: string | null;
  nome_produto: string | null;
  link_pv_bling: string | null;
  material: string | null;
  mensagem: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  posicao: number;
  tags: string[];
  destino_whatsapp: string | null;
  created_at: string;
  updated_at: string;
}

export interface VendedorLite {
  user_id: string;
  nome: string;
}

export const brl = (v: number | null | undefined) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v ?? 0);