
# Plano: Redesenhar Modal WhatsApp com Visual de Conversa de Chat

## Objetivo
Transformar o modal atual em algo que pareça uma janela do WhatsApp aberta no celular - com header verde do WhatsApp, avatar do atendente, área de chat, e input estilizado como campo de mensagem do WhatsApp.

---

## Design Visual Proposto

### Estrutura do Modal

```text
+------------------------------------------+
|  [Verde WhatsApp] Header com avatar      |
|  [Foto] Lab Acrílicos - Online           |
+------------------------------------------+
|                                          |
|  [Balão cinza esquerda]                  |
|  "Olá! Preencha os dados abaixo          |
|   para iniciarmos sua conversa"          |
|                                          |
|  +------------------------------------+  |
|  | [Formulário estilizado como chat] |  |
|  | Nome, Email, Telefone, Produto    |  |
|  +------------------------------------+  |
|                                          |
|  +------------------------------------+  |
|  | Sua mensagem...           [Enviar]|  |
|  +------------------------------------+  |
+------------------------------------------+
```

---

## Elementos Visuais WhatsApp

### 1. Header do Modal
- Background verde WhatsApp (#128C7E ou #075E54)
- Ícone de seta para voltar (fecha modal)
- Avatar circular (logo da empresa ou ícone genérico)
- Nome "Lab Acrílicos"
- Status "Online" com bolinha verde

### 2. Área de Conversa
- Background com padrão do WhatsApp (bege claro #ECE5DD)
- Balão de mensagem do "atendente" (cinza claro, lado esquerdo)
- Mensagem de boas-vindas estilizada

### 3. Campos do Formulário
- Estilizados como inputs modernos com bordas suaves
- Labels discretos dentro ou acima dos campos
- Cores neutras que combinem com o tema WhatsApp

### 4. Botão de Enviar
- Circular verde no estilo do WhatsApp
- Ou barra inferior verde com texto "Iniciar Conversa"

---

## Detalhes Técnicos

### Cores WhatsApp Oficiais
- Header: #075E54 (verde escuro)
- Botão enviar: #25D366 (verde claro)
- Background chat: #ECE5DD (bege)
- Balão recebido: #FFFFFF
- Balão enviado: #DCF8C6
- Texto: #303030

### Estrutura do Componente
```text
<Dialog>
  <DialogContent> (sem padding, bordas arredondadas)
    <Header WhatsApp>
      <Avatar + Nome + Status>
    </Header>
    
    <ChatArea> (background padrão WhatsApp)
      <BubbleMessage>
        "Olá! Preencha seus dados..."
      </BubbleMessage>
      
      <FormFields>
        (campos estilizados)
      </FormFields>
    </ChatArea>
    
    <InputArea>
      <Textarea mensagem>
      <BotaoEnviar circular verde>
    </InputArea>
  </DialogContent>
</Dialog>
```

### CSS Customizado
- Adicionar classes específicas para o tema WhatsApp
- Pattern de background do chat (opcional - pode ser cor sólida)
- Animações sutis nos balões de mensagem
- Border-radius específicos para balões (lado esquerdo/direito)

---

## Arquivo a Modificar

### `src/components/layout/WhatsAppModal.tsx`

**Mudanças:**
1. Remover DialogHeader padrão
2. Criar header customizado verde com avatar
3. Criar área de chat com background WhatsApp
4. Adicionar balão de mensagem de boas-vindas
5. Reorganizar campos do formulário
6. Estilizar botão de envio como o WhatsApp
7. Adicionar animação de entrada do balão

### `src/index.css`

**Adicionar:**
- Classes para cores do WhatsApp
- Estilos para balões de mensagem
- Background pattern do chat (opcional)
- Animações

---

## Experiência do Usuário

1. Usuário clica no botão WhatsApp
2. Modal abre com animação suave
3. Header verde mostra "Lab Acrílicos - Online"
4. Balão de mensagem aparece: "Olá! Para agilizar seu atendimento, preencha os dados abaixo"
5. Usuário preenche os campos
6. Clica no botão verde de enviar
7. Abre WhatsApp com mensagem formatada
