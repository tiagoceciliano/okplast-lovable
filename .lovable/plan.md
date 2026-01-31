# Plano: Migrar Imagens do Acrilzano para Lovable Cloud Storage

## ✅ CONCLUÍDO

### Resumo da Migração

**46 de 49 imagens migradas com sucesso!**

3 imagens não foram encontradas no servidor origem (404):
- `hero/cubo-3d.png` - URL do Builderall estava offline
- `motivos/nfe.jpg` - Arquivo não encontrado
- `sobmedida/caixa-sugestao.jpg` - Arquivo não encontrado

### Arquivos Criados

| Arquivo | Descrição |
|---------|-----------|
| `supabase/functions/migrate-images/index.ts` | Edge function para migrar imagens |
| `src/lib/images.ts` | Constantes com URLs das imagens |

### Arquivos Modificados

| Arquivo | Alteração |
|---------|-----------|
| `src/components/home/HeroSlider.tsx` | Imagens do storage |
| `src/components/home/MotivosCarousel.tsx` | Imagens de fundo |
| `src/pages/Index.tsx` | imageUrl em produtos/chapas/depoimentos/empresa |
| `src/pages/products/ChapasDeAcrilico.tsx` | Imagens das chapas |
| `src/pages/products/AcrilicoSobMedida.tsx` | Imagens das categorias |

### URLs das Imagens no Storage

Base URL: `https://dikfllrqtcdexvnlczsz.supabase.co/storage/v1/object/public/site-images/`

Exemplos:
- `/hero/chapas-empilhadas.jpg`
- `/produtos/caixas-sob-medida.jpg`
- `/chapas/acrilico-cristal.jpg`
- `/depoimentos/avatar-1.png`

### Benefícios Alcançados

| Benefício | Descrição |
|-----------|-----------|
| ✅ Independência | Não depende mais do servidor Acrilzano |
| ✅ Performance | CDN do Supabase com cache global |
| ✅ Confiabilidade | Imagens sempre disponíveis |
| ✅ Manutenção | Fácil substituir imagens no futuro |
| ✅ SEO | URLs limpas e permanentes |
