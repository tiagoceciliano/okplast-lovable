import { ProductPage } from "@/components/products/ProductPage";

export default function ExpositoresBijuterias() {
  return (
    <ProductPage
      title="Expositores para Bijuterias"
      description="Expositores de acrílico especialmente projetados para valorizar a apresentação de bijuterias, joias, semi-joias e acessórios. Nossos expositores são desenvolvidos para destacar cada peça, facilitando a visualização pelo cliente e otimizando o espaço da vitrine ou balcão."
      benefits={[
        "Design que valoriza cada peça",
        "Acrílico cristal de alta transparência",
        "Organização otimizada de espaço",
        "Fácil manuseio e limpeza",
        "Modelos para vitrine e balcão",
        "Diversos tamanhos e configurações",
      ]}
      variations={[
        "Expositor de brincos",
        "Expositor de colares",
        "Expositor de pulseiras",
        "Expositor de anéis",
        "Expositor giratório",
        "Expositor de conjunto completo",
        "Expositor de vitrine",
        "Expositor de balcão",
      ]}
    />
  );
}
