import { COMPANY } from "@/lib/constants";

export default function TermoUso() {
  return (
    <>
      {/* Hero */}
      <section className="gradient-primary text-primary-foreground py-16 md:py-24">
        <div className="container-custom">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Termo de Uso
          </h1>
          <p className="text-lg text-primary-foreground/90 max-w-2xl">
            Termos e condições de uso do site
          </p>
        </div>
      </section>

      {/* Conteúdo */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto prose prose-lg">
            <h2 className="font-display text-2xl font-bold text-foreground">Termos e Condições de Uso</h2>
            
            <p className="text-muted-foreground">
              Ao acessar e utilizar o site da <strong className="text-foreground">{COMPANY.name}</strong>, 
              você concorda com os seguintes termos e condições. Leia atentamente antes de continuar navegando.
            </p>

            <h3 className="font-display text-xl font-bold text-foreground mt-8">1. Aceitação dos Termos</h3>
            
            <p className="text-muted-foreground">
              Ao acessar este site, você declara ter lido, compreendido e aceito integralmente estes 
              Termos de Uso. Se você não concordar com alguma disposição, recomendamos que não utilize 
              nossos serviços.
            </p>

            <h3 className="font-display text-xl font-bold text-foreground mt-8">2. Uso do Site</h3>
            
            <p className="text-muted-foreground">
              O conteúdo deste site é disponibilizado apenas para fins informativos e comerciais. 
              É proibido utilizar o site para qualquer finalidade ilegal ou não autorizada. Você 
              concorda em não reproduzir, duplicar, copiar, vender ou explorar qualquer parte do 
              site sem autorização expressa.
            </p>

            <h3 className="font-display text-xl font-bold text-foreground mt-8">3. Propriedade Intelectual</h3>
            
            <p className="text-muted-foreground">
              Todo o conteúdo do site, incluindo textos, imagens, logotipos, ícones e software, é 
              de propriedade da {COMPANY.name} ou de seus fornecedores e está protegido pelas leis 
              de direitos autorais e propriedade intelectual.
            </p>

            <h3 className="font-display text-xl font-bold text-foreground mt-8">4. Informações do Usuário</h3>
            
            <p className="text-muted-foreground">
              Ao fornecer informações pessoais através de formulários ou outros meios, você garante 
              que as informações são verdadeiras e atualizadas. A {COMPANY.name} se compromete a 
              proteger suas informações de acordo com nossa política de privacidade.
            </p>

            <h3 className="font-display text-xl font-bold text-foreground mt-8">5. Limitação de Responsabilidade</h3>
            
            <p className="text-muted-foreground">
              A {COMPANY.name} não se responsabiliza por danos diretos, indiretos, incidentais ou 
              consequenciais resultantes do uso ou da impossibilidade de uso do site. O site é 
              fornecido "como está", sem garantias de qualquer tipo.
            </p>

            <h3 className="font-display text-xl font-bold text-foreground mt-8">6. Links Externos</h3>
            
            <p className="text-muted-foreground">
              Este site pode conter links para sites de terceiros. A {COMPANY.name} não se 
              responsabiliza pelo conteúdo, políticas de privacidade ou práticas de sites externos.
            </p>

            <h3 className="font-display text-xl font-bold text-foreground mt-8">7. Modificações</h3>
            
            <p className="text-muted-foreground">
              A {COMPANY.name} reserva-se o direito de modificar estes Termos de Uso a qualquer 
              momento, sem aviso prévio. As alterações entram em vigor imediatamente após sua 
              publicação no site.
            </p>

            <h3 className="font-display text-xl font-bold text-foreground mt-8">8. Lei Aplicável</h3>
            
            <p className="text-muted-foreground">
              Estes Termos de Uso são regidos pelas leis da República Federativa do Brasil. 
              Qualquer disputa relacionada a estes termos será submetida ao foro da comarca 
              do Rio de Janeiro.
            </p>

            <div className="mt-8 p-6 bg-secondary rounded-lg">
              <h3 className="font-display text-xl font-bold text-foreground mb-4">Contato</h3>
              <p className="text-muted-foreground">
                Para dúvidas sobre estes Termos de Uso, entre em contato:
              </p>
              <p className="text-muted-foreground mt-2">
                <strong className="text-foreground">E-mail:</strong> {COMPANY.email}<br />
                <strong className="text-foreground">Telefone:</strong> {COMPANY.phone}
              </p>
              <p className="text-muted-foreground mt-4 text-sm">
                Última atualização: Janeiro de 2024
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
