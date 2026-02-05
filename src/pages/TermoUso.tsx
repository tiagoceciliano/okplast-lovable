import { COMPANY } from "@/lib/constants";
 import { SEOHead } from "@/components/SEOHead";

export default function TermoUso() {
  return (
    <>
       <SEOHead
         title="Termo de Uso - Lab Acrílicos"
         description="Termos e condições de uso do site da Lab Acrílicos."
         canonical="/termo-uso"
         noindex={true}
       />
 
      {/* Hero */}
      <section className="gradient-primary text-primary-foreground py-16 md:py-24">
        <div className="container-custom">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Termo de Uso
          </h1>
          <p className="text-lg text-primary-foreground/90 max-w-2xl">
            Regras e condições para utilização dos nossos serviços
          </p>
        </div>
      </section>

      {/* Conteúdo */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto prose prose-lg">
            <h2 className="font-display text-2xl font-bold text-foreground">
              Termos e Condições de Uso
            </h2>
            
            <p className="text-muted-foreground">
              Ao acessar e utilizar o site da <strong className="text-foreground">{COMPANY.name}</strong>, 
              você concorda com os seguintes termos e condições. Leia atentamente antes de continuar navegando.
            </p>

            <h3 className="font-display text-xl font-bold text-foreground mt-8">
              1. Aceitação dos Termos
            </h3>
            
            <p className="text-muted-foreground">
              Ao acessar este site, você declara que:
            </p>
            
            <ul className="text-muted-foreground space-y-2">
              <li>Leu e compreendeu integralmente estes Termos de Uso</li>
              <li>Aceita todas as disposições aqui estabelecidas</li>
              <li>Possui capacidade legal para concordar com estes termos</li>
              <li>Compromete-se a utilizá-los de acordo com a legislação vigente</li>
            </ul>
            
            <p className="text-muted-foreground">
              Se você não concordar com alguma disposição, recomendamos que não utilize nossos serviços.
            </p>

            <h3 className="font-display text-xl font-bold text-foreground mt-8">
              2. Uso do Site
            </h3>
            
            <p className="text-muted-foreground">
              O conteúdo deste site é disponibilizado apenas para fins informativos e comerciais. 
              É expressamente proibido:
            </p>
            
            <ul className="text-muted-foreground space-y-2">
              <li>Utilizar o site para qualquer finalidade ilegal ou não autorizada</li>
              <li>Reproduzir, duplicar ou copiar qualquer parte do site sem autorização expressa</li>
              <li>Vender, alugar ou explorar comercialmente o conteúdo do site</li>
              <li>Modificar, adaptar ou criar obras derivadas do conteúdo</li>
              <li>Tentar acessar áreas restritas ou sistemas de segurança</li>
              <li>Transmitir vírus, malware ou qualquer código malicioso</li>
              <li>Coletar informações de outros usuários sem consentimento</li>
            </ul>

            <h3 className="font-display text-xl font-bold text-foreground mt-8">
              3. Propriedade Intelectual
            </h3>
            
            <p className="text-muted-foreground">
              Todo o conteúdo do site é de propriedade da {COMPANY.name} ou de seus fornecedores 
              e está protegido pelas leis de direitos autorais e propriedade intelectual, incluindo:
            </p>
            
            <ul className="text-muted-foreground space-y-2">
              <li><strong className="text-foreground">Textos:</strong> descrições de produtos, artigos e conteúdo editorial</li>
              <li><strong className="text-foreground">Imagens:</strong> fotografias, ilustrações e elementos gráficos</li>
              <li><strong className="text-foreground">Logotipos:</strong> marca {COMPANY.name} e identidade visual</li>
              <li><strong className="text-foreground">Ícones:</strong> elementos de interface e navegação</li>
              <li><strong className="text-foreground">Software:</strong> código-fonte, scripts e funcionalidades</li>
              <li><strong className="text-foreground">Layout:</strong> design, estrutura e organização visual</li>
            </ul>

            <h3 className="font-display text-xl font-bold text-foreground mt-8">
              4. Informações do Usuário
            </h3>
            
            <p className="text-muted-foreground">
              Ao fornecer informações pessoais através de formulários ou outros meios, você:
            </p>
            
            <ul className="text-muted-foreground space-y-2">
              <li>Garante que as informações fornecidas são verdadeiras e atualizadas</li>
              <li>Autoriza o uso dessas informações para as finalidades descritas</li>
              <li>Compromete-se a manter seus dados atualizados</li>
              <li>É responsável pela veracidade das informações prestadas</li>
            </ul>
            
            <p className="text-muted-foreground">
              A {COMPANY.name} se compromete a proteger suas informações de acordo com nossa 
              Política de Privacidade.
            </p>

            <h3 className="font-display text-xl font-bold text-foreground mt-8">
              5. Condições de Compra
            </h3>
            
            <p className="text-muted-foreground">
              As transações comerciais realizadas através deste site estão sujeitas às seguintes condições:
            </p>
            
            <ul className="text-muted-foreground space-y-2">
              <li>Os preços e disponibilidade dos produtos podem ser alterados sem aviso prévio</li>
              <li>Os orçamentos enviados têm validade específica informada no momento da solicitação</li>
              <li>A confirmação do pedido está sujeita à aprovação de crédito e disponibilidade</li>
              <li>Condições de pagamento, entrega e garantia seguem nossa Política de Venda</li>
              <li>Produtos personalizados não são passíveis de troca ou devolução</li>
            </ul>
            
            <p className="text-muted-foreground">
              Para informações detalhadas, consulte nossa <strong className="text-foreground">Política de Venda</strong>.
            </p>

            <h3 className="font-display text-xl font-bold text-foreground mt-8">
              6. Limitação de Responsabilidade
            </h3>
            
            <p className="text-muted-foreground">
              A {COMPANY.name} não se responsabiliza por:
            </p>
            
            <ul className="text-muted-foreground space-y-2">
              <li>Danos diretos, indiretos, incidentais ou consequenciais resultantes do uso do site</li>
              <li>Interrupções temporárias no funcionamento do site</li>
              <li>Erros ou imprecisões nas informações disponibilizadas</li>
              <li>Incompatibilidade do site com dispositivos ou navegadores específicos</li>
              <li>Ações de terceiros que afetem a disponibilidade do serviço</li>
              <li>Perda de dados decorrente de falhas técnicas ou de conexão</li>
            </ul>
            
            <p className="text-muted-foreground">
              O site é fornecido "como está", sem garantias de qualquer tipo, expressas ou implícitas.
            </p>

            <h3 className="font-display text-xl font-bold text-foreground mt-8">
              7. Links Externos
            </h3>
            
            <p className="text-muted-foreground">
              Este site pode conter links para sites de terceiros. A {COMPANY.name}:
            </p>
            
            <ul className="text-muted-foreground space-y-2">
              <li>Não se responsabiliza pelo conteúdo de sites externos</li>
              <li>Não endossa produtos, serviços ou informações de terceiros</li>
              <li>Não controla as políticas de privacidade de sites vinculados</li>
              <li>Recomenda a leitura dos termos de uso de cada site acessado</li>
            </ul>

            <h3 className="font-display text-xl font-bold text-foreground mt-8">
              8. Rescisão
            </h3>
            
            <p className="text-muted-foreground">
              A {COMPANY.name} reserva-se o direito de:
            </p>
            
            <ul className="text-muted-foreground space-y-2">
              <li>Suspender ou encerrar o acesso de usuários que violem estes termos</li>
              <li>Modificar, suspender ou descontinuar qualquer funcionalidade do site</li>
              <li>Recusar atendimento a usuários que apresentem comportamento inadequado</li>
              <li>Tomar medidas legais cabíveis em caso de uso indevido</li>
            </ul>

            <h3 className="font-display text-xl font-bold text-foreground mt-8">
              9. Modificações
            </h3>
            
            <p className="text-muted-foreground">
              A {COMPANY.name} reserva-se o direito de modificar estes Termos de Uso a qualquer 
              momento, sem aviso prévio. As alterações entram em vigor imediatamente após sua 
              publicação no site. O uso continuado do site após alterações constitui aceitação 
              dos novos termos.
            </p>

            <h3 className="font-display text-xl font-bold text-foreground mt-8">
              10. Lei Aplicável
            </h3>
            
            <p className="text-muted-foreground">
              Estes Termos de Uso são regidos pelas leis da República Federativa do Brasil. 
              Qualquer disputa relacionada a estes termos será submetida ao foro da comarca 
              do Rio de Janeiro, com exclusão de qualquer outro, por mais privilegiado que seja.
            </p>

            <div className="mt-8 p-6 bg-secondary rounded-lg">
              <h3 className="font-display text-xl font-bold text-foreground mb-4">
                Dúvidas sobre os Termos
              </h3>
              <p className="text-muted-foreground mb-4">
                Para esclarecer dúvidas sobre estes Termos de Uso ou sobre a utilização 
                do nosso site, entre em contato:
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
