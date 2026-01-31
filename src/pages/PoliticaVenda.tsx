import { COMPANY } from "@/lib/constants";

export default function PoliticaVenda() {
  return (
    <>
      {/* Hero */}
      <section className="gradient-primary text-primary-foreground py-16 md:py-24">
        <div className="container-custom">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Política de Venda
          </h1>
          <p className="text-lg text-primary-foreground/90 max-w-2xl">
            Condições gerais de venda e informações importantes
          </p>
        </div>
      </section>

      {/* Conteúdo */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto prose prose-lg">
            <h2 className="font-display text-2xl font-bold text-foreground">Condições Gerais de Venda</h2>
            
            <p className="text-muted-foreground">
              Ao realizar um pedido na <strong className="text-foreground">{COMPANY.name}</strong>, você 
              concorda com as seguintes condições de venda. Leia atentamente antes de finalizar sua compra.
            </p>

            <h3 className="font-display text-xl font-bold text-foreground mt-8">Orçamentos</h3>
            
            <p className="text-muted-foreground">
              Todos os orçamentos têm validade de 7 (sete) dias corridos a partir da data de emissão. 
              Após esse período, os valores podem sofrer alterações sem aviso prévio. 
              Os orçamentos são personalizados e não constituem contrato de venda até a confirmação do pedido.
            </p>

            <h3 className="font-display text-xl font-bold text-foreground mt-8">Formas de Pagamento</h3>
            
            <ul className="text-muted-foreground space-y-2">
              <li><strong className="text-foreground">PIX:</strong> Desconto especial à vista</li>
              <li><strong className="text-foreground">Transferência Bancária:</strong> Desconto à vista</li>
              <li><strong className="text-foreground">Boleto:</strong> À vista ou parcelado (sujeito a análise)</li>
              <li><strong className="text-foreground">Cartão de Crédito:</strong> Consulte condições</li>
            </ul>

            <h3 className="font-display text-xl font-bold text-foreground mt-8">Prazo de Produção</h3>
            
            <p className="text-muted-foreground">
              O prazo de produção varia de acordo com o tipo de produto, quantidade e complexidade. 
              Produtos sob medida geralmente têm prazo de 5 a 15 dias úteis após a confirmação do 
              pagamento. O prazo exato será informado no orçamento.
            </p>

            <h3 className="font-display text-xl font-bold text-foreground mt-8">Entrega</h3>
            
            <p className="text-muted-foreground">
              Realizamos entregas para todo o Brasil através de transportadoras parceiras ou Correios. 
              O frete é calculado de acordo com o peso, dimensões e CEP de destino. Retirada no local 
              também está disponível em nosso endereço em {COMPANY.address}.
            </p>

            <h3 className="font-display text-xl font-bold text-foreground mt-8">Garantia</h3>
            
            <p className="text-muted-foreground">
              Nossos produtos possuem garantia contra defeitos de fabricação. A garantia não cobre 
              danos causados por mau uso, quedas, exposição excessiva ao sol ou produtos químicos 
              não recomendados para limpeza de acrílico.
            </p>

            <h3 className="font-display text-xl font-bold text-foreground mt-8">Trocas e Devoluções</h3>
            
            <p className="text-muted-foreground">
              Produtos sob medida e personalizados não são passíveis de troca ou devolução, exceto 
              em caso de defeito de fabricação. Para produtos de pronta entrega, aceitamos troca em 
              até 7 dias após o recebimento, desde que o produto esteja em perfeitas condições e 
              na embalagem original.
            </p>

            <h3 className="font-display text-xl font-bold text-foreground mt-8">Cancelamento</h3>
            
            <p className="text-muted-foreground">
              Pedidos podem ser cancelados antes do início da produção, mediante reembolso integral 
              do valor pago. Após o início da produção, o cancelamento está sujeito a cobrança de 
              custos já incorridos.
            </p>

            <div className="mt-8 p-6 bg-secondary rounded-lg">
              <h3 className="font-display text-xl font-bold text-foreground mb-4">Dúvidas?</h3>
              <p className="text-muted-foreground">
                Entre em contato conosco para esclarecer qualquer dúvida sobre nossas políticas de venda.
              </p>
              <p className="text-muted-foreground mt-2">
                <strong className="text-foreground">E-mail:</strong> {COMPANY.email}<br />
                <strong className="text-foreground">WhatsApp:</strong> {COMPANY.whatsappFormatted}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
