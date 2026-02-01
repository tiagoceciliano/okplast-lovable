import { COMPANY } from "@/lib/constants";

export default function PoliticaPrivacidade() {
  return (
    <>
      {/* Hero */}
      <section className="gradient-primary text-primary-foreground py-16 md:py-24">
        <div className="container-custom">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Política de Privacidade
          </h1>
          <p className="text-lg text-primary-foreground/90 max-w-2xl">
            Como protegemos seus dados pessoais conforme a LGPD
          </p>
        </div>
      </section>

      {/* Conteúdo */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto prose prose-lg">
            <h2 className="font-display text-2xl font-bold text-foreground">
              Lei Geral de Proteção de Dados (LGPD)
            </h2>
            
            <p className="text-muted-foreground">
              A <strong className="text-foreground">{COMPANY.name}</strong> está comprometida com a 
              proteção dos dados pessoais de seus clientes, parceiros e visitantes, em conformidade 
              com a Lei nº 13.709/2018 (Lei Geral de Proteção de Dados Pessoais - LGPD).
            </p>

            <h3 className="font-display text-xl font-bold text-foreground mt-8">
              1. Dados Coletados
            </h3>
            
            <p className="text-muted-foreground">
              Coletamos os seguintes dados pessoais quando você entra em contato conosco ou 
              solicita um orçamento:
            </p>
            
            <ul className="text-muted-foreground space-y-2">
              <li><strong className="text-foreground">Nome completo:</strong> para identificação e comunicação</li>
              <li><strong className="text-foreground">E-mail:</strong> para envio de orçamentos e comunicações</li>
              <li><strong className="text-foreground">Telefone/WhatsApp:</strong> para contato e atendimento</li>
              <li><strong className="text-foreground">Cidade/Estado:</strong> para cálculo de frete e logística</li>
              <li><strong className="text-foreground">Mensagem:</strong> detalhes do produto ou serviço solicitado</li>
            </ul>

            <h3 className="font-display text-xl font-bold text-foreground mt-8">
              2. Finalidade do Tratamento
            </h3>
            
            <p className="text-muted-foreground">
              Os dados pessoais coletados são utilizados para as seguintes finalidades:
            </p>
            
            <ul className="text-muted-foreground space-y-2">
              <li>Responder solicitações de orçamento e informações</li>
              <li>Prestar atendimento ao cliente</li>
              <li>Processar e gerenciar pedidos</li>
              <li>Enviar comunicações relacionadas aos nossos produtos e serviços</li>
              <li>Cumprir obrigações legais e regulatórias</li>
            </ul>

            <h3 className="font-display text-xl font-bold text-foreground mt-8">
              3. Base Legal para o Tratamento (Art. 7º da LGPD)
            </h3>
            
            <p className="text-muted-foreground">
              O tratamento dos dados pessoais é realizado com base nas seguintes hipóteses legais 
              previstas no Art. 7º da LGPD:
            </p>
            
            <ul className="text-muted-foreground space-y-2">
              <li><strong className="text-foreground">Consentimento do titular:</strong> quando você nos fornece seus dados voluntariamente</li>
              <li><strong className="text-foreground">Execução de contrato:</strong> para processar pedidos e fornecer produtos/serviços</li>
              <li><strong className="text-foreground">Legítimo interesse:</strong> para melhorar nossos serviços e atendimento</li>
              <li><strong className="text-foreground">Cumprimento de obrigação legal:</strong> para atender exigências fiscais e legais</li>
            </ul>

            <h3 className="font-display text-xl font-bold text-foreground mt-8">
              4. Compartilhamento de Dados
            </h3>
            
            <p className="text-muted-foreground">
              Seus dados pessoais podem ser compartilhados com:
            </p>
            
            <ul className="text-muted-foreground space-y-2">
              <li>Transportadoras para entrega de produtos</li>
              <li>Instituições financeiras para processamento de pagamentos</li>
              <li>Autoridades governamentais quando exigido por lei</li>
            </ul>
            
            <p className="text-muted-foreground">
              <strong className="text-foreground">Não vendemos, alugamos ou compartilhamos</strong> seus 
              dados pessoais com terceiros para fins de marketing sem seu consentimento expresso.
            </p>

            <h3 className="font-display text-xl font-bold text-foreground mt-8">
              5. Armazenamento e Segurança
            </h3>
            
            <p className="text-muted-foreground">
              Os dados pessoais são armazenados em servidores seguros, protegidos por medidas 
              técnicas e administrativas adequadas, incluindo:
            </p>
            
            <ul className="text-muted-foreground space-y-2">
              <li>Criptografia de dados em trânsito e em repouso</li>
              <li>Controle de acesso restrito a funcionários autorizados</li>
              <li>Monitoramento contínuo de segurança</li>
              <li>Backups regulares</li>
            </ul>
            
            <p className="text-muted-foreground">
              Os dados são mantidos pelo tempo necessário para cumprir as finalidades descritas 
              ou conforme exigido por lei.
            </p>

            <h3 className="font-display text-xl font-bold text-foreground mt-8">
              6. Direitos do Titular dos Dados
            </h3>
            
            <p className="text-muted-foreground">
              Conforme a LGPD, você possui os seguintes direitos sobre seus dados pessoais:
            </p>
            
            <ul className="text-muted-foreground space-y-2">
              <li><strong className="text-foreground">Confirmação:</strong> saber se tratamos seus dados</li>
              <li><strong className="text-foreground">Acesso:</strong> obter cópia dos seus dados</li>
              <li><strong className="text-foreground">Correção:</strong> solicitar atualização de dados incompletos ou desatualizados</li>
              <li><strong className="text-foreground">Anonimização ou eliminação:</strong> solicitar que dados desnecessários sejam anonimizados ou excluídos</li>
              <li><strong className="text-foreground">Portabilidade:</strong> receber seus dados em formato estruturado</li>
              <li><strong className="text-foreground">Revogação do consentimento:</strong> retirar seu consentimento a qualquer momento</li>
              <li><strong className="text-foreground">Oposição:</strong> opor-se ao tratamento em determinadas situações</li>
            </ul>

            <h3 className="font-display text-xl font-bold text-foreground mt-8">
              7. Cookies e Tecnologias de Rastreamento
            </h3>
            
            <p className="text-muted-foreground">
              Nosso site pode utilizar cookies e tecnologias similares para melhorar sua 
              experiência de navegação. Cookies são pequenos arquivos de texto armazenados 
              em seu dispositivo que nos ajudam a:
            </p>
            
            <ul className="text-muted-foreground space-y-2">
              <li>Lembrar suas preferências</li>
              <li>Analisar o tráfego do site</li>
              <li>Melhorar a funcionalidade do site</li>
            </ul>
            
            <p className="text-muted-foreground">
              Você pode configurar seu navegador para recusar cookies, mas isso pode afetar 
              algumas funcionalidades do site.
            </p>

            <h3 className="font-display text-xl font-bold text-foreground mt-8">
              8. Alterações nesta Política
            </h3>
            
            <p className="text-muted-foreground">
              Esta Política de Privacidade pode ser atualizada periodicamente para refletir 
              mudanças em nossas práticas ou na legislação aplicável. Recomendamos que você 
              revise esta página regularmente para se manter informado.
            </p>

            <div className="mt-8 p-6 bg-secondary rounded-lg">
              <h3 className="font-display text-xl font-bold text-foreground mb-4">
                Encarregado de Dados (DPO) - Contato
              </h3>
              <p className="text-muted-foreground mb-4">
                Para exercer seus direitos ou esclarecer dúvidas sobre o tratamento de seus 
                dados pessoais, entre em contato conosco:
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
