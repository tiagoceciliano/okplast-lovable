import { ProductPage } from "@/components/products/ProductPage";

export default function ExpositoresOculos() {
  return (
    <ProductPage
      title="Expositores para Óculos"
      description="Expositores de acrílico desenvolvidos para óticas, lojas de acessórios e showrooms de óculos. Nossos expositores organizam e destacam cada modelo, facilitando a escolha do cliente e mantendo os produtos protegidos e bem apresentados."
      benefits={[
        "Organização clara dos modelos",
        "Proteção das armações",
        "Fácil acesso para experimentação",
        "Design que não compete com o produto",
        "Opções de mesa e parede",
        "Personalizável com a marca da loja",
      ]}
      variations={[
        "Expositor de mesa giratório",
        "Expositor de parede",
        "Expositor de balcão",
        "Expositor torre",
        "Expositor individual",
        "Expositor para óculos de sol",
        "Expositor para óculos de grau",
        "Expositor com espelho",
      ]}
    />
  );
}
