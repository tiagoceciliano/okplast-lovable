import { ProductPage } from "@/components/products/ProductPage";

export default function CaixaSugestao() {
  return (
    <ProductPage
      title="Caixa de Sugestão"
      description="Caixas de sugestão em acrílico para coletar feedback de clientes, funcionários e visitantes de forma organizada e profissional. Nossas caixas podem ser personalizadas com a identidade visual da sua empresa e são ideais para recepções, estabelecimentos comerciais, hospitais e instituições."
      benefits={[
        "Design profissional e discreto",
        "Abertura para inserção de formulários",
        "Tampa com fechadura para segurança",
        "Espaço para identificação ou logotipo",
        "Fácil instalação em parede ou mesa",
        "Capacidade para diversos tamanhos de formulário",
      ]}
      variations={[
        "Caixa de sugestão de mesa",
        "Caixa de sugestão de parede",
        "Caixa com porta-cartaz A4",
        "Caixa com acrílico colorido",
        "Caixa com gravação a laser",
        "Caixa com compartimento para canetas",
      ]}
    />
  );
}
