import { supabase } from "@/integrations/supabase/client";

export interface MembroEquipe { id: string; nome: string; email: string | null; roles: string[] }

const TTL = 5 * 60 * 1000;
let equipeCache: { at: number; data: MembroEquipe[] } | null = null;
let equipeInflight: Promise<MembroEquipe[]> | null = null;

/** Lista da equipe compartilhada entre telas (evita buscar a cada componente). */
export function getEquipe(force = false): Promise<MembroEquipe[]> {
  if (!force && equipeCache && Date.now() - equipeCache.at < TTL) return Promise.resolve(equipeCache.data);
  if (!force && equipeInflight) return equipeInflight;
  equipeInflight = Promise.resolve(supabase.rpc("list_equipe")).then(({ data }) => {
    const lista = (data ?? []).map((u) => ({ id: u.id, nome: u.nome, email: u.email ?? null, roles: u.roles ?? [] }));
    equipeCache = { at: Date.now(), data: lista };
    equipeInflight = null;
    return lista;
  }, (e) => { equipeInflight = null; throw e; });
  return equipeInflight;
}

/** Cache simples em memória por chave, para mostrar dados na hora ao voltar para a tela. */
const memo = new Map<string, unknown>();
export const memoGet = <T,>(k: string) => memo.get(k) as T | undefined;
export const memoSet = (k: string, v: unknown) => { memo.set(k, v); };
