

# Plano: Adicionar Som de Notificação na Mensagem Proativa

## Objetivo
Tocar um som de notificação quando a mensagem proativa do WhatsApp aparecer (após 5 segundos), para chamar a atenção do visitante da página.

## Alterações Necessárias

### 1. Adicionar arquivo de áudio na pasta public

Adicionar um arquivo de som de notificação curto e agradável:
- `public/sounds/notification.mp3` - Som estilo "pop" ou notificação de mensagem

O som deve ser:
- Curto (menos de 1 segundo)
- Agradável e não intrusivo
- Similar a notificações de chat/mensagem

### 2. Atualizar WhatsAppFloatingButton.tsx

Modificar o `useEffect` que mostra a mensagem proativa para também tocar o som:

```tsx
useEffect(() => {
  const timer = setTimeout(() => {
    setShowProactiveMessage(true);
    
    // Tocar som de notificação
    const audio = new Audio('/sounds/notification.mp3');
    audio.volume = 0.5; // Volume moderado
    audio.play().catch(() => {
      // Ignora erro se autoplay bloqueado pelo navegador
    });
  }, 5000);
  
  return () => clearTimeout(timer);
}, []);
```

## Observações Técnicas

- Navegadores modernos podem bloquear autoplay de áudio se o usuário não interagiu com a página
- O `.catch()` trata silenciosamente esse caso para não gerar erros no console
- Volume configurado em 50% para não ser muito alto
- O som só toca uma vez, quando a mensagem aparece

## Arquivos a Modificar/Criar

| Arquivo | Ação |
|---------|------|
| `public/sounds/notification.mp3` | Criar (adicionar arquivo de áudio) |
| `src/components/layout/WhatsAppFloatingButton.tsx` | Modificar (adicionar reprodução do som) |

