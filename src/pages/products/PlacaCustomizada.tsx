import { ProductPage } from "@/components/products/ProductPage";

export default function PlacaCustomizada() {
  return (
    <ProductPage
      title="Placa de Acrílico Customizada"
      description="Placas de acrílico personalizadas para identificação, premiação, homenagens e decoração. Trabalhamos com corte a laser de precisão e gravação para criar placas únicas que atendem às suas especificações de design, tamanho e acabamento."
       seoTitle="Placas de Acrílico Personalizadas - Gravação Laser"
       seoDescription="Placas de acrílico personalizadas para identificação, premiação e decoração. Corte e gravação a laser. Rio de Janeiro."
      benefits={[
        "Corte a laser de alta precisão",
        "Gravação permanente",
        "Impressão UV colorida",
        "Diversos formatos e tamanhos",
        "Acrílico cristal, colorido ou espelhado",
        "Furação e acabamentos especiais",
      ]}
      variations={[
        "Placa de porta/ambiente",
        "Placa de inauguração",
        "Placa de homenagem",
        "Placa de mesa",
        "Placa com foto impressa",
        "Placa com QR Code",
        "Placa com suporte incluso",
      ]}
    />
  );
}
