import { ProductPage } from "@/components/products/ProductPage";
import { SOBMEDIDA_IMAGES } from "@/lib/images";

export default function CupulasRedomas() {
  return (
    <ProductPage
      title="Cúpulas e Redomas"
      description="Nossas cúpulas e redomas de acrílico são perfeitas para exposição e proteção de produtos, peças de colecionador, bolos, doces e muito mais. Fabricadas em acrílico cristal de alta transparência, proporcionam visibilidade total do conteúdo com proteção contra poeira e manuseio."
      imageUrl={SOBMEDIDA_IMAGES.cupulas}
       seoTitle="Cúpulas e Redomas de Acrílico - Exposição"
       seoDescription="Cúpulas e redomas de acrílico para exposição e proteção. Diversos formatos. Fabricação sob medida no Rio de Janeiro."
      benefits={[
        "Alta transparência para visibilidade perfeita",
        "Proteção contra poeira e umidade",
        "Fabricação em diversos tamanhos",
        "Formatos redondos, quadrados e retangulares",
        "Base incluída ou avulsa",
        "Acabamento premium com polimento",
      ]}
      variations={[
        "Redoma quadrada",
        "Redoma retangular",
        "Cúpula para bolo",
        "Cúpula para relógios e joias",
        "Redoma com base em acrílico preto",
      ]}
    />
  );
}
