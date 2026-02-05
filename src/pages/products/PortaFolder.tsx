import { ProductPage } from "@/components/products/ProductPage";
import { SOBMEDIDA_IMAGES } from "@/lib/images";

export default function PortaFolder() {
  return (
    <ProductPage
      title="Porta Folder"
      description="Porta folders de acrílico para organização e distribuição de materiais promocionais, folhetos, revistas e catálogos. Disponíveis em versões de mesa e parede, nossos porta folders são ideais para recepções, consultórios, lojas e espaços corporativos, mantendo os materiais organizados e acessíveis."
      imageUrl={SOBMEDIDA_IMAGES.portaFolder}
       seoTitle="Porta Folder de Acrílico - Mesa e Parede"
       seoDescription="Porta folders em acrílico para organização de folhetos e catálogos. Versões de mesa e parede. Fabricação sob medida no RJ."
      benefits={[
        "Organização de materiais impressos",
        "Versões de mesa e parede",
        "Múltiplos bolsos disponíveis",
        "Fácil reposição de materiais",
        "Design discreto e profissional",
        "Diversos tamanhos de bolso",
      ]}
      variations={[
        "Porta folder de mesa 1 bolso",
        "Porta folder de mesa múltiplos bolsos",
        "Porta folder de parede 1 bolso",
        "Porta folder de parede em cascata",
        "Porta revista",
        "Porta catálogo",
        "Porta folder A4",
        "Porta folder A5",
        "Porta folder 1/3 A4 (DL)",
      ]}
    />
  );
}
