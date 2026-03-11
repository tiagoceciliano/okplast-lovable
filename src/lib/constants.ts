// OK Plast - Dados da empresa e configurações
export const COMPANY = {
  name: "OK Plast",
  legalName: "OK PLAST COMERCIO LTDA",
  slogan: "TUDO OK PARA SEU PROJETO",
  address: "Rua Guatemala, 593 – Penha Circular – Rio de Janeiro – RJ, 21020-170",
  phone: "(21) 3372-3797",
  whatsapp: "5521923670633",
  whatsappFormatted: "(21) 92367-0633",
  email: "vendas@okplast.com.br",
  domain: "https://okplast.com.br",
  businessHours: "Segunda a Sexta: 9h às 17h",
} as const;

// Webhooks Kinbox
export const WEBHOOKS = {
  chapas: "WEBHOOK_CHAPAS",
  geral: "WEBHOOK_GERAL",
} as const;

// Produtos simplificados para modal WhatsApp (só chapas)
export const PRODUTOS_WHATSAPP = [
  "Chapa Inteira",
  "Chapa Cortada sob Medida",
] as const;

// Produtos para formulário de orçamento (só chapas)
export const PRODUTOS_INTERESSE = [
  "Acrílico Transparente",
  "Acrílico Colorido",
  "Policarbonato Alveolar",
  "Policarbonato Compacto",
  "PETG",
  "Poliestireno (PS)",
  "PVC Expandido",
  "ACM",
  "Outro",
] as const;

// Navegação principal
export const NAV_ITEMS = [
  { label: "Home", href: "/" },
  {
    label: "Chapas",
    children: [
      { label: "Acrílico", href: "/chapas/acrilico" },
      { label: "Policarbonato Alveolar", href: "/chapas/policarbonato-alveolar" },
      { label: "Policarbonato Compacto", href: "/chapas/policarbonato-compacto" },
      { label: "PETG", href: "/chapas/petg" },
      { label: "Poliestireno (PS)", href: "/chapas/poliestireno" },
      { label: "PVC Expandido", href: "/chapas/pvc-expandido" },
      { label: "ACM", href: "/chapas/acm" },
    ],
  },
  {
    label: "Institucional",
    children: [
      { label: "Sobre Nós", href: "/home/sobre-nos" },
      { label: "Política de Venda", href: "/home/politica-de-venda" },
      { label: "Termo de Uso", href: "/home/termo-de-uso" },
    ],
  },
] as const;
