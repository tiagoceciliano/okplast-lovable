

# Plano: Migrar Imagens do Acrilzano para Lovable Cloud Storage

## Visao Geral

Vou baixar todas as ~52 imagens do site Acrilzano e hospeda-las diretamente no storage do Lovable Cloud, eliminando a dependencia do servidor externo e garantindo performance otima.

---

## 1. CRIAR BUCKET DE STORAGE

### 1.1 Migracao SQL

Criar bucket publico para as imagens do site:

```sql
-- Criar bucket publico para imagens do site
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-images', 'site-images', true);

-- Permitir leitura publica
CREATE POLICY "Imagens publicas para leitura"
ON storage.objects FOR SELECT
USING (bucket_id = 'site-images');

-- Permitir upload via service role (edge function)
CREATE POLICY "Upload via service role"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'site-images');
```

---

## 2. CRIAR EDGE FUNCTION PARA DOWNLOAD DE IMAGENS

### 2.1 Nova Edge Function: `migrate-images`

Esta funcao vai:
1. Receber uma lista de URLs de imagens do Acrilzano
2. Baixar cada imagem
3. Fazer upload para o bucket `site-images`
4. Retornar as novas URLs publicas

### 2.2 Estrutura do arquivo

Arquivo: `supabase/functions/migrate-images/index.ts`

```typescript
// Recebe: { images: [{ key: "hero-1", url: "https://..." }] }
// Retorna: { results: [{ key: "hero-1", newUrl: "https://...supabase.co/..." }] }
```

### 2.3 Organizacao das imagens no bucket

```
site-images/
├── hero/
│   ├── cubo-3d.png
│   ├── chapas-empilhadas.jpg
│   └── chapas-coloridas.jpg
├── empresa/
│   └── equipe.jpg
├── produtos/
│   ├── caixas-sob-medida.jpg
│   ├── cupulas-redomas.jpg
│   ├── potes-doces.jpg
│   └── ...
├── chapas/
│   ├── acrilico-cristal.jpg
│   ├── acrilico-colorido.jpg
│   └── ...
├── motivos/
│   ├── nfe.jpg
│   ├── credito.jpg
│   └── ...
└── depoimentos/
    ├── avatar-1.png
    ├── avatar-2.png
    └── ...
```

---

## 3. LISTA COMPLETA DE IMAGENS A MIGRAR

### 3.1 Hero Slider (3 imagens)

| Key | URL Origem |
|-----|------------|
| hero/cubo-3d.png | https://storage.builderall.com/franquias/2/6891583/editor-html/9121285.png |
| hero/chapas-empilhadas.jpg | https://acrilzano.com.br/wp-content/uploads/2022/08/chapa-1-min.jpg |
| hero/chapas-coloridas.jpg | https://acrilzano.com.br/wp-content/uploads/2022/08/chapa-min.jpg |

### 3.2 Empresa (1 imagem)

| Key | URL Origem |
|-----|------------|
| empresa/equipe.jpg | https://acrilzano.com.br/wp-content/uploads/2022/08/Equipe-Acrilzano-acrilico-1-min.jpg |

### 3.3 Produtos Sob Medida (8 imagens)

| Key | URL Origem |
|-----|------------|
| produtos/caixas-sob-medida.jpg | https://acrilzano.com.br/wp-content/uploads/2022/08/caixa-acrilico-doces-3-300x225-300x225-min.jpg |
| produtos/cupulas-redomas.jpg | https://acrilzano.com.br/wp-content/uploads/2022/08/expositor-de-acrilico-cone-300x300-min.jpg |
| produtos/potes-doces.jpg | https://acrilzano.com.br/wp-content/uploads/2022/08/suporte-para-bolo-de-andar-300x300-min.jpg |
| produtos/potes-graos.jpg | https://acrilzano.com.br/wp-content/uploads/2022/08/caixa-acrilico-granel-300x225-300x225-min.jpg |
| produtos/urna.jpg | https://acrilzano.com.br/wp-content/uploads/2022/08/urna-de-acrilico-300x300-min.jpg |
| produtos/display.jpg | https://acrilzano.com.br/wp-content/uploads/2022/08/expositor-de-acrilico-doces-300x300-min.jpg |
| produtos/trofeus.jpg | https://acrilzano.com.br/wp-content/uploads/2022/08/trofeu-acrilico-acrilzano-300x298-min.jpg |
| produtos/medalhas.jpg | https://acrilzano.com.br/wp-content/uploads/2022/08/medalhas-acrilicas-300x300-min.jpg |

### 3.4 Tipos de Chapas (8 imagens)

| Key | URL Origem |
|-----|------------|
| chapas/acrilico-cristal.jpg | https://acrilzano.com.br/wp-content/uploads/2022/08/CHAPA-PRINCIPAL-300x300-min.jpg |
| chapas/acrilico-colorido.jpg | https://acrilzano.com.br/wp-content/uploads/2022/08/chapa-acrilico-colorido-300x223-300x223-1.jpg |
| chapas/acrilico-leitoso.jpg | https://acrilzano.com.br/wp-content/uploads/2022/08/chapa-2-min.jpg |
| chapas/acrilico-espelhado.jpg | https://acrilzano.com.br/wp-content/uploads/2022/08/chapa-acrilico-espelhada-300x225-min.jpg |
| chapas/policarbonato.jpg | https://acrilzano.com.br/wp-content/uploads/2022/08/chapa-3-min.jpg |
| chapas/petg.jpg | https://acrilzano.com.br/wp-content/uploads/2022/08/4444444444444444444444444-min.jpg |
| chapas/pvc-expandido.jpg | https://acrilzano.com.br/wp-content/uploads/2022/08/111111111111111111111111-min.jpg |
| chapas/pedacos-retalhos.jpg | https://acrilzano.com.br/wp-content/uploads/2022/08/22222222222222222222222222-min.jpg |

### 3.5 Motivos Carousel (6 imagens)

| Key | URL Origem |
|-----|------------|
| motivos/nfe.jpg | https://acrilzano.com.br/wp-content/uploads/2022/08/1.2-min.jpg |
| motivos/credito.jpg | https://acrilzano.com.br/wp-content/uploads/2022/08/2.2-min.jpg |
| motivos/empresa-solida.jpg | https://acrilzano.com.br/wp-content/uploads/2022/08/3.2-min.jpg |
| motivos/pronta-entrega.jpg | https://acrilzano.com.br/wp-content/uploads/2022/08/4.2-min.jpg |
| motivos/entrega-brasil.jpg | https://acrilzano.com.br/wp-content/uploads/2022/08/5.2-min.jpg |
| motivos/atendimento.jpg | https://acrilzano.com.br/wp-content/uploads/2022/08/6.2-min.jpg |

### 3.6 Depoimentos (4 imagens)

| Key | URL Origem |
|-----|------------|
| depoimentos/avatar-1.png | https://acrilzano.com.br/wp-content/uploads/2022/06/1-min.png |
| depoimentos/avatar-2.png | https://acrilzano.com.br/wp-content/uploads/2022/06/2-min.png |
| depoimentos/avatar-3.png | https://acrilzano.com.br/wp-content/uploads/2022/06/3-min.png |
| depoimentos/avatar-4.png | https://acrilzano.com.br/wp-content/uploads/2022/06/4-min.png |

### 3.7 Pagina Chapas - Detalhes (7 imagens)

| Key | URL Origem |
|-----|------------|
| chapas-pagina/cast.jpg | https://acrilzano.com.br/wp-content/uploads/2022/08/chapa-1-min.jpg |
| chapas-pagina/poliestireno.jpg | https://acrilzano.com.br/wp-content/uploads/2022/08/chapa-2-min.jpg |
| chapas-pagina/petg.jpg | https://acrilzano.com.br/wp-content/uploads/2022/08/chapa-3-min.jpg |
| chapas-pagina/policarbonato-alveolar.jpg | https://acrilzano.com.br/wp-content/uploads/2022/08/chapa-min.jpg |
| chapas-pagina/policarbonato-compacto.jpg | https://acrilzano.com.br/wp-content/uploads/2022/08/111111111111111111111111-min.jpg |
| chapas-pagina/pvc.jpg | https://acrilzano.com.br/wp-content/uploads/2022/08/22222222222222222222222222-min.jpg |
| chapas-pagina/acm.jpg | https://acrilzano.com.br/wp-content/uploads/2022/08/3333333333333333333333333-min.jpg |

### 3.8 Pagina Sob Medida - Categorias (15 imagens)

| Key | URL Origem |
|-----|------------|
| sobmedida/caixas.jpg | https://acrilzano.com.br/wp-content/uploads/2022/08/Caixas-acrilico-300x251-300x251-min.jpg |
| sobmedida/cupulas.jpg | https://acrilzano.com.br/wp-content/uploads/2022/08/cupula-acrilico-400x300-300x225-min.jpg |
| sobmedida/potes-doces.jpg | https://acrilzano.com.br/wp-content/uploads/2022/08/caixa-acrilico-doces-2-300x200-300x200-min.jpg |
| sobmedida/potes-graos.jpg | https://acrilzano.com.br/wp-content/uploads/2022/08/pote-acrilico-granel-225x300-225x300-min.jpg |
| sobmedida/medalhas.jpg | https://acrilzano.com.br/wp-content/uploads/2022/08/medalhas-acrilica-300x300-min.jpg |
| sobmedida/trofeus.jpg | https://acrilzano.com.br/wp-content/uploads/2022/08/trofeu-acrilico-fenda-300x300-min.jpg |
| sobmedida/display.jpg | https://acrilzano.com.br/wp-content/uploads/2022/08/expositor-de-acrilicos-300x180-300x180-min.jpg |
| sobmedida/urna.jpg | https://acrilzano.com.br/wp-content/uploads/2022/08/sugestoes-400x267-300x225-min.jpg |
| sobmedida/caixa-sugestao.jpg | https://acrilzano.com.br/wp-content/uploads/2022/08/caixa-sugestao-300x300-min.jpg |
| sobmedida/expositores-bijuterias.jpg | https://acrilzano.com.br/wp-content/uploads/2022/08/expositor-acrilico-brinco-1-300x297-min.jpg |
| sobmedida/expositores-calcados.jpg | https://acrilzano.com.br/wp-content/uploads/2022/08/expositor-de-acrilico-doces-300x300-min.jpg |
| sobmedida/porta-folder.jpg | https://acrilzano.com.br/wp-content/uploads/2022/08/porta-folder-acrilicdo-parede-400x240-300x225-min.jpg |

**Total: ~52 imagens**

---

## 4. ORDEM DE IMPLEMENTACAO

### Passo 1: Criar Bucket (Migracao SQL)
- Executar SQL para criar bucket `site-images`
- Configurar politicas de acesso publico

### Passo 2: Criar Edge Function `migrate-images`
- Funcao que baixa imagens de URLs externas
- Faz upload para o bucket
- Retorna URLs publicas do Lovable Cloud

### Passo 3: Executar Migracao
- Chamar a edge function com a lista completa de imagens
- Aguardar conclusao do download/upload

### Passo 4: Criar Arquivo de Constantes de Imagens
- `src/lib/images.ts` com todas as URLs mapeadas
- Facilita manutencao futura

### Passo 5: Atualizar Componentes
Substituir placeholders pelas novas URLs:

| Arquivo | Alteracao |
|---------|-----------|
| `src/components/home/HeroSlider.tsx` | 3 URLs do hero |
| `src/components/home/MotivosCarousel.tsx` | 6 URLs de fundo |
| `src/pages/Index.tsx` | 8 produtos + 8 chapas + 4 avatares + 1 equipe |
| `src/pages/products/ChapasDeAcrilico.tsx` | 7 URLs das chapas |
| `src/pages/products/AcrilicoSobMedida.tsx` | 15 URLs dos produtos |

---

## 5. ARQUIVOS A CRIAR/MODIFICAR

### Novos arquivos:
| Arquivo | Descricao |
|---------|-----------|
| `supabase/functions/migrate-images/index.ts` | Edge function para migrar imagens |
| `src/lib/images.ts` | Constantes com URLs das imagens |

### Arquivos a modificar:
| Arquivo | Alteracao |
|---------|-----------|
| `src/components/home/HeroSlider.tsx` | URLs do storage |
| `src/components/home/MotivosCarousel.tsx` | URLs de fundo |
| `src/pages/Index.tsx` | imageUrl em produtos/chapas/depoimentos |
| `src/pages/products/ChapasDeAcrilico.tsx` | URLs das chapas |
| `src/pages/products/AcrilicoSobMedida.tsx` | URLs das categorias |

---

## 6. URL FINAL DAS IMAGENS

Apos migracao, as URLs serao:

```
https://dikfllrqtcdexvnlczsz.supabase.co/storage/v1/object/public/site-images/hero/cubo-3d.png
https://dikfllrqtcdexvnlczsz.supabase.co/storage/v1/object/public/site-images/produtos/caixas-sob-medida.jpg
...
```

---

## 7. BENEFICIOS DESTA ABORDAGEM

| Beneficio | Descricao |
|-----------|-----------|
| Independencia | Nao depende mais do servidor Acrilzano |
| Performance | CDN do Supabase com cache global |
| Confiabilidade | Imagens sempre disponiveis |
| Manutencao | Facil substituir imagens no futuro |
| SEO | URLs limpas e permanentes |

