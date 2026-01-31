import { COMPANY } from "@/lib/constants";

export default function PoliticaRevenda() {
  return (
    <>
      {/* Hero */}
      <section className="gradient-primary text-primary-foreground py-16 md:py-24">
        <div className="container-custom">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Política de Revenda
          </h1>
          <p className="text-lg text-primary-foreground/90 max-w-2xl">
            Condições e informações para revendedores
          </p>
        </div>
      </section>

      {/* Conteúdo */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto prose prose-lg">
            <h2 className="font-display text-2xl font-bold text-foreground">Programa de Revenda {COMPANY.name}</h2>
            
            <p className="text-muted-foreground">
              A <strong className="text-foreground">{COMPANY.name}</strong> oferece condições especiais para 
              revendedores que desejam comercializar nossos produtos. Nosso programa de revenda foi 
              desenvolvido para apoiar parceiros comerciais em todo o Brasil.
            </p>

            <h3 className="font-display text-xl font-bold text-foreground mt-8">Requisitos para Revenda</h3>
            
            <ul className="text-muted-foreground space-y-2">
              <li>CNPJ ativo e regularizado</li>
              <li>Cadastro completo com documentação da empresa</li>
              <li>Pedido mínimo conforme tabela de revenda</li>
              <li>Concordância com os termos desta política</li>
            </ul>

            <h3 className="font-display text-xl font-bold text-foreground mt-8">Benefícios do Revendedor</h3>
            
            <ul className="text-muted-foreground space-y-2">
              <li>Preços diferenciados com desconto progressivo por volume</li>
              <li>Condições especiais de pagamento</li>
              <li>Suporte técnico especializado</li>
              <li>Material de apoio para vendas</li>
              <li>Prioridade no atendimento e produção</li>
            </ul>

            <h3 className="font-display text-xl font-bold text-foreground mt-8">Pedido Mínimo</h3>
            
            <p className="text-muted-foreground">
              Para ter acesso às condições de revenda, é necessário realizar um pedido mínimo. 
              Os valores e quantidades mínimas variam de acordo com a categoria de produto. 
              Entre em contato com nossa equipe comercial para mais informações.
            </p>

            <h3 className="font-display text-xl font-bold text-foreground mt-8">Frete e Entrega</h3>
            
            <p className="text-muted-foreground">
              O frete para revendedores segue tabela específica, podendo ser CIF (frete incluso) 
              ou FOB (frete por conta do comprador), dependendo do valor do pedido e região de entrega. 
              Consulte as condições no momento do pedido.
            </p>

            <h3 className="font-display text-xl font-bold text-foreground mt-8">Como se Tornar Revendedor</h3>
            
            <p className="text-muted-foreground">
              Para se cadastrar como revendedor, entre em contato conosco através do formulário 
              de orçamento ou diretamente pelo WhatsApp. Nossa equipe comercial irá apresentar 
              todas as condições e iniciar seu cadastro.
            </p>

            <div className="mt-8 p-6 bg-secondary rounded-lg">
              <h3 className="font-display text-xl font-bold text-foreground mb-4">Contato Comercial</h3>
              <p className="text-muted-foreground mb-2">
                <strong className="text-foreground">E-mail:</strong> {COMPANY.email}
              </p>
              <p className="text-muted-foreground mb-2">
                <strong className="text-foreground">WhatsApp:</strong> {COMPANY.whatsappFormatted}
              </p>
              <p className="text-muted-foreground">
                <strong className="text-foreground">Telefone:</strong> {COMPANY.phone}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
