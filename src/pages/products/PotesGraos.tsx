import { ProductPage } from "@/components/products/ProductPage";
import { SOBMEDIDA_IMAGES } from "@/lib/images";

export default function PotesGraos() {
  return (
    <ProductPage
      title="Potes para Grãos e Cereais a Granel"
      description="Solução ideal para lojas de produtos naturais, mercados e empórios que trabalham com produtos a granel. Nossos potes de acrílico para grãos e cereais são desenvolvidos para facilitar o armazenamento, a visualização e a dispensação de produtos, mantendo a qualidade e higiene."
      imageUrl={SOBMEDIDA_IMAGES.potesGraos}
       seoTitle="Potes para Grãos e Cereais a Granel - Acrílico"
       seoDescription="Potes e dispensers de acrílico para lojas de produtos naturais. Sistema de dispensação. Fabricação sob medida no RJ."
       canonical="/acrilico-sob-medida/potes-para-graos-e-cereais-a-granel"
      benefits={[
        "Sistema de dispensação prático",
        "Tampa com vedação para proteção do produto",
        "Alta capacidade de armazenamento",
        "Fácil reposição de produtos",
        "Visualização clara do conteúdo e nível",
        "Resistente e durável para uso comercial intenso",
      ]}
      variations={[
        "Pote com tampa articulada",
        "Pote com tampa removível",
        "Conjunto com múltiplos potes",
        "Suporte para potes empilhados",
        "Pote com identificador de produto",
      ]}
    />
  );
}
