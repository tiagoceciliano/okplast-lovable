
# Plano: Padronizar CTA Final de Todas as Páginas de Chapas

## Problema

O bloco CTA Final nas páginas específicas de materiais está com estilo diferente do padrão da página hub `/chapas`:

| Elemento | Atual (Páginas Específicas) | Desejado (Hub /chapas) |
|----------|----------------------------|------------------------|
| Background | Azul escuro (`bg-primary`) | Cinza claro (`bg-muted`) |
| Título | Branco | Preto (`text-foreground`) |
| Botões | 2 lado a lado | 1 botão + link texto abaixo |
| E-mail | Botão outline | Link "Prefere orçamento via e-mail?" |

## Alterações Necessárias

### Arquivos a Modificar (7 páginas)

| Arquivo | Status |
|---------|--------|
| `src/pages/chapas/Acrilico.tsx` | Atualizar CTA |
| `src/pages/chapas/Poliestireno.tsx` | Atualizar CTA |
| `src/pages/chapas/Petg.tsx` | Atualizar CTA |
| `src/pages/chapas/PolicarbonatoAlveolar.tsx` | Atualizar CTA |
| `src/pages/chapas/PolicarbonatoCompacto.tsx` | Atualizar CTA |
| `src/pages/chapas/PvcExpandido.tsx` | Atualizar CTA |
| `src/pages/chapas/Acm.tsx` | Atualizar CTA |

## Código Padrão para CTA Final

De:
```tsx
{/* CTA Final */}
<section className="section-padding bg-primary text-primary-foreground">
  <div className="container-custom text-center">
    <h2 className="font-bold text-2xl md:text-3xl mb-4">
      Solicite seu Orçamento de Chapas PETG
    </h2>
    <p className="mb-8 max-w-xl mx-auto opacity-90">
      Informe a espessura e dimensões desejadas...
    </p>
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
      <Button variant="secondary">WhatsApp</Button>
      <Button variant="outline">E-mail</Button>
    </div>
  </div>
</section>
```

Para:
```tsx
{/* CTA Final */}
<section className="section-padding bg-muted">
  <div className="container-custom text-center">
    <h2 className="font-bold text-2xl md:text-3xl text-foreground mb-4">
      Solicite seu Orçamento
    </h2>
    <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
      Informe o tipo de chapa, espessura e dimensões desejadas para receber um orçamento personalizado.
    </p>
    <div className="flex flex-col items-center gap-4">
      <Button 
        size="lg" 
        className="btn-whatsapp text-lg px-8 py-6"
        onClick={() => openWhatsAppModal("[Nome do Material]")}
      >
        <MessageCircle className="h-5 w-5 mr-2" />
        Orçamento via WhatsApp
      </Button>
      <button 
        onClick={() => openEmailModal("[Nome do Material]")}
        className="text-muted-foreground hover:text-foreground text-sm underline underline-offset-4"
      >
        Prefere orçamento via e-mail?
      </button>
    </div>
  </div>
</section>
```

## Detalhes das Mudanças

| Elemento | Antes | Depois |
|----------|-------|--------|
| `section` | `bg-primary text-primary-foreground` | `bg-muted` |
| `h2` | Sem classe de cor (herdava branco) | `text-foreground` |
| `p` | `opacity-90` | `text-muted-foreground` |
| Layout botões | `flex-col sm:flex-row` (2 botões) | `flex-col` (1 botão + 1 link) |
| Botão WhatsApp | `variant="secondary"` | `className="btn-whatsapp"` |
| E-mail | `Button variant="outline"` | `button` com estilo de link |

## Também Remover

- Import `Mail` de `lucide-react` pode ser removido se não for usado em outro lugar da página

## Resultado Visual Esperado

```text
┌────────────────────────────────────────────────────┐
│          (fundo cinza claro)                       │
│                                                    │
│         Solicite seu Orçamento                     │
│                                                    │
│   Informe o tipo de chapa, espessura e dimensões   │
│   desejadas para receber um orçamento...           │
│                                                    │
│        ┌─────────────────────────────┐             │
│        │  🟢 Orçamento via WhatsApp  │             │
│        └─────────────────────────────┘             │
│                                                    │
│        Prefere orçamento via e-mail?               │
│                                                    │
└────────────────────────────────────────────────────┘
```
