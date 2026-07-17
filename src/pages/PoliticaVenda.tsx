import { COMPANY } from "@/lib/constants";
import { SEOHead } from "@/components/SEOHead";

export default function PoliticaVenda() {
  return (
    <>
      <SEOHead
        title="Política de Venda - OK Plast"
        description="Condições comerciais, formas de pagamento, prazos e garantia. Política de venda da OK Plast Comércio LTDA."
        canonical="/home/politica-de-venda"
        noindex={true}
      />

      <section className="gradient-primary text-primary-foreground py-16 md:py-24">
        <div className="container-custom">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">Política de Venda</h1>
          <p className="text-lg text-primary-foreground/90 max-w-2xl">
            Condições comerciais e informações para sua compra
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto prose prose-lg">
            <h2 className="font-display text-2xl font-bold text-foreground">
              Condições Gerais de Venda
            </h2>
            
            <p className="text-muted-foreground">
              Ao realizar um pedido na <strong className="text-foreground">{COMPANY.legalName}</strong>, você 
              concorda com as seguintes condições de venda. Leia atentamente antes de finalizar sua compra.
            </p>

            <h3 className="font-display text-xl font-bold text-foreground mt-8">1. Orçamentos</h3>
            <p className="text-muted-foreground">Nossos orçamentos seguem as seguintes condições:</p>
            <ul className="text-muted-foreground space-y-2">
              <li>Validade de 7 (sete) dias corridos a partir da data de emissão</li>
              <li>Após esse período, os valores podem sofrer alterações sem aviso prévio</li>
              <li>São personalizados e não constituem contrato de venda até a confirmação</li>
              <li>Incluem especificações técnicas, quantidades e valores detalhados</li>
              <li>O prazo de entrega é informado junto com o orçamento</li>
            </ul>

            <h3 className="font-display text-xl font-bold text-foreground mt-8">2. Formas de Pagamento</h3>
            <p className="text-muted-foreground">Oferecemos diversas opções para sua conveniência:</p>
            <ul className="text-muted-foreground space-y-2">
              <li><strong className="text-foreground">PIX:</strong> Desconto especial à vista com confirmação imediata</li>
              <li><strong className="text-foreground">Transferência Bancária:</strong> Desconto à vista</li>
              <li><strong className="text-foreground">Boleto Bancário:</strong> À vista</li>
              <li><strong className="text-foreground">Cartão de Crédito:</strong> Até 3x sem juros</li>
            </ul>

            <h3 className="font-display text-xl font-bold text-foreground mt-8">3. Entrega</h3>
            <p className="text-muted-foreground">Disponibilizamos as seguintes opções de entrega:</p>
            <ul className="text-muted-foreground space-y-2">
              <li><strong className="text-foreground">Retirada no local:</strong> Sem custo, em nosso endereço no Rio de Janeiro</li>
              <li><strong className="text-foreground">Transportadora:</strong> Consulte-nos para saber as opções disponíveis</li>
            </ul>
            <p className="text-muted-foreground">
              O frete é calculado com base no peso, dimensões e CEP de destino.
            </p>

            <h3 className="font-display text-xl font-bold text-foreground mt-8">4. Garantia</h3>
            <p className="text-muted-foreground">
              Nossos produtos possuem garantia contra defeitos de fabricação. A garantia cobre:
            </p>
            <ul className="text-muted-foreground space-y-2">
              <li>Defeitos de fabricação comprovados</li>
              <li>Problemas estruturais decorrentes do processo produtivo</li>
            </ul>
            <p className="text-muted-foreground mt-4">A garantia <strong className="text-foreground">não cobre</strong>:</p>
            <ul className="text-muted-foreground space-y-2">
              <li>Danos causados por mau uso, quedas ou impactos</li>
              <li>Exposição excessiva ao sol ou intempéries (exceto materiais com proteção UV)</li>
              <li>Uso de produtos químicos não recomendados para limpeza</li>
              <li>Desgaste natural pelo uso prolongado</li>
            </ul>

            <h3 className="font-display text-xl font-bold text-foreground mt-8">5. Trocas e Devoluções</h3>
            <ul className="text-muted-foreground space-y-2">
              <li><strong className="text-foreground">Chapas cortadas sob medida:</strong> Não são passíveis de troca ou devolução, exceto defeito</li>
              <li><strong className="text-foreground">Chapas inteiras:</strong> Troca em até 7 dias após recebimento</li>
              <li><strong className="text-foreground">Condição:</strong> Produto deve estar em perfeitas condições e embalagem original</li>
              <li><strong className="text-foreground">Frete de devolução:</strong> Por conta do cliente, exceto em caso de defeito</li>
            </ul>

            <h3 className="font-display text-xl font-bold text-foreground mt-8">6. Cancelamento</h3>
            <ul className="text-muted-foreground space-y-2">
              <li><strong className="text-foreground">Antes do corte:</strong> Reembolso integral do valor pago</li>
              <li><strong className="text-foreground">Após o corte:</strong> Não é possível cancelar</li>
              <li><strong className="text-foreground">Prazo para reembolso:</strong> Até 10 dias úteis após aprovação</li>
            </ul>

            <div className="mt-8 p-6 bg-secondary rounded-lg">
              <h3 className="font-display text-xl font-bold text-foreground mb-4">
                Dúvidas sobre sua Compra?
              </h3>
              <p className="text-muted-foreground mb-4">
                Para esclarecer dúvidas sobre nossas políticas de venda, entre em contato:
              </p>
              <p className="text-muted-foreground">
                <strong className="text-foreground">E-mail:</strong> {COMPANY.email}<br />
                <strong className="text-foreground">WhatsApp:</strong> {COMPANY.phone}<br />
                <strong className="text-foreground">Endereço:</strong> {COMPANY.address}
              </p>
              <p className="text-muted-foreground mt-4 text-sm">
                Última atualização: Março de 2026
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
