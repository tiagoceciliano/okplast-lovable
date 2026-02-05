import { ProductPage } from "@/components/products/ProductPage";
import { SOBMEDIDA_IMAGES } from "@/lib/images";

export default function TrofeusPersonalizados() {
  return (
    <ProductPage
      title="Troféus Personalizados"
      description="Troféus de acrílico personalizados para premiações, reconhecimentos corporativos, eventos esportivos e celebrações. Criamos peças exclusivas que transmitem elegância e valorizam o homenageado. Possibilidade de combinar acrílico com outros materiais como madeira e metal."
      imageUrl={SOBMEDIDA_IMAGES.trofeus}
       seoTitle="Troféus de Acrílico Personalizados - Premiações"
       seoDescription="Troféus em acrílico personalizados para eventos e premiações corporativas. Gravação a laser e impressão UV. Rio de Janeiro."
      benefits={[
        "Design exclusivo para sua premiação",
        "Combinação de materiais (acrílico + madeira/metal)",
        "Gravação a laser com logotipo e texto",
        "Impressão UV em alta definição",
        "Diversos tamanhos e formatos",
        "Embalagem especial disponível",
      ]}
      variations={[
        "Troféu em placa de acrílico",
        "Troféu com base em madeira",
        "Troféu com elementos 3D",
        "Troféu corporativo",
        "Troféu esportivo",
        "Troféu comemorativo",
      ]}
    />
  );
}
