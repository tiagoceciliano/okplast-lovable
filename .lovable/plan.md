## Diagnóstico minucioso do problema no Google Ads

O erro do print é **Destination mismatch / Destino não correspondente**. Ele normalmente não é uma reprovação por conteúdo da página; é uma reprovação porque o Google Ads encontrou diferença entre o domínio/URL declarado no anúncio, palavra-chave, extensão, tracking template ou redirecionamento final.

## O que eu testei agora

- Acessei `https://okplast.com.br/` como navegador comum, Googlebot e AdsBot mobile.
- Acessei `http://okplast.com.br/` para verificar redirecionamento para HTTPS.
- Acessei `https://okplast.com.br/chapas/acm` e `https://okplast.com.br/chapas/acrilico` como AdsBot.
- Renderizei a página com Playwright usando user-agent de AdsBot mobile.
- Verifiquei `robots.txt`, `sitemap.xml`, canonical, `og:url`, título, conteúdo renderizado e links internos.
- Procurei no código por sinais antigos de `lovable.app`, `Lab Acrílicos`, canonical errado, redirects e URLs externas.

## O que está OK no site publicado

1. **Domínio raiz responde corretamente**
   - `https://okplast.com.br/` retorna `200 OK`.
   - O conteúdo é HTML normal.
   - Não há bloqueio por robots.

2. **HTTP redireciona para HTTPS corretamente**
   - `http://okplast.com.br/` redireciona para `https://okplast.com.br/`.
   - Isso é esperado e aceito pelo Google Ads.

3. **Domínio Lovable publicado redireciona para o domínio oficial**
   - `https://okplast.lovable.app/` redireciona para `https://okplast.com.br/`.
   - Isso não é problema se o anúncio estiver usando `okplast.com.br` como URL final.
   - Pode virar problema se algum anúncio, extensão, sitelink ou tracking template ainda usar `lovable.app`.

4. **Páginas de produto carregam**
   - `https://okplast.com.br/chapas/acm` retorna `200 OK`.
   - Renderizada com JavaScript, a página mostra título/canonical corretos: `https://okplast.com.br/chapas/acm`.

5. **Robots não bloqueia o Google Ads**
   - `robots.txt` permite `/`.
   - Bloqueia apenas `/admin/`, correto.

6. **Sitemap está no domínio oficial**
   - `https://okplast.com.br/sitemap.xml` existe.
   - As URLs públicas principais usam `https://okplast.com.br`.

7. **Não encontrei Lab Acrílicos no HTML público testado**
   - Testei busca no HTML baixado.
   - Não apareceu sinal de marca antiga no conteúdo principal das URLs testadas.

## O principal problema encontrado

### 1. `www.okplast.com.br` não resolve DNS

Esse é o achado mais importante.

Nos testes, `www.okplast.com.br` retornou erro de DNS:

```text
www.okplast.com.br DNS_ERROR
Failed to resolve 'www.okplast.com.br'
```

Isso significa que, se no Google Ads existir qualquer lugar usando:

```text
https://www.okplast.com.br
http://www.okplast.com.br
www.okplast.com.br/chapas/acm
```

O Google pode reprovar porque o destino não abre ou não bate com o domínio final.

Mesmo que o anúncio principal esteja com `https://okplast.com.br`, basta um destes lugares estar com `www` para causar confusão:

- URL final do anúncio.
- URL final mobile.
- Caminho final da palavra-chave.
- Sitelink/extensão.
- Tracking template da campanha.
- Tracking template do grupo de anúncios.
- Tracking template da conta.
- URL de display configurada como `www.okplast.com.br`.
- Modelo herdado de campanha antiga.

## Outros pontos que podem estar causando o erro

### 2. URL final diferente da URL de visualização/display

Se o anúncio mostra uma URL de display com um domínio e a URL final usa outro, pode gerar Destination mismatch.

Exemplos problemáticos:

```text
Display URL: labacrilicos.com.br
Final URL: https://okplast.com.br/chapas/acm
```

```text
Display URL: okplast.lovable.app
Final URL: https://okplast.com.br/chapas/acm
```

```text
Display URL: www.okplast.com.br
Final URL: https://okplast.com.br/chapas/acm
```

### 3. Tracking template ainda apontando para outro domínio

Esse é muito comum quando a campanha foi reaproveitada.

Pode existir algo como:

```text
{lpurl}?utm_source=google
```

Isso é OK.

Mas se tiver domínio intermediário, pode reprovar:

```text
https://algumrastreador.com/?url={lpurl}
```

Ou domínio antigo:

```text
https://labacrilicos.com.br/?redirect={lpurl}
```

Ou Lovable preview:

```text
https://okplast.lovable.app/?...
```

### 4. URL final mobile diferente da URL final desktop

No Google Ads pode existir uma URL final mobile separada. Se ela estiver vazia normalmente tudo bem, mas se estiver preenchida com domínio diferente, reprova.

Verificar se não está assim:

```text
Final URL: https://okplast.com.br/chapas/acm
Mobile final URL: https://okplast.lovable.app/chapas/acm
```

ou:

```text
Mobile final URL: https://www.okplast.com.br/chapas/acm
```

### 5. Sitelinks/extensões com domínio diferente

Mesmo quando a palavra-chave mostra o erro, o problema pode estar em extensões associadas à campanha:

- Sitelinks.
- Chamada.
- Snippets.
- Formulário de lead.
- Extensões herdadas da conta.

Se algum sitelink ainda aponta para domínio antigo, `www` inexistente ou `lovable.app`, pode gerar reprovação.

### 6. Campanha reaproveitada de outro domínio

Como você mencionou que mudou a URL de um anúncio que já rodava, o Google pode estar herdando configurações antigas da campanha/grupo.

Possíveis sobras:

- URL de display antiga.
- Tracking template antigo.
- Sufixo da URL final antigo.
- Sitelinks antigos.
- Regras automáticas antigas.
- Parametrização customizada em nível de campanha/grupo/anúncio.

### 7. Diferença entre canonical estático e canonical após JavaScript

A página publicada ainda entrega no HTML inicial das rotas internas um canonical da home:

```text
https://okplast.com.br/
```

Depois que o JavaScript carrega, ele corrige para:

```text
https://okplast.com.br/chapas/acm
```

No teste renderizado com AdsBot, ficou correto. Porém, como o Google Ads pode fazer verificações sem renderização completa em alguns momentos, eu recomendo deixar o HTML inicial mais consistente para evitar ambiguidade.

Importante: isso provavelmente não é a principal causa de Destination mismatch, porque o domínio continua sendo o mesmo. Mas é um ajuste que reduz risco.

### 8. Rotas antigas redirecionadas ou inexistentes

No app existe redirect de:

```text
/chapas-de-acrilico -> /chapas
```

Se algum anúncio usa rota antiga, ainda deve funcionar, mas o ideal é usar a URL final real, sem depender de redirect.

Exemplo melhor:

```text
https://okplast.com.br/chapas/acm
```

em vez de qualquer rota antiga/encurtada.

### 9. CDN/cache do Google Ads pode estar analisando versão anterior

O Google Ads pode manter avaliação anterior por algum tempo. Se antes havia Lovable preview, Lab Acrílicos, favicon/og antigo ou URL antiga, a reprovação pode continuar até nova revisão.

Nesse caso, depois de corrigir anúncios/configurações, precisa solicitar nova revisão.

## Onde eu posso atuar no projeto

Posso corrigir no código/site:

1. **Reforçar canonical/og:url do HTML inicial** para reduzir ambiguidade em rotas públicas.
2. **Remover qualquer referência residual a domínio antigo ou Lovable** caso apareça em arquivos públicos.
3. **Criar/ajustar redirects internos de rotas antigas** para rotas oficiais.
4. **Atualizar sitemap** se alguma URL usada em anúncio não estiver listada.
5. **Adicionar páginas específicas para anúncios** se quiser uma landing sem dependência de rota antiga.
6. **Garantir que todas as URLs internas públicas usem `https://okplast.com.br`** quando forem absolutas.
7. **Ajustar metadata por rota** para as páginas usadas nos anúncios.

## Onde eu não consigo atuar diretamente

Não consigo alterar de dentro do código:

1. **DNS do `www.okplast.com.br`**, a menos que você configure o domínio `www` no painel/domínio.
2. **URL final configurada no Google Ads**.
3. **URL final mobile no Google Ads**.
4. **Tracking template da conta/campanha/grupo/anúncio**.
5. **Sitelinks/extensões no Google Ads**.
6. **Display path / URL de visualização do anúncio**.
7. **Cache/revisão interna do Google Ads**.

## Checklist prático para você verificar no Google Ads

Verifique nessa ordem:

1. Na campanha, a URL final deve ser exatamente:

```text
https://okplast.com.br/chapas/acm
```

ou:

```text
https://okplast.com.br/
```

Sem `www`, sem `lovable.app`, sem domínio antigo.

2. Apague ou corrija a **URL final mobile** se existir.

3. Verifique o **tracking template** em 4 níveis:

```text
Conta
Campanha
Grupo de anúncios
Anúncio
```

O ideal é não ter domínio externo. Se usar, deve preservar `{lpurl}` e não trocar o domínio.

4. Verifique o **sufixo da URL final**.

Pode ter UTMs, mas não pode colocar URL inteira nem domínio diferente.

Correto:

```text
utm_source=google&utm_medium=cpc&utm_campaign=acm
```

Errado:

```text
url=https://outrodominio.com
```

5. Verifique todos os **sitelinks/extensões** da campanha e da conta.

Todos precisam apontar para `https://okplast.com.br/...`.

6. Evite `www` por enquanto, porque ele não resolve.

Use sempre:

```text
https://okplast.com.br
```

não:

```text
https://www.okplast.com.br
```

## Plano de correção que recomendo

1. Ajustar no projeto os sinais estáticos para reduzir qualquer ambiguidade de canonical/og em rotas públicas.
2. Fazer nova verificação publicada após o ajuste.
3. Corrigir fora do código o DNS/configuração do `www.okplast.com.br` ou garantir que o Google Ads nunca use `www`.
4. Revisar Google Ads nos níveis campanha/grupo/anúncio/extensão para remover qualquer `lovable.app`, `www.okplast.com.br` ou domínio antigo.
5. Depois disso, solicitar nova revisão no Google Ads.

## Conclusão

Pelo que testei, o site `https://okplast.com.br` está acessível e não parece bloqueado. O maior problema objetivo encontrado é que **`www.okplast.com.br` não existe no DNS**. Se o Google Ads estiver usando `www` em qualquer configuração herdada, isso explica muito bem o erro de **Destino não correspondente**.