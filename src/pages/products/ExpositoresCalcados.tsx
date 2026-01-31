import { ProductPage } from "@/components/products/ProductPage";

export default function ExpositoresCalcados() {
  return (
    <ProductPage
      title="Expositores para Calçados"
      description="Expositores de acrílico para apresentação de calçados em lojas, vitrines e showrooms. Nossos expositores elevam o produto, proporcionando melhor visibilidade e uma apresentação profissional que valoriza o calçado e atrai a atenção do cliente."
      benefits={[
        "Eleva o produto para destaque",
        "Design minimalista e elegante",
        "Suporta diferentes tamanhos de calçado",
        "Fácil reposição de produtos",
        "Resistente para uso comercial",
        "Versões para vitrine e prateleira",
      ]}
      variations={[
        "Expositor individual",
        "Expositor em escada",
        "Expositor para tênis",
        "Expositor para salto alto",
        "Expositor para sandália",
        "Expositor com inclinação",
        "Kit expositores sortidos",
      ]}
    />
  );
}
