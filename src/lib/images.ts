// OK Plast - URLs das imagens do storage
// Base URL do Supabase Storage
const STORAGE_BASE = "https://osfxdoxfiyyqcpahuwci.supabase.co/storage/v1/object/public/site-images";

// Helper para gerar URL completa
const img = (path: string) => `${STORAGE_BASE}/${path}`;

// ========================================
// HERO SLIDER
// ========================================
export const HERO_IMAGES = {
  cubo3d: img("hero/cubo-3d.png"),
  chapasEmpilhadas: img("hero/chapas-empilhadas.jpg"),
  chapasColoridas: img("hero/chapas-coloridas.jpg"),
} as const;

// ========================================
// EMPRESA
// ========================================
export const EMPRESA_IMAGES = {
  equipe: img("empresa/equipe.jpg"),
} as const;

// ========================================
// PRODUTOS SOB MEDIDA (Home)
// ========================================
export const PRODUTOS_IMAGES = {
  // Linha 1 (conforme layout Acrilzano)
  potesDoces: img("produtos/expositor-doces-escada.jpg"),
  cupulasRedomas: img("produtos/cupula-preta.jpg"),
  display: img("produtos/quadro-avisos.jpg"),
  portaFolder: img("produtos/porta-folder-dourado.png"),
  // Linha 2
  potesGraos: img("produtos/potes-graos-varios.jpg"),
  urna: img("produtos/cupula-transparente.jpg"),
  caixasSobMedida: img("produtos/pulpito.jpg"),
  trofeus: img("produtos/trofeus.jpg"),
  medalhas: img("produtos/medalhas.jpg"),
  // Linha 3
  displayA4: img("produtos/display-a4.webp"),
  medalhasPremiacoes: img("produtos/medalhas-premiacoes.webp"),
  placasPersonalizadas: img("produtos/placas-personalizadas.jpg"),
  urnaPiramidal: img("produtos/urna-piramidal.webp"),
  // Linha 4
  caixaDoces: img("produtos/caixa-doces.webp"),
  displayA4Parede: img("produtos/display-a4-parede.webp"),
  displayA6Mesa: img("produtos/display-a6-mesa.webp"),
  poteAGranel: img("produtos/pote-a-granel.webp"),
} as const;

// ========================================
// TIPOS DE CHAPAS (Home)
// ========================================
export const CHAPAS_IMAGES = {
  acrilicoCristal: img("chapas/acrilico-cristal.jpg"),
  acrilicoColorido: img("chapas/acrilico-colorido.jpg"),
  acrilicoLeitoso: img("chapas/ps-poliestireno.jpg"),
  acrilicoEspelhado: img("chapas/policarbonato-compacto.jpg"),
  policarbonato: img("chapas/policarbonato-alveolar.jpg"),
  petg: img("chapas/pet-g.jpg"),
  pvcExpandido: img("chapas/pvc-expandido.jpg"),
  pedacosRetalhos: img("chapas/acm.jpg"),
} as const;

// ========================================
// MOTIVOS CAROUSEL
// ========================================
export const MOTIVOS_IMAGES = {
  nfe: img("motivos/nfe.jpg"),
  credito: img("motivos/credito.jpg"),
  empresaSolida: img("motivos/empresa-solida.jpg"),
  prontaEntrega: img("motivos/pronta-entrega.jpg"),
  entregaBrasil: img("motivos/entrega-brasil.jpg"),
  atendimento: img("motivos/atendimento.jpg"),
} as const;

// ========================================
// DEPOIMENTOS
// ========================================
export const DEPOIMENTOS_IMAGES = {
  avatar1: img("depoimentos/avatar-1.png"),
  avatar2: img("depoimentos/avatar-2.png"),
  avatar3: img("depoimentos/avatar-3.png"),
  avatar4: img("depoimentos/avatar-4.png"),
} as const;

// ========================================
// PÁGINA CHAPAS DE ACRÍLICO
// ========================================
import chapasCast from "@/assets/chapas-hero/acrilico-transparente.jpg";
import chapasPoliestireno2 from "@/assets/chapas/ps-poliestireno-2.jpg";
import chapasPetg2 from "@/assets/chapas/pet-g-2.jpg";
import chapasPcAlveolar2 from "@/assets/chapas/policarbonato-alveolar-2.jpg";
import chapasPcCompacto2 from "@/assets/chapas/policarbonato-compacto-2.jpg";
import chapasPvc2 from "@/assets/chapas/pvc-expandido-2.jpg";
import chapasAcm2 from "@/assets/chapas/acm-2.jpg";

export const CHAPAS_PAGINA_IMAGES = {
  cast: chapasCast,
  poliestireno: chapasPoliestireno2,
  petg: chapasPetg2,
  policarbonatoAlveolar: chapasPcAlveolar2,
  policarbonatoCompacto: chapasPcCompacto2,
  pvc: chapasPvc2,
  acm: chapasAcm2,
} as const;

// ========================================
// PÁGINA ACRÍLICO SOB MEDIDA
// ========================================
export const SOBMEDIDA_IMAGES = {
  caixas: img("sobmedida/caixas.jpg"),
  cupulas: img("sobmedida/cupulas.jpg"),
  potesDoces: img("sobmedida/potes-doces.jpg"),
  potesGraos: img("sobmedida/potes-graos.jpg"),
  medalhas: img("sobmedida/medalhas.jpg"),
  trofeus: img("sobmedida/trofeus.jpg"),
  display: img("produtos/display-acrilico.webp"),
  urna: img("produtos/urna-acrilico.webp"),
  caixaSugestao: img("produtos/caixa-sugestao.webp"),
  expositoresBijuterias: img("sobmedida/expositores-bijuterias.jpg"),
  expositoresCalcados: img("produtos/expositor-calcados.webp"),
  portaFolder: img("produtos/porta-folder.webp"),
  trofeuSobMedida: img("produtos/trofeu-sob-medida.webp"),
  medalhaPersonalizada: img("produtos/medalha-personalizada.webp"),
  quadroAvisos: img("produtos/quadro-avisos.jpg"),
  boloFake: img("produtos/bolo-fake.jpeg"),
   placaCustomizada: img("sobmedida/placa-customizada.jpg"),
   placaSinalizacao: img("sobmedida/placa-sinalizacao.webp"),
   expositoresOculos: img("sobmedida/expositor-oculos.webp"),
   placaCustomizada2: img("sobmedida/placa-customizada-2.jpg"),
   placaGravada: img("sobmedida/placa-gravada.jpg"),
   placaSinalizacao2: img("sobmedida/placa-sinalizacao-2.webp"),
   placaPersonalizada: img("sobmedida/placa-personalizada.jpg"),
} as const;

// ========================================
// LISTA COMPLETA PARA MIGRAÇÃO
// ========================================
export const ALL_IMAGES_TO_MIGRATE = [
  // Hero
  { key: "hero/cubo-3d.png", url: "https://storage.builderall.com/franquias/2/6891583/editor-html/9121285.png" },
  { key: "hero/chapas-empilhadas.jpg", url: "https://acrilzano.com.br/wp-content/uploads/2022/08/chapa-1-min.jpg" },
  { key: "hero/chapas-coloridas.jpg", url: "https://acrilzano.com.br/wp-content/uploads/2022/08/chapa-min.jpg" },
  
  // Empresa
  { key: "empresa/equipe.jpg", url: "https://acrilzano.com.br/wp-content/uploads/2022/08/Equipe-Acrilzano-acrilico-1-min.jpg" },
  
  // Produtos
  { key: "produtos/caixas-sob-medida.jpg", url: "https://acrilzano.com.br/wp-content/uploads/2022/08/caixa-acrilico-doces-3-300x225-300x225-min.jpg" },
  { key: "produtos/cupulas-redomas.jpg", url: "https://acrilzano.com.br/wp-content/uploads/2022/08/expositor-de-acrilico-cone-300x300-min.jpg" },
  { key: "produtos/potes-doces.jpg", url: "https://acrilzano.com.br/wp-content/uploads/2022/08/suporte-para-bolo-de-andar-300x300-min.jpg" },
  { key: "produtos/potes-graos.jpg", url: "https://acrilzano.com.br/wp-content/uploads/2022/08/caixa-acrilico-granel-300x225-300x225-min.jpg" },
  { key: "produtos/urna.jpg", url: "https://acrilzano.com.br/wp-content/uploads/2022/08/urna-de-acrilico-300x300-min.jpg" },
  { key: "produtos/display.jpg", url: "https://acrilzano.com.br/wp-content/uploads/2022/08/expositor-de-acrilico-doces-300x300-min.jpg" },
  { key: "produtos/trofeus.jpg", url: "https://acrilzano.com.br/wp-content/uploads/2022/08/trofeu-acrilico-acrilzano-300x298-min.jpg" },
  { key: "produtos/medalhas.jpg", url: "https://acrilzano.com.br/wp-content/uploads/2022/08/medalhas-acrilicas-300x300-min.jpg" },
  
  // Chapas
  { key: "chapas/acrilico-cristal.jpg", url: "https://acrilzano.com.br/wp-content/uploads/2022/08/CHAPA-PRINCIPAL-300x300-min.jpg" },
  { key: "chapas/acrilico-colorido.jpg", url: "https://acrilzano.com.br/wp-content/uploads/2022/08/chapa-acrilico-colorido-300x223-300x223-1.jpg" },
  { key: "chapas/acrilico-leitoso.jpg", url: "https://acrilzano.com.br/wp-content/uploads/2022/08/chapa-2-min.jpg" },
  { key: "chapas/acrilico-espelhado.jpg", url: "https://acrilzano.com.br/wp-content/uploads/2022/08/chapa-acrilico-espelhada-300x225-min.jpg" },
  { key: "chapas/policarbonato.jpg", url: "https://acrilzano.com.br/wp-content/uploads/2022/08/chapa-3-min.jpg" },
  { key: "chapas/petg.jpg", url: "https://acrilzano.com.br/wp-content/uploads/2022/08/4444444444444444444444444-min.jpg" },
  { key: "chapas/pvc-expandido.jpg", url: "https://acrilzano.com.br/wp-content/uploads/2022/08/111111111111111111111111-min.jpg" },
  { key: "chapas/pedacos-retalhos.jpg", url: "https://acrilzano.com.br/wp-content/uploads/2022/08/22222222222222222222222222-min.jpg" },
  
  // Motivos
  { key: "motivos/nfe.jpg", url: "https://acrilzano.com.br/wp-content/uploads/2022/08/1.2-min.jpg" },
  { key: "motivos/credito.jpg", url: "https://acrilzano.com.br/wp-content/uploads/2022/08/2.2-min.jpg" },
  { key: "motivos/empresa-solida.jpg", url: "https://acrilzano.com.br/wp-content/uploads/2022/08/3.2-min.jpg" },
  { key: "motivos/pronta-entrega.jpg", url: "https://acrilzano.com.br/wp-content/uploads/2022/08/4.2-min.jpg" },
  { key: "motivos/entrega-brasil.jpg", url: "https://acrilzano.com.br/wp-content/uploads/2022/08/5.2-min.jpg" },
  { key: "motivos/atendimento.jpg", url: "https://acrilzano.com.br/wp-content/uploads/2022/08/6.2-min.jpg" },
  
  // Depoimentos
  { key: "depoimentos/avatar-1.png", url: "https://acrilzano.com.br/wp-content/uploads/2022/06/1-min.png" },
  { key: "depoimentos/avatar-2.png", url: "https://acrilzano.com.br/wp-content/uploads/2022/06/2-min.png" },
  { key: "depoimentos/avatar-3.png", url: "https://acrilzano.com.br/wp-content/uploads/2022/06/3-min.png" },
  { key: "depoimentos/avatar-4.png", url: "https://acrilzano.com.br/wp-content/uploads/2022/06/4-min.png" },
  
  // Chapas Página
  { key: "chapas-pagina/cast.jpg", url: "https://acrilzano.com.br/wp-content/uploads/2022/08/chapa-1-min.jpg" },
  { key: "chapas-pagina/poliestireno.jpg", url: "https://acrilzano.com.br/wp-content/uploads/2022/08/chapa-2-min.jpg" },
  { key: "chapas-pagina/petg.jpg", url: "https://acrilzano.com.br/wp-content/uploads/2022/08/chapa-3-min.jpg" },
  { key: "chapas-pagina/policarbonato-alveolar.jpg", url: "https://acrilzano.com.br/wp-content/uploads/2022/08/chapa-min.jpg" },
  { key: "chapas-pagina/policarbonato-compacto.jpg", url: "https://acrilzano.com.br/wp-content/uploads/2022/08/111111111111111111111111-min.jpg" },
  { key: "chapas-pagina/pvc.jpg", url: "https://acrilzano.com.br/wp-content/uploads/2022/08/22222222222222222222222222-min.jpg" },
  { key: "chapas-pagina/acm.jpg", url: "https://acrilzano.com.br/wp-content/uploads/2022/08/3333333333333333333333333-min.jpg" },
  
  // Sob Medida
  { key: "sobmedida/caixas.jpg", url: "https://acrilzano.com.br/wp-content/uploads/2022/08/Caixas-acrilico-300x251-300x251-min.jpg" },
  { key: "sobmedida/cupulas.jpg", url: "https://acrilzano.com.br/wp-content/uploads/2022/08/cupula-acrilico-400x300-300x225-min.jpg" },
  { key: "sobmedida/potes-doces.jpg", url: "https://acrilzano.com.br/wp-content/uploads/2022/08/caixa-acrilico-doces-2-300x200-300x200-min.jpg" },
  { key: "sobmedida/potes-graos.jpg", url: "https://acrilzano.com.br/wp-content/uploads/2022/08/pote-acrilico-granel-225x300-225x300-min.jpg" },
  { key: "sobmedida/medalhas.jpg", url: "https://acrilzano.com.br/wp-content/uploads/2022/08/medalhas-acrilica-300x300-min.jpg" },
  { key: "sobmedida/trofeus.jpg", url: "https://acrilzano.com.br/wp-content/uploads/2022/08/trofeu-acrilico-fenda-300x300-min.jpg" },
  { key: "sobmedida/display.jpg", url: "https://acrilzano.com.br/wp-content/uploads/2022/08/expositor-de-acrilicos-300x180-300x180-min.jpg" },
  { key: "sobmedida/urna.jpg", url: "https://acrilzano.com.br/wp-content/uploads/2022/08/sugestoes-400x267-300x225-min.jpg" },
  { key: "sobmedida/caixa-sugestao.jpg", url: "https://acrilzano.com.br/wp-content/uploads/2022/08/caixa-sugestao-300x300-min.jpg" },
  { key: "sobmedida/expositores-bijuterias.jpg", url: "https://acrilzano.com.br/wp-content/uploads/2022/08/expositor-acrilico-brinco-1-300x297-min.jpg" },
  { key: "sobmedida/expositores-calcados.jpg", url: "https://acrilzano.com.br/wp-content/uploads/2022/08/expositor-de-acrilico-doces-300x300-min.jpg" },
  { key: "sobmedida/porta-folder.jpg", url: "https://acrilzano.com.br/wp-content/uploads/2022/08/porta-folder-acrilicdo-parede-400x240-300x225-min.jpg" },
] as const;
