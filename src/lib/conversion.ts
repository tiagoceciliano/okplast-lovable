/**
 * Dispara o evento de conversão do Google Ads configurado em index.html.
 * Não redireciona a página (chamada sem URL).
 */
export function reportConversion(): void {
  if (typeof window === "undefined") return;

  const gtagReport = (window as any).gtag_report_conversion;
  if (typeof gtagReport === "function") {
    try {
      gtagReport();
    } catch (error) {
      console.error("Erro ao disparar conversão:", error);
    }
  }
}
