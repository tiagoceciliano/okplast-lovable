import { ProductPage } from "@/components/products/ProductPage";

export default function PlacaSinalizacao() {
  return (
    <ProductPage
      title="Placa de Acrílico Sinalização"
      description="Placas de sinalização em acrílico para empresas, comércios, hospitais, escolas e espaços públicos. Nossas placas de sinalização combinam durabilidade, estética e funcionalidade, seguindo normas técnicas quando necessário. Ideais para identificação de ambientes, orientação de público e comunicação visual."
      benefits={[
        "Durabilidade e resistência ao tempo",
        "Conformidade com normas de sinalização",
        "Fácil instalação (adesivo ou furação)",
        "Design limpo e profissional",
        "Opções em braile disponíveis",
        "Manutenção simples",
      ]}
      variations={[
        "Placa de identificação de sala",
        "Placa de banheiro",
        "Placa de saída de emergência",
        "Placa de proibido fumar",
        "Placa direcional",
        "Placa de aviso",
        "Placa com braile",
        "Totem de sinalização",
      ]}
    />
  );
}
