
# Instalação do Google Tag Manager

## O que será feito

Adicionar o código do Google Tag Manager (GTM-NBNNC5V) no arquivo `index.html` para rastreamento em todas as páginas do site.

## Alterações

### Arquivo: `index.html`

1. **No `<head>`** - Adicionar o script do GTM o mais alto possível (logo após as meta tags iniciais)

2. **Após `<body>`** - Adicionar o código noscript imediatamente após a abertura da tag body

---

## Código a ser inserido

**No head (após charset e viewport):**
```html
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-NBNNC5V');</script>
<!-- End Google Tag Manager -->
```

**Após abertura do body:**
```html
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NBNNC5V"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
```

---

## Resultado

O GTM será carregado em todas as páginas do site, permitindo rastrear eventos, conversões e integrar com Google Analytics, Google Ads e outras ferramentas de marketing.
