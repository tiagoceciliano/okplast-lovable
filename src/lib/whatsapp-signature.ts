export function assinarMensagem(nome: string, texto: string, limite = 4096): string {
  const nomeLimpo = nome.replace(/[*_~`\r\n]/g, " ").replace(/\s+/g, " ").trim();
  if (!nomeLimpo) throw new Error("Não foi possível identificar o responsável pelo atendimento.");
  const assinatura = `*${nomeLimpo}*`;
  const corpo = texto.trim();
  const resultado = corpo.startsWith(`${assinatura}\n\n`) ? corpo : `${assinatura}\n\n${corpo}`;
  if (resultado.length > limite) throw new Error("A mensagem com o nome do responsável ultrapassa o limite permitido.");
  return resultado;
}