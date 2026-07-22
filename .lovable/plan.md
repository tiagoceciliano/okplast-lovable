Objetivo: criar uma página de destino única chamada "Policarbonato" que reúna as informações das duas linhas (Alveolar e Compacto), já que as campanhas do Google Ads anunciam o termo geral e não as variedades separadas.

Escopo:
1. Criar nova página `src/pages/chapas/Policarbonato.tsx`
   - Título/SEO focado em "Chapa de Policarbonato no Rio de Janeiro | OK Plast"
   - Hero com CTA de orçamento via WhatsApp (abre modal genérico "Chapa de Policarbonato")
   - Seção comparativa destacando Policarbonato Alveolar (coberturas, leveza, isolamento térmico) e Policarbonato Compacto (resistência ao impacto, segurança)
   - Cada linha terá link para sua página específica (`/chapas/policarbonato-alveolar` e `/chapas/policarbonato-compacto`)
   - Listar espessuras disponíveis de ambos
   - CTA final com WhatsApp
   - Reutilizar imagens já existentes: `policarbonato-alveolar.webp` e `policarbonato-compacto.webp`
   - Schema de breadcrumb e product

2. Roteamento
   - Adicionar rota `/chapas/policarbonato` em `src/App.tsx` dentro do `MainSite`
   - Não remover as rotas individuais existentes

3. Navegação
   - Adicionar item "Policarbonato" no dropdown "Chapas" de `src/lib/constants.ts`, apontando para `/chapas/policarbonato`
   - Manter os itens atuais de Alveolar e Compacto

4. SEO técnico
   - Adicionar URL em `public/sitemap.xml` com prioridade 0.9
   - Atualizar `public/llms.txt` para listar a nova página

5. Verificação
   - Acessar `/chapas/policarbonato` no preview e confirmar renderização, links e CTA
   - Validar build sem erros

Entregável: página pronta para ser usada como URL de destino no Google Ads para campanhas de "policarbonato".