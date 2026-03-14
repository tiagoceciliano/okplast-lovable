interface FAQSectionProps {
  faqs: { question: string; answer: string }[];
  title?: string;
}

export function FAQSection({ faqs, title = "Perguntas Frequentes" }: FAQSectionProps) {
  return (
    <section className="section-padding">
      <div className="container-custom max-w-4xl">
        <h2 className="font-bold text-2xl md:text-3xl text-foreground mb-8 text-center">
          {title}
        </h2>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-background border border-border rounded-lg p-6">
              <h3 className="font-semibold text-foreground text-lg mb-2">{faq.question}</h3>
              <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
