
# Plano: Corrigir Imagens que Não Carregam em Produção

## O Problema

Várias imagens no site estão usando caminhos locais como:
```typescript
displayA4: "/src/assets/produtos/display-a4.webp"
```

Isso funciona **apenas em desenvolvimento**. Em **produção** (site publicado), o Vite não processa esses caminhos e as imagens não carregam.

---

## Imagens Afetadas

### PRODUTOS_IMAGES (src/lib/images.ts linhas 40-48)
| Propriedade | Caminho Local |
|-------------|---------------|
| displayA4 | /src/assets/produtos/display-a4.webp |
| medalhasPremiacoes | /src/assets/produtos/medalhas-premiacoes.webp |
| placasPersonalizadas | /src/assets/produtos/placas-personalizadas.jpg |
| urnaPiramidal | /src/assets/produtos/urna-piramidal.webp |
| caixaDoces | /src/assets/produtos/caixa-doces.webp |
| displayA4Parede | /src/assets/produtos/display-a4-parede.webp |
| displayA6Mesa | /src/assets/produtos/display-a6-mesa.webp |
| poteAGranel | /src/assets/produtos/pote-a-granel.webp |

### CHAPAS_IMAGES (linhas 57-62)
| Propriedade | Caminho Local |
|-------------|---------------|
| acrilicoLeitoso | /src/assets/chapas/ps-poliestireno.jpg |
| acrilicoEspelhado | /src/assets/chapas/policarbonato-compacto.jpg |
| policarbonato | /src/assets/chapas/policarbonato-alveolar.jpg |
| petg | /src/assets/chapas/pet-g.jpg |
| pvcExpandido | /src/assets/chapas/pvc-expandido.jpg |
| pedacosRetalhos | /src/assets/chapas/acm.jpg |

### CHAPAS_PAGINA_IMAGES (linhas 92-97)
| Propriedade | Caminho Local |
|-------------|---------------|
| poliestireno | /src/assets/chapas/ps-poliestireno-2.jpg |
| petg | /src/assets/chapas/pet-g-2.jpg |
| policarbonatoAlveolar | /src/assets/chapas/policarbonato-alveolar-2.jpg |
| policarbonatoCompacto | /src/assets/chapas/policarbonato-compacto-2.jpg |
| pvc | /src/assets/chapas/pvc-expandido-2.jpg |
| acm | /src/assets/chapas/acm-2.jpg |

### SOBMEDIDA_IMAGES (linhas 110-120)
| Propriedade | Caminho Local |
|-------------|---------------|
| display | /src/assets/produtos/display-acrilico.webp |
| urna | /src/assets/produtos/urna-acrilico.webp |
| caixaSugestao | /src/assets/produtos/caixa-sugestao.webp |
| expositoresCalcados | /src/assets/produtos/expositor-calcados.webp |
| portaFolder | /src/assets/produtos/porta-folder.webp |
| trofeuSobMedida | /src/assets/produtos/trofeu-sob-medida.webp |
| medalhaPersonalizada | /src/assets/produtos/medalha-personalizada.webp |
| quadroAvisos | /src/assets/produtos/quadro-avisos.jpg |
| boloFake | /src/assets/produtos/bolo-fake.jpeg |

---

## Solução

Migrar todas as imagens locais para o bucket `site-images` do Supabase Storage e atualizar as referências.

### Passo 1: Upload das Imagens

Farei upload de cada imagem local para o storage usando a edge function `migrate-images` ou upload manual.

### Passo 2: Atualizar src/lib/images.ts

Substituir todos os caminhos locais por URLs do storage:

```typescript
// ANTES
displayA4: "/src/assets/produtos/display-a4.webp",

// DEPOIS
displayA4: img("produtos/display-a4.webp"),
```

---

## Estrutura Final do Storage

```text
site-images/
├── produtos/
│   ├── display-a4.webp
│   ├── display-a4-parede.webp
│   ├── display-a6-mesa.webp
│   ├── display-acrilico.webp
│   ├── medalhas-premiacoes.webp
│   ├── medalha-personalizada.webp
│   ├── placas-personalizadas.jpg
│   ├── urna-piramidal.webp
│   ├── urna-acrilico.webp
│   ├── caixa-doces.webp
│   ├── caixa-sugestao.webp
│   ├── pote-a-granel.webp
│   ├── expositor-calcados.webp
│   ├── porta-folder.webp
│   ├── trofeu-sob-medida.webp
│   ├── quadro-avisos.jpg
│   └── bolo-fake.jpeg
├── chapas/
│   ├── ps-poliestireno.jpg
│   ├── ps-poliestireno-2.jpg
│   ├── pet-g.jpg
│   ├── pet-g-2.jpg
│   ├── policarbonato-alveolar.jpg
│   ├── policarbonato-alveolar-2.jpg
│   ├── policarbonato-compacto.jpg
│   ├── policarbonato-compacto-2.jpg
│   ├── pvc-expandido.jpg
│   ├── pvc-expandido-2.jpg
│   ├── acm.jpg
│   └── acm-2.jpg
```

---

## Arquivos a Modificar

| Arquivo | Alteração |
|---------|-----------|
| `src/lib/images.ts` | Substituir caminhos locais por URLs do storage |

---

## Resultado Esperado

1. Todas as imagens carregarão corretamente em produção
2. Seu amigo verá todas as imagens ao acessar o site
3. Centralização de todas as imagens no storage para facilitar manutenção
