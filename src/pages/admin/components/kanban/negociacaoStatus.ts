import type { EtapaId, Negociacao } from "./types";

export function statusDaEtapa(etapa: EtapaId): Negociacao["status"] {
  return etapa === "perdido" ? "perdido" : etapa === "venda_realizada" ? "ganho" : "aberto";
}

export function confirmacaoEtapa(etapa: EtapaId, anterior: Negociacao["status"]): string {
  const status = statusDaEtapa(etapa);
  if (status === "perdido") return "Negociação marcada como perdida";
  if (status === "ganho") return "Negociação marcada como ganha";
  return anterior !== "aberto" ? "Negociação reaberta" : "Etapa atualizada";
}