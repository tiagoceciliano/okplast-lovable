

# Plano: Cards de Chapas com Fotos + Logos de Clientes + Nova Logo

## Resumo das Alteracoes

| Alteracao | Descricao |
|-----------|-----------|
| Cards de Chapas | Adicionar fotos de fundo em cada card da secao "Chapas e Pedacos de Placas" |
| Logos de Clientes | Salvar imagem com logos dos clientes e usar no componente ClientLogos |
| Logo do Site | Trocar a logo atual para a versao horizontal PNG maior |

---

## 1. SECAO CHAPAS COM FOTOS

### Problema Atual
Os cards de chapas na home sao apenas blocos azuis com texto, sem imagens.

### Solucao
Transformar cada card em um bloco com imagem de fundo e texto sobreposto, identico ao layout do Acrilzano mostrado na referencia.

### Mapeamento de Imagens (Conforme Print Enviado)

| Card | Produto | Imagem Necessaria |
|------|---------|-------------------|
| 1 | Acrilico Transparente | Chapas transparentes empilhadas (fundo preto) |
| 2 | Acrilico Colorido | Amostras coloridas variadas |
| 3 | Pet G | Cantos de chapas cinzas |
| 4 | Ps Poliestireno | Chapas coloridas arredondadas |
| 5 | Policarbonato Alveolar | Chapas alveolares marrom/verde/azul |
| 6 | Policarbonato Compact | Chapas em leque azul/branco |
| 7 | PVC Expandido | Chapas em tons de azul |
| 8 | ACM | Chapas coloridas quadriculadas |

### Arquivos a Modificar

| Arquivo | Alteracao |
|---------|-----------|
| `src/pages/Index.tsx` | Alterar renderizacao dos cards de chapas para exibir imagem de fundo |
| `src/lib/images.ts` | Adicionar constantes para as novas imagens de chapas (se necessario migrar) |

### Novo Layout dos Cards

```text
+------------------+
|    [IMAGEM]      |
|   de fundo com   |
|   overlay escuro |
|                  |
| "Acrilico Cristal"
+------------------+
```

---

## 2. LOGOS DE CLIENTES

### Problema Atual
O componente `ClientLogos` mostra apenas placeholders cinzas com "Logo".

### Solucao
Salvar a imagem com todos os logos de clientes enviada e exibi-la como uma unica imagem responsiva.

### Clientes Identificados na Imagem
- Rede D'Or
- BRT
- Marinha do Brasil
- Werner Coiffeur
- The British School
- Essilor
- Michelin
- Museu do Amanha
- Museu Nacional
- ALERJ
- Banco do Brasil
- Colegio Santo Inacio
- Fetranspor
- UFRJ
- PGE-RJ
- Prefeitura do Rio
- Record TV
- BNDES
- Sicoob
- Jockey Club Brasileiro
- AgeRio
- HS Sports Travel

### Arquivos a Modificar

| Arquivo | Alteracao |
|---------|-----------|
| `src/assets/logos/clientes.png` | Copiar imagem enviada pelo usuario |
| `src/components/ui/ClientLogos.tsx` | Exibir imagem unica em vez de grid de placeholders |

---

## 3. NOVA LOGO DO SITE

### Problema Atual
A logo atual (`logo-lab-acrilicos.png`) e pequena e pode nao ter qualidade ideal.

### Solucao
Usar a logo horizontal que esta em `src/assets/logos/logo-horizontal.png` (ja salva anteriormente).

### Arquivos a Modificar

| Arquivo | Alteracao |
|---------|-----------|
| `src/components/layout/Header.tsx` | Trocar import para `logo-horizontal.png` |
| `src/components/layout/Footer.tsx` | Trocar import para `logo-horizontal.png` |

---

## Ordem de Implementacao

1. Copiar imagem de logos de clientes para `src/assets/logos/clientes.png`
2. Atualizar `ClientLogos.tsx` para exibir imagem unica
3. Atualizar Header.tsx e Footer.tsx com nova logo
4. Migrar imagens de chapas (se necessario) via Edge Function
5. Atualizar cards de chapas no Index.tsx para exibir fotos

---

## Secao Tecnica

### Novo Codigo para Cards de Chapas

```typescript
// Index.tsx - Secao Chapas
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
  {tiposChapas.map((chapa, index) => (
    <Link
      key={index}
      to={chapa.href}
      className="group relative aspect-[4/3] rounded-lg overflow-hidden"
    >
      <img 
        src={chapa.imageUrl} 
        alt={chapa.nome}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-semibold text-white text-center px-2">
          {chapa.nome}
        </span>
      </div>
    </Link>
  ))}
</div>
```

### Novo ClientLogos

```typescript
import clientesImg from "@/assets/logos/clientes.png";

export function ClientLogos({ className }: ClientLogosProps) {
  return (
    <div className={cn("w-full", className)}>
      <img 
        src={clientesImg} 
        alt="Nossos Clientes" 
        className="w-full h-auto"
      />
    </div>
  );
}
```

### Nova Logo no Header/Footer

```typescript
import logoImg from "@/assets/logos/logo-horizontal.png";
```

