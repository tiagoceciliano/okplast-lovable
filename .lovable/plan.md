

# Plano: Garantir Captura de UTMs no Carregamento Inicial

## Diagnostico

O sistema atual captura UTMs no momento em que o modulo `useUTM.ts` e importado. Porem, ha uma **condicao de corrida** quando:

1. O dominio custom (`labacrilicos.com.br`) pode ter um redirect no servidor
2. O navegador pode ter cache de sessao anterior sem UTMs
3. O modulo pode ser carregado antes de `window.location` estar atualizado

**Evidencia**: Alguns leads capturam UTMs corretamente (`tititimkafj@gmail.com`), outros nao (`Jaifjoakjs@gmail.com.br`).

---

## Solucao

Mover a captura de UTMs para o **ponto mais inicial possivel** do aplicativo: o `main.tsx`, **antes** do React renderizar.

### Alteracoes

**Arquivo 1:** `src/main.tsx`

Adicionar chamada de captura de UTMs antes do `createRoot`:

```typescript
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Captura UTMs imediatamente, antes do React inicializar
import "@/hooks/useUTM";

createRoot(document.getElementById("root")!).render(<App />);
```

**Arquivo 2:** `src/hooks/useUTM.ts`

Adicionar log mais detalhado para debug e garantir que a captura execute sempre:

```typescript
// Adicionar console.log para debug
console.log("[UTM] Modulo carregado. URL atual:", window.location.href);
console.log("[UTM] Search params:", window.location.search);

// Na captura, verificar se URL tem params
const initialUrlUtms = captureUTMsFromUrl();
console.log("[UTM] Capturados da URL:", initialUrlUtms);
```

---

## Por Que Isso Resolve

| Antes | Depois |
|-------|--------|
| Modulo carregado quando Layout renderiza | Modulo carregado no `main.tsx` antes do React |
| Pode perder UTMs se houver navegacao interna antes | Captura garantida no primeiro momento |

---

## Resumo das Alteracoes

| Arquivo | Alteracao |
|---------|-----------|
| `src/main.tsx` | Importar `@/hooks/useUTM` antes do React renderizar |
| `src/hooks/useUTM.ts` | Adicionar logs de debug para diagnosticar o problema |

---

## Secao Tecnica

### Fluxo Atual

```text
main.tsx carrega
    |
    v
React renderiza App
    |
    v
Layout renderiza (importa useUTM)
    |
    v
useUTM.ts modulo executa captura
```

**Problema**: Se houver redirect/cache entre passos 1-4, UTMs podem ser perdidos.

### Fluxo Corrigido

```text
main.tsx importa useUTM (captura imediata)
    |
    v
UTMs salvos no localStorage
    |
    v
React renderiza App (UTMs ja salvos)
```

---

## Proximo Passo

Apos implementar, acessar `labacrilicos.com.br/?utm_source=teste` e verificar no console do navegador (F12) se os logs `[UTM]` aparecem corretamente.

