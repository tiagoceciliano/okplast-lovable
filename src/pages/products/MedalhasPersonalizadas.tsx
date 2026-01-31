import { ProductPage } from "@/components/products/ProductPage";
import { SOBMEDIDA_IMAGES } from "@/lib/images";

export default function MedalhasPersonalizadas() {
  return (
    <ProductPage
      title="Medalhas Personalizadas"
      description="Medalhas de acrílico personalizadas para eventos esportivos, corporativos, escolares e premiações diversas. Nossas medalhas são fabricadas com acrílico de alta qualidade, podendo receber gravação a laser, impressão UV ou aplicação de adesivos com design exclusivo."
      imageUrl={SOBMEDIDA_IMAGES.medalhas}
      benefits={[
        "Personalização completa do design",
        "Gravação a laser de alta precisão",
        "Impressão UV colorida",
        "Leves e resistentes",
        "Cordão incluso (diversas cores)",
        "Acabamento premium",
      ]}
      variations={[
        "Medalha redonda",
        "Medalha quadrada",
        "Medalha formato estrela",
        "Medalha com recorte especial",
        "Medalha com acrílico espelhado",
        "Medalha com inserção de metal",
        "Kit medalhas 1º, 2º e 3º lugar",
      ]}
    />
  );
}
