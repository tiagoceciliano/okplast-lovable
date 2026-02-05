import { ProductPage } from "@/components/products/ProductPage";
 import { SOBMEDIDA_IMAGES } from "@/lib/images";

export default function ExpositoresOculos() {
  return (
    <ProductPage
      title="Expositores para Óculos"
      description="Expositores de acrílico desenvolvidos para óticas, lojas de acessórios e showrooms de óculos. Nossos expositores organizam e destacam cada modelo, facilitando a escolha do cliente e mantendo os produtos protegidos e bem apresentados."
       imageUrl={SOBMEDIDA_IMAGES.expositoresOculos}
       seoTitle="Expositores para Óculos em Acrílico - Óticas"
       seoDescription="Expositores de acrílico para óticas e lojas de óculos. Mesa e parede. Fabricação personalizada no RJ."
       canonical="/acrilico-sob-medida/expositores-para-oculos"
      benefits={[
        "Organização clara dos modelos",
        "Proteção das armações",
        "Fácil acesso para experimentação",
        "Design que não compete com o produto",
        "Opções de mesa e parede",
        "Personalizável com a marca da loja",
      ]}
      variations={[
        "Expositor de parede",
        "Expositor de balcão",
        "Expositor torre",
        "Expositor individual",
        "Expositor para óculos de sol",
        "Expositor para óculos de grau",
      ]}
    />
  );
}
