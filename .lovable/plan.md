
# Plano: Reorganizar Grid de Produtos Sob Medida

## Resumo
Reorganizar a seção "Produtos Sob Medida" na página inicial, removendo 4 itens e reordenando os 12 restantes em 3 linhas de 4 produtos cada.

---

## O que será alterado

### Arquivo: `src/pages/Index.tsx`

Substituir o array `produtosSobMedida` atual (16 itens) por um novo array com 12 itens na ordem especificada:

**Linha 1:**
1. Cúpulas e Redomas → `cupulasRedomas`
2. Troféus → `trofeus`
3. Medalhas e Premiações → `medalhasPremiacoes`
4. Expositores Sob medida → `potesDoces`

**Linha 2:**
5. Display A4 Parede → `displayA4Parede`
6. Display A6 Mesa → `displayA6Mesa`
7. Urna Piramidal → `urnaPiramidal`
8. Púlpitos → `caixasSobMedida`

**Linha 3:**
9. Caixa para Doces → `caixaDoces`
10. Pote a Granel → `poteAGranel`
11. Defletores → `portaFolder`
12. Placas Personalizadas → `placasPersonalizadas`

---

## Itens removidos
- Display A6 Mesa (duplicado antigo)
- Display A4 (duplicado antigo)
- Expositores de Bijuterias
- Bolo Fake

---

## Resultado visual esperado
Grid 4x3 (4 colunas no desktop, 2 no mobile) com os 12 produtos organizados exatamente na ordem solicitada.
