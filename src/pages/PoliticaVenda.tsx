import { COMPANY } from "@/lib/constants";
 import { SEOHead } from "@/components/SEOHead";

export default function PoliticaVenda() {
  return (
    <>
       <SEOHead
         title="Política de Venda - Lab Acrílicos"
         description="Condições comerciais, formas de pagamento, prazos e garantia. Política de venda da Lab Acrílicos."
         canonical="/politica-venda"
         noindex={true}
       />
 
      {/* Hero */}
      <section className="gradient-primary text-primary-foreground py-16 md:py-24">
        <div className="container-custom">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Política de Venda
          </h1>
          <p className="text-lg text-primary-foreground/90 max-w-2xl">
            Condições comerciais e informações para sua compra
          </p>
        </div>
      </section>

      {/* Conteúdo */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto prose prose-lg">
            <h2 className="font-display text-2xl font-bold text-foreground">
              Condições Gerais de Venda
            </h2>
            
            <p className="text-muted-foreground">
              Ao realizar um pedido na <strong className="text-foreground">{COMPANY.name}</strong>, você 
              concorda com as seguintes condições de venda. Leia atentamente antes de finalizar sua compra.
            </p>

            <h3 className="font-display text-xl font-bold text-foreground mt-8">
              1. Orçamentos
            </h3>
            
            <p className="text-muted-foreground">
              Nossos orçamentos seguem as seguintes condições:
            </p>
            
            <ul className="text-muted-foreground space-y-2">
              <li>Validade de 7 (sete) dias corridos a partir da data de emissão</li>
              <li>Após esse período, os valores podem sofrer alterações sem aviso prévio</li>
              <li>São personalizados e não constituem contrato de venda até a confirmação</li>
              <li>Incluem especificações técnicas, quantidades e valores detalhados</li>
              <li>O prazo de produção é informado junto com o orçamento</li>
            </ul>

            <h3 className="font-display text-xl font-bold text-foreground mt-8">
              2. Foco Comercial e Pedidos Mínimos
            </h3>
            
            <p className="text-muted-foreground">
              A <strong className="text-foreground">{COMPANY.name}</strong> tem como foco principal 
              o atendimento a <strong className="text-foreground">empresas (Pessoa Jurídica)</strong>, 
              oferecendo soluções personalizadas para o mercado corporativo, lojistas, eventos e premiações.
            </p>
            
            <p className="text-muted-foreground mt-4">
              Para <strong className="text-foreground">pessoas físicas</strong>, atendemos pedidos com 
              valor mínimo de <strong className="text-foreground">R$ 1.000,00</strong>. Esta política 
              nos permite manter a qualidade e os prazos que nossos clientes merecem.
            </p>
            
            <ul className="text-muted-foreground space-y-2 mt-4">
              <li>Alguns produtos possuem quantidade mínima de pedido</li>
              <li>Produtos sob medida podem ter valores mínimos específicos</li>
              <li>A quantidade mínima será sempre informada no orçamento</li>
              <li>Para dúvidas sobre valores e quantidades, entre em contato conosco</li>
            </ul>

            <h3 className="font-display text-xl font-bold text-foreground mt-8">
              3. Formas de Pagamento
            </h3>
            
            <p className="text-muted-foreground">
              Oferecemos diversas opções para sua conveniência:
            </p>
            
            <ul className="text-muted-foreground space-y-2">
              <li><strong className="text-foreground">PIX:</strong> Desconto especial à vista com confirmação imediata</li>
              <li><strong className="text-foreground">Transferência Bancária:</strong> Desconto à vista</li>
              <li><strong className="text-foreground">Boleto Bancário:</strong> À vista</li>
              <li><strong className="text-foreground">Cartão de Crédito:</strong> Até 3x sem juros</li>
            </ul>

            <h3 className="font-display text-xl font-bold text-foreground mt-8">
              4. Aprovação de Arte
            </h3>
            
            <p className="text-muted-foreground">
              Para produtos personalizados, seguimos o seguinte processo:
            </p>
            
            <ul className="text-muted-foreground space-y-2">
              <li>O cliente envia a arte ou especificações desejadas</li>
              <li>Nossa equipe prepara uma prova digital para aprovação</li>
              <li>A produção só inicia após aprovação formal por escrito</li>
              <li>Alterações após aprovação podem gerar custos adicionais</li>
              <li>O cliente é responsável por revisar textos e cores antes da aprovação</li>
            </ul>

            <h3 className="font-display text-xl font-bold text-foreground mt-8">
              5. Prazo de Produção
            </h3>
            
            <p className="text-muted-foreground">
              Os prazos de produção variam de acordo com:
            </p>
            
            <ul className="text-muted-foreground space-y-2">
              <li><strong className="text-foreground">Tipo de produto:</strong> Itens simples têm prazo menor que peças complexas</li>
              <li><strong className="text-foreground">Quantidade:</strong> Pedidos maiores podem requerer prazo estendido</li>
              <li><strong className="text-foreground">Personalização:</strong> Gravação e corte especial adicionam tempo</li>
              <li><strong className="text-foreground">Prazo padrão:</strong> 5 a 15 dias úteis após confirmação do pagamento</li>
              <li><strong className="text-foreground">Início da contagem:</strong> Após aprovação da arte e confirmação de pagamento</li>
            </ul>
            
            <p className="text-muted-foreground">
              O prazo exato será informado no orçamento. Em casos urgentes, consulte disponibilidade.
            </p>

            <h3 className="font-display text-xl font-bold text-foreground mt-8">
              6. Entrega
            </h3>
            
            <p className="text-muted-foreground">
              Disponibilizamos as seguintes opções de entrega:
            </p>
            
            <ul className="text-muted-foreground space-y-2">
              <li><strong className="text-foreground">Retirada no local:</strong> Sem custo, em nosso endereço no Rio de Janeiro</li>
              <li><strong className="text-foreground">Correios:</strong> PAC ou SEDEX para todo o Brasil</li>
              <li><strong className="text-foreground">Transportadora:</strong> Para pedidos maiores ou volumes pesados</li>
              <li><strong className="text-foreground">Entrega local:</strong> Consulte disponibilidade para região metropolitana</li>
            </ul>
            
            <p className="text-muted-foreground">
              O frete é calculado com base no peso, dimensões e CEP de destino. O valor será 
              informado no orçamento.
            </p>

            <h3 className="font-display text-xl font-bold text-foreground mt-8">
              7. Garantia
            </h3>
            
            <p className="text-muted-foreground">
              Nossos produtos possuem garantia contra defeitos de fabricação. A garantia cobre:
            </p>
            
            <ul className="text-muted-foreground space-y-2">
              <li>Defeitos de fabricação comprovados</li>
              <li>Problemas estruturais decorrentes do processo produtivo</li>
              <li>Falhas em colagens e acabamentos</li>
            </ul>
            
            <p className="text-muted-foreground mt-4">
              A garantia <strong className="text-foreground">não cobre</strong>:
            </p>
            
            <ul className="text-muted-foreground space-y-2">
              <li>Danos causados por mau uso, quedas ou impactos</li>
              <li>Exposição excessiva ao sol ou intempéries</li>
              <li>Uso de produtos químicos não recomendados para limpeza</li>
              <li>Desgaste natural pelo uso prolongado</li>
              <li>Alterações ou modificações feitas pelo cliente</li>
            </ul>

            <h3 className="font-display text-xl font-bold text-foreground mt-8">
              8. Trocas e Devoluções
            </h3>
            
            <p className="text-muted-foreground">
              Nossa política de trocas segue as seguintes condições:
            </p>
            
            <ul className="text-muted-foreground space-y-2">
              <li><strong className="text-foreground">Produtos sob medida:</strong> Não são passíveis de troca ou devolução, exceto defeito de fabricação</li>
              <li><strong className="text-foreground">Produtos personalizados:</strong> Por serem exclusivos, não aceitamos devolução</li>
              <li><strong className="text-foreground">Pronta entrega:</strong> Troca em até 7 dias após recebimento</li>
              <li><strong className="text-foreground">Condição:</strong> Produto deve estar em perfeitas condições e embalagem original</li>
              <li><strong className="text-foreground">Frete de devolução:</strong> Por conta do cliente, exceto em caso de defeito</li>
            </ul>

            <h3 className="font-display text-xl font-bold text-foreground mt-8">
              9. Cancelamento
            </h3>
            
            <p className="text-muted-foreground">
              As condições para cancelamento de pedidos são:
            </p>
            
            <ul className="text-muted-foreground space-y-2">
              <li><strong className="text-foreground">Antes da produção:</strong> Reembolso integral do valor pago</li>
              <li><strong className="text-foreground">Durante a produção:</strong> Cobrança de custos já incorridos</li>
              <li><strong className="text-foreground">Após conclusão:</strong> Não é possível cancelar</li>
              <li><strong className="text-foreground">Prazo para reembolso:</strong> Até 10 dias úteis após aprovação</li>
            </ul>

            <div className="mt-8 p-6 bg-secondary rounded-lg">
              <h3 className="font-display text-xl font-bold text-foreground mb-4">
                Dúvidas sobre sua Compra?
              </h3>
              <p className="text-muted-foreground mb-4">
                Para esclarecer dúvidas sobre nossas políticas de venda ou obter mais 
                informações sobre seu pedido, entre em contato:
              </p>
              <p className="text-muted-foreground">
                <strong className="text-foreground">E-mail:</strong> {COMPANY.email}<br />
                <strong className="text-foreground">Telefone:</strong> {COMPANY.phone}<br />
                <strong className="text-foreground">WhatsApp:</strong> {COMPANY.whatsappFormatted}<br />
                <strong className="text-foreground">Endereço:</strong> {COMPANY.address}
              </p>
              <p className="text-muted-foreground mt-4 text-sm">
                Última atualização: Fevereiro de 2026
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
