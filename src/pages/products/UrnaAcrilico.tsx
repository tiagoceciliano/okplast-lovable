import { ProductPage } from "@/components/products/ProductPage";

export default function UrnaAcrilico() {
  return (
    <ProductPage
      title="Urna de Acrílico"
      description="Urnas de acrílico para sorteios, votações, promoções e coleta de cupons. Fabricadas com acrílico de alta qualidade, nossas urnas são transparentes para demonstrar a lisura do processo, ou podem ser opacas para garantir sigilo. Personalizamos conforme a necessidade do seu evento ou estabelecimento."
      benefits={[
        "Transparência para processos públicos",
        "Opção com acrílico opaco para sigilo",
        "Abertura superior para inserção de votos/cupons",
        "Tampa com cadeado para segurança",
        "Personalização com logotipo",
        "Fácil abertura para contagem",
      ]}
      variations={[
        "Urna transparente",
        "Urna com acrílico branco/opaco",
        "Urna com suporte de mesa",
        "Urna de piso (tamanho grande)",
        "Urna com cadeado incluso",
        "Urna personalizada com adesivo",
        "Urna para votação eletrônica",
      ]}
    />
  );
}
