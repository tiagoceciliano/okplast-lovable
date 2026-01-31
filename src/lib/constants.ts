// Lab Acrílicos - Dados da empresa e configurações
export const COMPANY = {
  name: "Lab Acrílicos",
  slogan: "FÁBRICA e LOJA DE CHAPAS DE ACRÍLICO e PERSONALIZADOS",
  address: "Rua Cordovil 259 – Cordovil – Rio de Janeiro – RJ",
  phone: "(21) 3372-3797",
  whatsapp: "5521923670633",
  whatsappFormatted: "(21) 92367-0633",
  email: "vendas@labacrilicos.com.br",
  domain: "https://labacrilicos.com.br",
  businessHours: "Segunda a Sexta: 8h às 18h | Sábado: 8h às 12h",
} as const;

// Webhooks Kinbox
export const WEBHOOKS = {
  chapas: "WEBHOOK_CHAPAS", // Placeholder - configurar em secrets
  geral: "WEBHOOK_GERAL", // Placeholder - configurar em secrets
} as const;

// Produtos para formulário de orçamento
export const PRODUTOS_INTERESSE = [
  "Caixas Sob Medida",
  "Cúpulas e Redomas",
  "Potes para Doces e Guloseimas",
  "Potes para Grãos e Cereais a Granel",
  "Urna de Acrílico",
  "Caixa de Sugestão",
  "Medalhas Personalizadas",
  "Troféus Personalizados",
  "Placa de Acrílico Customizada",
  "Placa de Acrílico Sinalização",
  "Expositores para Bijuterias",
  "Expositores para Calçados",
  "Expositores para Óculos",
  "Display de Acrílico",
  "Porta Folder",
  "Chapas e Pedaços de Placas",
  "Outro",
] as const;

// Navegação principal
export const NAV_ITEMS = [
  { label: "Home", href: "/" },
  {
    label: "Institucional",
    children: [
      { label: "Sobre Nós", href: "/home/sobre-nos" },
      { label: "Orçamento", href: "/home/orcamento" },
      { label: "Política de Revenda", href: "/home/politica-de-revenda" },
      { label: "Política de Venda", href: "/home/politica-de-venda" },
      { label: "Termo de Uso", href: "/home/termo-de-uso" },
    ],
  },
  {
    label: "Produtos",
    children: [
      { label: "Acrílico Sob Medida", href: "/acrilico-sob-medida" },
      { label: "Chapas de Acrílico", href: "/chapas-de-acrilico" },
    ],
  },
] as const;
