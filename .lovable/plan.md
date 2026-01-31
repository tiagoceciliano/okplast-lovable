
# Plano: Chat Widget WhatsApp no Canto Inferior Direito

## Objetivo
Transformar o modal centralizado atual em um widget de chat que aparece no canto inferior direito, logo acima do botão do WhatsApp, simulando uma janela de chat real (como widgets de atendimento de sites comerciais).

## Visual Proposto

```text
┌─────────────────────────────────────────────────────┐
│                                                     │
│              (conteúdo da página)                   │
│                                                     │
│                                                     │
│                   ┌──────────────────────────┐      │
│                   │ 🟢 Lab Acrílicos  Online │ ←    │
│                   ├──────────────────────────┤      │
│                   │ Olá! 👋 Precisa de       │      │
│                   │ ajuda com seu orçamento? │      │
│                   │ ────────────────────────  │      │
│                   │ [Nome              ]     │      │
│                   │ [Email             ]     │      │
│                   │ [Telefone          ]     │      │
│                   │ [Produto        ▼  ]     │      │
│                   │ [Mensagem...       ]     │      │
│                   │                          │      │
│                   │ [   Iniciar Conversa  ]  │      │
│                   └──────────────────────────┘      │
│                                           ┌──┐      │
│                                           │WA│      │
│                                           └──┘      │
└─────────────────────────────────────────────────────┘
```

O chat aparece como uma janela flutuante conectada ao botão, com animação de entrada vindo de baixo.

---

## Alterações Necessárias

### 1. Refatorar WhatsAppModal.tsx

**Mudanças principais:**
- Remover o componente Dialog do Radix (modal centralizado)
- Criar um componente customizado posicionado no canto inferior direito
- Usar `fixed bottom-24 right-6` para posicionar acima do botão
- Manter toda a estrutura visual atual (header verde, balões de chat, formulário)
- Adicionar animação de entrada (slide-up + fade-in)

### 2. Atualizar WhatsAppFloatingButton.tsx

**Adicionar funcionalidade:**
- Timer de 5 segundos para mostrar mensagem proativa
- Quando a mensagem aparece, ao clicar abre o chat
- O botão do WhatsApp também abre o chat
- Estado para controlar se mostra mensagem ou o chat completo

### 3. Adicionar estilos CSS no index.css

**Novos estilos:**
- `.whatsapp-chat-widget` - Container do widget fixo no canto
- Animação de entrada do chat (slide-up)
- Ajustes de responsividade para mobile

### 4. Adicionar animações no tailwind.config.ts

**Novas animações:**
- `slide-up` - Para entrada do widget
- `slide-down` - Para saída do widget

---

## Detalhes Técnicos

### WhatsAppModal.tsx (refatorado)

A estrutura deixa de usar Dialog do Radix e passa a ser um div posicionado:

```tsx
// Estrutura principal
{open && (
  <div className="fixed bottom-24 right-6 z-50 w-[360px] max-h-[70vh] 
                  flex flex-col bg-white rounded-2xl shadow-2xl 
                  animate-slide-up overflow-hidden">
    {/* Header - igual ao atual */}
    <div className="whatsapp-header ...">...</div>
    
    {/* Form com chat area */}
    <Form>
      <ScrollArea>...</ScrollArea>
      <div className="send-button-area">...</div>
    </Form>
  </div>
)}
```

### WhatsAppFloatingButton.tsx (atualizado)

```tsx
const [showProactiveMessage, setShowProactiveMessage] = useState(false);

useEffect(() => {
  const timer = setTimeout(() => {
    setShowProactiveMessage(true);
  }, 5000);
  return () => clearTimeout(timer);
}, []);

return (
  <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
    {/* Mensagem proativa */}
    {showProactiveMessage && !isModalOpen && (
      <div 
        onClick={() => openWhatsAppModal()}
        className="whatsapp-proactive-message cursor-pointer"
      >
        <button onClick={(e) => { e.stopPropagation(); setShowProactiveMessage(false); }}>
          <X />
        </button>
        <p>Precisa de ajuda com seu orçamento? 💬</p>
      </div>
    )}
    
    {/* Botão WhatsApp */}
    <button onClick={() => openWhatsAppModal()}>
      <MessageCircle />
    </button>
  </div>
);
```

### index.css - Novos estilos

```css
.whatsapp-chat-widget {
  @apply fixed bottom-24 right-6 z-50;
  width: 360px;
  max-height: 70vh;
}

.whatsapp-proactive-message {
  @apply bg-white rounded-xl p-4 shadow-xl max-w-[240px] relative;
  animation: slide-up 0.3s ease-out;
}

.whatsapp-proactive-message::after {
  content: '';
  position: absolute;
  bottom: -8px;
  right: 24px;
  border: 8px solid transparent;
  border-top-color: white;
}

/* Responsivo para mobile */
@media (max-width: 640px) {
  .whatsapp-chat-widget {
    left: 16px;
    right: 16px;
    bottom: 80px;
    width: auto;
    max-height: 80vh;
  }
}
```

### tailwind.config.ts - Novas animações

```ts
keyframes: {
  "slide-up": {
    "0%": { opacity: "0", transform: "translateY(20px) scale(0.95)" },
    "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
  },
  "slide-down": {
    "0%": { opacity: "1", transform: "translateY(0) scale(1)" },
    "100%": { opacity: "0", transform: "translateY(20px) scale(0.95)" },
  },
}

animation: {
  "slide-up": "slide-up 0.3s ease-out",
  "slide-down": "slide-down 0.2s ease-in",
}
```

---

## Fluxo de Interação

1. Usuário entra na página
2. Após 5 segundos, aparece balão proativo: "Precisa de ajuda com seu orçamento? 💬"
3. Usuário pode:
   - Clicar no balão → Abre chat widget
   - Clicar no X do balão → Fecha apenas o balão
   - Clicar no botão WhatsApp → Abre chat widget
4. Chat widget aparece acima do botão com animação suave
5. Usuário preenche dados e clica "Iniciar Conversa"
6. Redireciona para WhatsApp com dados preenchidos

---

## Arquivos a Modificar

| Arquivo | Ação |
|---------|------|
| `src/components/layout/WhatsAppModal.tsx` | Refatorar para widget fixo no canto |
| `src/components/layout/WhatsAppFloatingButton.tsx` | Adicionar mensagem proativa |
| `src/contexts/WhatsAppModalContext.tsx` | Expor estado `isOpen` para o botão |
| `src/index.css` | Adicionar estilos do widget e mensagem |
| `tailwind.config.ts` | Adicionar animações slide-up/down |
