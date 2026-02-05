 import { ProductPage } from "@/components/products/ProductPage";
 import { SOBMEDIDA_IMAGES } from "@/lib/images";
 
 export default function PlacaGravada() {
   return (
     <ProductPage
       title="Placa de Acrílico Gravada"
       description="Placas de acrílico com gravação a laser para homenagens, premiações e reconhecimentos. Fabricamos placas gravadas com alta precisão, disponíveis com ou sem estojo de veludo. Ideais para eventos corporativos, formaturas, troféus de reconhecimento e presentes personalizados."
       imageUrl={SOBMEDIDA_IMAGES.placaGravada}
       seoTitle="Placas de Acrílico Gravadas - Homenagens e Premiações"
       seoDescription="Placas gravadas a laser para homenagens e premiações. Com ou sem estojo de veludo. Fabricação no Rio de Janeiro."
       canonical="/acrilico-sob-medida/placa-gravada"
       benefits={[
         "Gravação a laser de alta precisão",
         "Texto e logotipos nítidos e duradouros",
         "Opção com estojo de veludo incluso",
         "Diversos tamanhos disponíveis",
         "Acrílico cristal ou colorido",
         "Ideal para premiações e homenagens",
       ]}
       variations={[
        "Placa de Homenagem",
         "Placa de formatura",
         "Placa de reconhecimento profissional",
         "Placa comemorativa",
         "Placa de tempo de serviço",
         "Placa para eventos corporativos",
         "Placa de inauguração",
       ]}
     />
   );
 }