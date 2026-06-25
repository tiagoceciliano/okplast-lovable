## Plano para resolver o problema crônico de cache/publicação

### Objetivo
Garantir que, após publicar uma nova versão, o navegador carregue os arquivos atuais do site publicado e não continue preso em HTML/JS/CSS antigos.

### O que vou ajustar neste projeto
1. **Versionamento explícito da aplicação**
   - Criar uma versão de build usada pelo frontend para identificar quando a publicação mudou.
   - Essa versão será comparada no navegador para detectar app antigo em execução.

2. **Correção do carregamento de chunks antigos**
   - Melhorar o tratamento atual de erro de importação dinâmica.
   - Quando o navegador tentar carregar um arquivo JS antigo que não existe mais, a página fará reload forçado com cache-buster.

3. **Cache-buster automático no reload**
   - Em vez de apenas `window.location.reload()`, redirecionar para a mesma URL com um parâmetro tipo `?v=<timestamp>`.
   - Isso força o navegador/CDN a buscar o HTML novo.

4. **Limpeza controlada de storage do app**
   - Remover apenas flags internas de reload para não travar em estado antigo.
   - Não apagar dados importantes de usuário/UTM sem necessidade.

5. **Headers/meta defensivos para HTML**
   - Adicionar metatags de no-cache no `index.html` para reduzir chance de HTML velho ficar preso em cache.
   - Manter assets com hash funcionando normalmente, pois eles podem continuar cacheados com segurança.

6. **Documentar o procedimento padrão para outros projetos**
   - Ao final, te passo o padrão exato para replicar: onde alterar e qual lógica usar.

### Resultado esperado
- Publicou nova versão → usuários recebem HTML novo com os assets corretos.
- Se alguém estiver com página antiga aberta → ao navegar ou disparar erro de chunk antigo, o site força atualização limpa.
- Reduz bastante o erro de “publicou mas a versão publicada não muda”.

### Observação importante
Essa correção atua no lado do app/navegador. Se houver atraso real na infraestrutura de publicação/CDN da plataforma, ainda pode existir uma janela curta de propagação, mas o usuário não deve ficar preso indefinidamente em build antiga.