
# Substituir Select por RadioGroup nos Modais WhatsApp

## Problema Identificado

O componente `Select` do Radix UI dentro do `Dialog` causa conflito: ao selecionar um item, o foco é perdido e o modal fecha inesperadamente.

## Solucao Proposta

Substituir o `Select` (dropdown) por `RadioGroup` com opcoes visiveis inline, mantendo o layout compacto.

---

## Arquivos a Modificar

1. `src/components/layout/WhatsAppModal.tsx`
2. `src/components/layout/WhatsAppChatWidget.tsx`

---

## Mudancas no Codigo

### Para ambos os arquivos:

1. **Remover imports do Select**:
```typescript
// REMOVER
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
```

2. **Adicionar imports do RadioGroup**:
```typescript
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
```

3. **Substituir o FormField do produto**:
   - Trocar de `Select` para `RadioGroup` horizontal
   - Duas opcoes lado a lado: "Chapa Inteira ou Cortada" e "Produto Personalizado"
   - Estilo compacto com botoes em formato de chip/pill

---

## Layout do RadioGroup

```text
+-----------------------------------+
| O Chapa Inteira    O Personalizado|
+-----------------------------------+
```

- Layout horizontal (`flex flex-row`)
- Labels curtos para economizar espaco
- Altura similar aos inputs (`h-8`)
- Estilo visual que combina com o tema WhatsApp

---

## Beneficios

1. **Corrige o bug**: RadioGroup nao fecha o modal
2. **Melhor UX**: Usuario ve as opcoes imediatamente
3. **Menos cliques**: Selecao direta sem dropdown
4. **Layout compacto**: Mantem o botao visivel sem scroll

---

## Codigo Final do RadioGroup

```tsx
<FormField
  control={form.control}
  name="produto"
  render={({ field }) => (
    <FormItem>
      <FormControl>
        <RadioGroup
          onValueChange={field.onChange}
          value={field.value}
          className="flex flex-row gap-3"
        >
          {PRODUTOS_WHATSAPP.map((produto) => (
            <div key={produto} className="flex items-center space-x-1.5">
              <RadioGroupItem 
                value={produto} 
                id={produto}
                className="h-3.5 w-3.5 border-gray-400"
              />
              <Label 
                htmlFor={produto}
                className="text-xs text-gray-700 cursor-pointer leading-tight"
              >
                {produto === "Chapa Inteira ou Cortada" ? "Chapa" : "Personalizado"}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </FormControl>
      <FormMessage className="text-xs text-red-600" />
    </FormItem>
  )}
/>
```

---

## Atualizacao das Constantes

Tambem podemos simplificar os labels em `PRODUTOS_WHATSAPP` se preferir, mas o valor enviado no formulario continuara completo.
