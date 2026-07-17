import { COMPANY } from "@/lib/constants";
import { SEOHead } from "@/components/SEOHead";

export default function PoliticaPrivacidade() {
  return (
    <>
      <SEOHead
        title="Política de Privacidade - OK Plast"
        description="Como protegemos seus dados pessoais conforme a LGPD. Política de privacidade da OK Plast Comércio LTDA."
        canonical="/home/politica-de-privacidade"
        noindex={true}
      />

      <section className="gradient-primary text-primary-foreground py-16 md:py-24">
        <div className="container-custom">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">Política de Privacidade</h1>
          <p className="text-lg text-primary-foreground/90 max-w-2xl">
            Como protegemos seus dados pessoais conforme a LGPD
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto prose prose-lg">
            <h2 className="font-display text-2xl font-bold text-foreground">Lei Geral de Proteção de Dados (LGPD)</h2>
            
            <p className="text-muted-foreground">
              A <strong className="text-foreground">{COMPANY.legalName}</strong> está comprometida com a 
              proteção dos dados pessoais de seus clientes, parceiros e visitantes, em conformidade 
              com a Lei nº 13.709/2018 (LGPD).
            </p>

            <h3 className="font-display text-xl font-bold text-foreground mt-8">1. Dados Coletados</h3>
            <ul className="text-muted-foreground space-y-2">
              <li><strong className="text-foreground">Nome completo:</strong> para identificação e comunicação</li>
              <li><strong className="text-foreground">E-mail:</strong> para envio de orçamentos e comunicações</li>
              <li><strong className="text-foreground">Telefone/WhatsApp:</strong> para contato e atendimento</li>
              <li><strong className="text-foreground">Cidade/Estado:</strong> para cálculo de frete e logística</li>
              <li><strong className="text-foreground">Mensagem:</strong> detalhes do produto solicitado</li>
            </ul>

            <h3 className="font-display text-xl font-bold text-foreground mt-8">2. Finalidade do Tratamento</h3>
            <ul className="text-muted-foreground space-y-2">
              <li>Responder solicitações de orçamento e informações</li>
              <li>Prestar atendimento ao cliente</li>
              <li>Processar e gerenciar pedidos</li>
              <li>Cumprir obrigações legais e regulatórias</li>
            </ul>

            <h3 className="font-display text-xl font-bold text-foreground mt-8">3. Compartilhamento de Dados</h3>
            <p className="text-muted-foreground">Seus dados podem ser compartilhados com:</p>
            <ul className="text-muted-foreground space-y-2">
              <li>Transportadoras para entrega de produtos</li>
              <li>Instituições financeiras para processamento de pagamentos</li>
              <li>Autoridades governamentais quando exigido por lei</li>
            </ul>
            <p className="text-muted-foreground">
              <strong className="text-foreground">Não vendemos ou compartilhamos</strong> seus dados com terceiros para fins de marketing.
            </p>

            <h3 className="font-display text-xl font-bold text-foreground mt-8">4. Direitos do Titular dos Dados</h3>
            <p className="text-muted-foreground">Conforme a LGPD, você possui os seguintes direitos:</p>
            <ul className="text-muted-foreground space-y-2">
              <li><strong className="text-foreground">Acesso:</strong> obter cópia dos seus dados</li>
              <li><strong className="text-foreground">Correção:</strong> solicitar atualização de dados</li>
              <li><strong className="text-foreground">Eliminação:</strong> solicitar exclusão de dados desnecessários</li>
              <li><strong className="text-foreground">Portabilidade:</strong> receber seus dados em formato estruturado</li>
              <li><strong className="text-foreground">Revogação do consentimento:</strong> retirar seu consentimento a qualquer momento</li>
            </ul>

            <h3 className="font-display text-xl font-bold text-foreground mt-8">5. Alterações nesta Política</h3>
            <p className="text-muted-foreground">
              Esta Política de Privacidade pode ser atualizada periodicamente. Recomendamos que você revise esta página regularmente.
            </p>

            <div className="mt-8 p-6 bg-secondary rounded-lg">
              <h3 className="font-display text-xl font-bold text-foreground mb-4">Encarregado de Dados (DPO) - Contato</h3>
              <p className="text-muted-foreground mb-4">Entre em contato:</p>
              <p className="text-muted-foreground">
                <strong className="text-foreground">E-mail:</strong> {COMPANY.email}<br />
                <strong className="text-foreground">WhatsApp:</strong> {COMPANY.phone}<br />
                <strong className="text-foreground">Endereço:</strong> {COMPANY.address}
              </p>
              <p className="text-muted-foreground mt-4 text-sm">Última atualização: Março de 2026</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
