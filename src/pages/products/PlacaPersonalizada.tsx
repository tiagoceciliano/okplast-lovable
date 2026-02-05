 import { ProductPage } from "@/components/products/ProductPage";
 import { SOBMEDIDA_IMAGES } from "@/lib/images";
 
 export default function PlacaPersonalizada() {
   return (
     <ProductPage
       title="Placa Personalizada de Acrílico"
       description="Placas de acrílico personalizadas para identificação de ambientes, departamentos e salas. Trabalhamos com impressão UV, recorte a laser e adesivagem para criar placas profissionais que valorizam seu espaço comercial ou corporativo."
       imageUrl={SOBMEDIDA_IMAGES.placaPersonalizada}
       seoTitle="Placas Personalizadas de Acrílico - Identificação de Ambientes"
       seoDescription="Placas personalizadas para identificação de ambientes e departamentos. Fabricação sob medida no Rio de Janeiro."
       canonical="/acrilico-sob-medida/placa-personalizada"
       benefits={[
         "Impressão UV de alta qualidade",
         "Recorte a laser preciso",
         "Design personalizado",
         "Fácil instalação",
         "Durabilidade e resistência",
         "Visual profissional e elegante",
       ]}
       variations={[
         "Placa de identificação de sala",
         "Placa de departamento",
         "Placa de recepção",
         "Placa de mesa com nome",
         "Placa de porta",
         "Placa de setor",
         "Placa de andar/piso",
       ]}
     />
   );
 }