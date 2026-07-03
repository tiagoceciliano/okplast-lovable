import { COMPANY } from "@/lib/constants";
import { SEOHead } from "@/components/SEOHead";

export default function TermoUso() {
  return (
    <>
      <SEOHead
        title="Termo de Uso - OK Plast"
        description="Termos e condições de uso do site da OK Plast Comércio LTDA."
        canonical="/termo-uso"
        noindex={true}
      />

      <section className="gradient-primary text-primary-foreground py-16 md:py-24">
        <div className="container-custom">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">Termo de Uso</h1>
          <p className="text-lg text-primary-foreground/90 max-w-2xl">
            Regras e condições para utilização dos nossos serviços
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto prose prose-lg">
            <h2 className="font-display text-2xl font-bold text-foreground">Termos e Condições de Uso</h2>
            
            <p className="text-muted-foreground">
              Ao acessar e utilizar o site da <strong className="text-foreground">{COMPANY.legalName}</strong>, 
              você concorda com os seguintes termos e condições.
            </p>

            <h3 className="font-display text-xl font-bold text-foreground mt-8">1. Aceitação dos Termos</h3>
            <p className="text-muted-foreground">Ao acessar este site, você declara que:</p>
            <ul className="text-muted-foreground space-y-2">
              <li>Leu e compreendeu integralmente estes Termos de Uso</li>
              <li>Aceita todas as disposições aqui estabelecidas</li>
              <li>Possui capacidade legal para concordar com estes termos</li>
            </ul>

            <h3 className="font-display text-xl font-bold text-foreground mt-8">2. Uso do Site</h3>
            <p className="text-muted-foreground">
              O conteúdo deste site é disponibilizado apenas para fins informativos e comerciais. 
              É expressamente proibido:
            </p>
            <ul className="text-muted-foreground space-y-2">
              <li>Utilizar o site para qualquer finalidade ilegal</li>
              <li>Reproduzir ou copiar qualquer parte do site sem autorização</li>
              <li>Tentar acessar áreas restritas ou sistemas de segurança</li>
              <li>Transmitir vírus, malware ou qualquer código malicioso</li>
            </ul>

            <h3 className="font-display text-xl font-bold text-foreground mt-8">3. Propriedade Intelectual</h3>
            <p className="text-muted-foreground">
              Todo o conteúdo do site é de propriedade da {COMPANY.legalName} ou de seus fornecedores 
              e está protegido pelas leis de direitos autorais e propriedade intelectual.
            </p>

            <h3 className="font-display text-xl font-bold text-foreground mt-8">4. Informações do Usuário</h3>
            <p className="text-muted-foreground">
              Ao fornecer informações pessoais, você garante que são verdadeiras e atualizadas. 
              A {COMPANY.legalName} se compromete a proteger suas informações de acordo com nossa Política de Privacidade.
            </p>

            <h3 className="font-display text-xl font-bold text-foreground mt-8">5. Limitação de Responsabilidade</h3>
            <p className="text-muted-foreground">
              A {COMPANY.legalName} não se responsabiliza por danos diretos, indiretos, incidentais 
              ou consequenciais resultantes do uso do site. O site é fornecido "como está".
            </p>

            <h3 className="font-display text-xl font-bold text-foreground mt-8">6. Modificações</h3>
            <p className="text-muted-foreground">
              A {COMPANY.legalName} reserva-se o direito de modificar estes Termos de Uso a qualquer 
              momento. As alterações entram em vigor imediatamente após sua publicação.
            </p>

            <h3 className="font-display text-xl font-bold text-foreground mt-8">7. Lei Aplicável</h3>
            <p className="text-muted-foreground">
              Estes Termos de Uso são regidos pelas leis da República Federativa do Brasil. 
              Qualquer disputa será submetida ao foro da comarca do Rio de Janeiro.
            </p>

            <div className="mt-8 p-6 bg-secondary rounded-lg">
              <h3 className="font-display text-xl font-bold text-foreground mb-4">Dúvidas sobre os Termos</h3>
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
