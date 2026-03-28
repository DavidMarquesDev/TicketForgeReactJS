# Roteiro de UI/UX — TicketForge
### Design moderno, acessível e orientado a produto

> **Objetivo:** guia completo de interface para o sistema de tickets — do design system às telas individuais, com decisões justificadas, anatomia de cada componente e especificações de comportamento.

---

## Sumário

1. [Filosofia de design](#1-filosofia-de-design)
2. [Design system — fundação visual](#2-design-system--fundação-visual)
3. [Layout global e navegação](#3-layout-global-e-navegação)
4. [Telas de autenticação](#4-telas-de-autenticação)
5. [Dashboard / Home](#5-dashboard--home)
6. [Lista de tickets](#6-lista-de-tickets)
7. [Detalhe do ticket](#7-detalhe-do-ticket)
8. [Criação de ticket](#8-criação-de-ticket)
9. [Comentários](#9-comentários)
10. [Painel de perfil e configurações](#10-painel-de-perfil-e-configurações)
11. [Estados especiais de UI](#11-estados-especiais-de-ui)
12. [Acessibilidade](#12-acessibilidade)
13. [Responsividade e mobile](#13-responsividade-e-mobile)
14. [Motion e microinterações](#14-motion-e-microinterações)
15. [Checklist de qualidade UI/UX](#15-checklist-de-qualidade-uiux)

---

## 1. Filosofia de design

O TicketForge é uma ferramenta de trabalho — não um produto de consumo. Isso define tudo. Usuários vão abrir essa interface dezenas de vezes por dia, sob pressão, para resolver problemas. O design serve à produtividade, não ao espetáculo.

### 1.1 Os quatro princípios

**Clareza antes de estética.**
Cada informação deve ser encontrada em menos de 3 segundos. Status de ticket, responsável, data de abertura — tudo visível sem clique adicional na listagem. Se o usuário precisa entrar no detalhe para descobrir algo básico, o layout falhou.

**Feedback constante e honesto.**
Toda ação tem uma resposta visual imediata. O sistema nunca fica silencioso após um clique. Loading states, confirmações de sucesso, mensagens de erro específicas — o usuário sempre sabe onde está e o que aconteceu.

**Hierarquia visual que guia a atenção.**
O olho do usuário deve ir naturalmente para a ação mais importante da tela. Na listagem: para o status e o título. No detalhe: para o status atual e os botões de ação. Peso tipográfico, cor e espaçamento constroem essa hierarquia — não decoração.

**Permissões invisíveis, não frustrantes.**
Botões que o usuário não pode usar simplesmente não aparecem — ou aparecem desabilitados com tooltip explicando o motivo. Nunca um botão ativo que retorna "sem permissão" sem aviso prévio.

### 1.2 Referências visuais

O estilo segue a linha de dashboards SaaS modernos como Linear, Plane e GitHub Issues: fundo claro (ou dark mode elegante), tipografia limpa, muita respiração entre elementos, uso cirúrgico de cor (apenas para semântica — status, alertas, ações primárias), sem gradientes decorativos.

---

## 2. Design system — fundação visual

### 2.1 Paleta de cores

A paleta é funcional. Cores carregam significado — não são decorativas.

#### Cores base (neutras)

```
--color-background:     #FAFAFA   /* Fundo geral da aplicação */
--color-surface:        #FFFFFF   /* Cards, modais, painéis */
--color-surface-raised: #F4F4F5   /* Hover states, inputs */
--color-border:         #E4E4E7   /* Divisores, bordas */
--color-border-strong:  #D4D4D8   /* Bordas de foco, separadores */

--color-text-primary:   #09090B   /* Títulos, labels */
--color-text-secondary: #71717A   /* Subtítulos, metadados */
--color-text-disabled:  #A1A1AA   /* Placeholders, itens inativos */
--color-text-inverse:   #FFFFFF   /* Texto sobre fundos escuros */
```

#### Cores semânticas (status de ticket)

Cada status tem uma paleta de três tons: fundo claro (badge), borda média (outline) e texto escuro (label).

```
/* Aberto (open) — Azul */
--status-open-bg:     #EFF6FF
--status-open-border: #93C5FD
--status-open-text:   #1D4ED8

/* Em andamento (in_progress) — Âmbar */
--status-progress-bg:     #FFFBEB
--status-progress-border: #FCD34D
--status-progress-text:   #B45309

/* Resolvido (resolved) — Verde */
--status-resolved-bg:     #F0FDF4
--status-resolved-border: #86EFAC
--status-resolved-text:   #15803D

/* Fechado (closed) — Cinza */
--status-closed-bg:     #F4F4F5
--status-closed-border: #D4D4D8
--status-closed-text:   #52525B
```

#### Cores de papel (role badge)

```
/* Admin — Vermelho discreto */
--role-admin-bg:   #FFF1F2
--role-admin-text: #BE123C

/* Suporte — Roxo */
--role-support-bg:   #FAF5FF
--role-support-text: #7E22CE

/* Usuário — Azul acinzentado */
--role-user-bg:   #F0F9FF
--role-user-text: #0369A1
```

#### Cores de ação

```
--color-primary:       #2563EB   /* Botão primário, links */
--color-primary-hover: #1D4ED8
--color-primary-light: #EFF6FF   /* Fundo de hover suave */

--color-danger:        #DC2626   /* Excluir, ações destrutivas */
--color-danger-hover:  #B91C1C
--color-danger-light:  #FEF2F2

--color-success:       #16A34A   /* Confirmações, sucesso */
--color-warning:       #D97706   /* Avisos, atenção */
```

#### Dark mode

Adicionar ao `:root[data-theme="dark"]`:

```
--color-background:     #09090B
--color-surface:        #18181B
--color-surface-raised: #27272A
--color-border:         #3F3F46
--color-border-strong:  #52525B

--color-text-primary:   #FAFAFA
--color-text-secondary: #A1A1AA
--color-text-disabled:  #71717A
```

### 2.2 Tipografia

Usar a fonte **Inter** (Google Fonts) — projetada para interfaces, excelente legibilidade em telas, suporte a números tabulares (essencial para IDs e datas).

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

font-family: 'Inter', system-ui, -apple-system, sans-serif;
font-feature-settings: "cv02", "cv03", "cv04", "cv11"; /* ligaduras de qualidade */
```

#### Escala tipográfica

| Token | Tamanho | Peso | Uso |
|---|---|---|---|
| `text-xs` | 11px | 400/500 | Timestamps, labels secundários |
| `text-sm` | 13px | 400/500 | Metadados, descrições de campo |
| `text-base` | 15px | 400 | Corpo de texto, comentários |
| `text-md` | 16px | 500/600 | Labels de campo, subtítulos |
| `text-lg` | 18px | 600 | Títulos de seção |
| `text-xl` | 22px | 600 | Títulos de página |
| `text-2xl` | 28px | 700 | Títulos de modal, headings maiores |

#### Números tabulares

Para IDs, contadores e datas — sempre usar `font-variant-numeric: tabular-nums` para alinhamento consistente em listas.

### 2.3 Espaçamento

Sistema baseado em múltiplos de 4px (escala de 8pt):

```
--space-1:  4px
--space-2:  8px
--space-3:  12px
--space-4:  16px
--space-5:  20px
--space-6:  24px
--space-8:  32px
--space-10: 40px
--space-12: 48px
--space-16: 64px
```

Regra prática: espaçamento interno de cards é sempre `--space-6` (24px). Gap entre cards em grid é `--space-4` (16px). Padding da sidebar é `--space-4` (16px).

### 2.4 Bordas e sombras

```css
/* Border radius */
--radius-sm:  4px   /* Badges, tags */
--radius-md:  8px   /* Inputs, botões */
--radius-lg:  12px  /* Cards */
--radius-xl:  16px  /* Modais */
--radius-full: 9999px /* Pills, avatars */

/* Sombras — uso muito controlado */
--shadow-sm: 0 1px 2px 0 rgba(0,0,0,0.05);
--shadow-md: 0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.05);
--shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -4px rgba(0,0,0,0.05);
```

Sombra só em elementos que flutuam (modais, dropdowns, toasts). Cards na página usam borda, não sombra.

### 2.5 Anatomia dos componentes principais

#### Badge de status

```
┌─────────────────┐
│  ● Em andamento │
└─────────────────┘

- Dot colorido (6px) + label
- Padding: 4px 10px
- Border-radius: 9999px (pill)
- Fonte: 12px, peso 500
- Fundo leve + texto escuro da mesma família de cor
```

#### Botão primário

```
┌─────────────────────┐
│    Criar ticket     │
└─────────────────────┘

- Altura: 36px (padrão) / 32px (compacto) / 40px (grande)
- Padding: 0 16px
- Border-radius: 8px
- Fonte: 14px, peso 500
- Fundo: --color-primary
- Hover: --color-primary-hover + translateY(-1px) sutil
- Foco: outline 2px --color-primary offset 2px
- Loading: spinner 14px substituindo texto + opacity 0.7
```

#### Input de texto

```
┌────────────────────────────────┐
│  Label                         │
│ ┌──────────────────────────┐   │
│ │ Placeholder text...      │   │
│ └──────────────────────────┘   │
│  Mensagem de ajuda ou erro      │
└────────────────────────────────┘

- Altura do input: 38px
- Border: 1px --color-border
- Border-radius: 8px
- Foco: border 1.5px --color-primary + shadow-sm azul suave
- Erro: border --color-danger + mensagem abaixo em 12px vermelho
- Label: 13px, peso 500, margem-bottom 6px
```

#### Card de ticket (listagem)

```
┌──────────────────────────────────────────────────────┐
│  ● Em andamento          João Silva  Há 2 horas      │
│                                                      │
│  Timeout no gateway de pagamento                     │
│  Usuários relatam timeout ao confirmar cartão...     │
│                                                      │
│  #7  Criado por: Ana Costa  Atribuído: Carlos Lima   │
└──────────────────────────────────────────────────────┘

Especificações:
- Padding: 20px 24px
- Border: 1px --color-border
- Border-radius: 12px
- Hover: background --color-surface-raised + border --color-border-strong
- Cursor: pointer
- Transição: 150ms ease
```

### 2.6 Ícones

Usar **Lucide React** — consistente com shadcn/ui, tree-shakeable, stroke uniforme.

Tamanhos padronizados:
- `16px` — ícones inline em texto, badges
- `18px` — botões com ícone
- `20px` — navegação lateral
- `24px` — ícones de estado vazio, ilustrações

Sempre definir `strokeWidth={1.5}` — mais elegante que o padrão `2`.

---

## 3. Layout global e navegação

### 3.1 Estrutura macro

O layout segue o padrão **sidebar fixa + área de conteúdo fluida**, consagrado em ferramentas como Linear, Notion e Jira.

```
┌────────────────────────────────────────────────────┐
│                    TOPBAR (56px)                   │
├──────────────┬─────────────────────────────────────┤
│              │                                     │
│   SIDEBAR    │         CONTENT AREA                │
│   (240px)    │         (fluida)                    │
│              │                                     │
│              │                                     │
│              │                                     │
│              │                                     │
└──────────────┴─────────────────────────────────────┘
```

### 3.2 Topbar

Altura fixa de 56px. Sempre visível.

```
┌──────────────────────────────────────────────────────────────────┐
│  ☰  TicketForge          [ Busca global... ]    🔔   [ Avatar ▼] │
└──────────────────────────────────────────────────────────────────┘
```

Elementos da esquerda para direita:
- **Hambúrguer** (mobile) ou logo do produto
- **Nome da aplicação** — `TicketForge` em peso 600
- **Campo de busca global** — centralizado, 380px de largura máxima, atalho `Cmd+K`
- **Sino de notificações** — badge com contador quando há itens
- **Avatar do usuário** — iniciais em círculo colorido + dropdown ao clicar

**Dropdown do avatar:**
```
┌──────────────────┐
│ João da Silva    │
│ joao@email.com   │
│ ─────────────── │
│ 👤 Meu perfil    │
│ ⚙️  Configurações │
│ ─────────────── │
│ 🚪 Sair          │
└──────────────────┘
```

### 3.3 Sidebar

Largura: 240px desktop / recolhível em tablet / drawer em mobile.

```
┌────────────────────────────┐
│  TicketForge               │
│                            │
│  ⚡ Dashboard              │  ← item ativo: fundo azul leve, texto azul
│  🎫 Tickets                │
│  👥 Usuários (admin)       │  ← visível apenas para admin
│                            │
│                            │
│                            │
│  ─────────────────         │
│  [Avatar] João Silva       │
│           Admin            │
└────────────────────────────┘
```

**Comportamento dos itens:**
- Estado normal: ícone + label, texto `--color-text-secondary`
- Hover: fundo `--color-surface-raised`, texto `--color-text-primary`
- Ativo: fundo `--color-primary-light`, texto `--color-primary`, ícone colorido
- Bordas arredondadas nos itens: `--radius-md` (8px)
- Padding por item: `10px 12px`

**Seção do usuário (rodapé da sidebar):**
- Avatar circular 32px com iniciais
- Nome e role badge em duas linhas
- Clique abre o mesmo dropdown do avatar da topbar

### 3.4 Área de conteúdo

Padding interno: `32px 40px` em desktop, `20px 16px` em mobile.

Cabeçalho de cada página segue o padrão:
```
┌──────────────────────────────────────────────────────┐
│  Tickets                          [+ Criar ticket]   │
│  Gerencie todos os chamados do sistema               │
│                                                      │
│  [Filtros]                                           │
└──────────────────────────────────────────────────────┘
```

---

## 4. Telas de autenticação

### 4.1 Princípios das telas de auth

Telas de login e cadastro são **fora do layout principal** — sem sidebar, sem topbar. Layout centralizado, fundo sutil, foco total no formulário.

### 4.2 Tela de login

```
┌────────────────────────────────────────────────────┐
│                                                    │
│              🎫  TicketForge                       │
│        Sistema de gerenciamento de tickets         │
│                                                    │
│  ┌──────────────────────────────────────────────┐  │
│  │                                              │  │
│  │  Bem-vindo de volta                          │  │
│  │  Acesse sua conta para continuar             │  │
│  │                                              │  │
│  │  CPF                                         │  │
│  │  ┌────────────────────────────────────────┐  │  │
│  │  │  Somente números (11 dígitos)          │  │  │
│  │  └────────────────────────────────────────┘  │  │
│  │                                              │  │
│  │  Senha                                       │  │
│  │  ┌────────────────────────────────────────┐  │  │
│  │  │  ••••••••                          👁  │  │  │
│  │  └────────────────────────────────────────┘  │  │
│  │                                              │  │
│  │  ┌────────────────────────────────────────┐  │  │
│  │  │              Entrar                    │  │  │
│  │  └────────────────────────────────────────┘  │  │
│  │                                              │  │
│  │  Não tem conta? Cadastre-se                  │  │
│  │                                              │  │
│  └──────────────────────────────────────────────┘  │
│                                                    │
└────────────────────────────────────────────────────┘
```

**Especificações técnicas:**
- Fundo: `--color-background` com padrão sutil (dots ou grid 1px, opacidade 3%)
- Card central: `max-width: 400px`, `border-radius: 16px`, borda 1px, `padding: 40px`
- Logo: ícone SVG 32px + nome em 22px peso 700
- Subtítulo do produto: 14px, `--color-text-secondary`, centralizado
- Botão de entrar: largura 100%, altura 40px

**Estados de erro:**
- CPF inválido (400): borda vermelha no input + `"CPF deve ter 11 dígitos"` abaixo
- Credenciais inválidas (401): banner de alerta acima do botão — `"CPF ou senha incorretos"`
- Rate limit (429): banner amarelo — `"Muitas tentativas. Aguarde 60 segundos."` com contador regressivo
- Banner de erro: `border-radius: 8px`, fundo `--color-danger-light`, ícone de alerta, texto 13px

**Botão durante loading:**
```
┌────────────────────────────────────┐
│  ○  Entrando...                    │  ← spinner 14px + texto + opacity 0.7
└────────────────────────────────────┘
```

### 4.3 Tela de cadastro

Mesma estrutura do login, com campos adicionais:

```
  Nome completo
  ┌──────────────────────────────────────────┐
  │  João da Silva                           │
  └──────────────────────────────────────────┘

  CPF
  ┌──────────────────────────────────────────┐
  │  Somente números (11 dígitos)            │
  └──────────────────────────────────────────┘

  E-mail
  ┌──────────────────────────────────────────┐
  │  joao@empresa.com                        │
  └──────────────────────────────────────────┘

  Senha                        (indicador de força)
  ┌──────────────────────────────────────────┐
  │  ••••••••                            👁  │
  └──────────────────────────────────────────┘
  ████████░░  Forte

  ┌──────────────────────────────────────────┐
  │              Criar conta                 │
  └──────────────────────────────────────────┘

  Já tem conta? Entrar
```

**Indicador de força de senha:**
- Barra de progresso 4px de altura, `border-radius: 2px`
- Fraca (< 8 chars): vermelha
- Média (8 chars, sem variação): âmbar
- Forte (8+ chars, mistura): verde
- Texto 11px ao lado: `"Fraca"` / `"Média"` / `"Forte"`

**Erro 409 (CPF ou e-mail já cadastrado):**
Banner vermelho: `"Este CPF já está cadastrado."` ou `"Este e-mail já está em uso."`

---

## 5. Dashboard / Home

### 5.1 Objetivo da tela

O dashboard é a primeira tela após o login. Deve responder em 3 segundos a pergunta: **"O que precisa da minha atenção agora?"**

### 5.2 Layout

```
┌──────────────────────────────────────────────────────────────────┐
│  Bom dia, João  👋                         Hoje, 28 de março     │
│  Aqui está o resumo de hoje                                      │
│                                                                  │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌────────┐  │
│  │  Abertos     │ │ Em andamento │ │  Resolvidos  │ │Fechados│  │
│  │     12       │ │      5       │ │      8       │ │   47   │  │
│  │  ↑ 3 hoje    │ │  ↓ 2 hoje    │ │  ↑ 5 hoje    │ │        │  │
│  └──────────────┘ └──────────────┘ └──────────────┘ └────────┘  │
│                                                                  │
│  ┌─────────────────────────────────┐ ┌────────────────────────┐  │
│  │  Tickets recentes               │ │  Atribuídos a mim      │  │
│  │  ─────────────────────────     │ │  ──────────────────    │  │
│  │  ● Timeout no gateway    2h    │ │  ● Login com Google  1d │  │
│  │  ● Bug no relatório PDF  4h    │ │  ● Relatório lento   3h │  │
│  │  ● Erro ao exportar CSV  1d    │ │                         │  │
│  │                                │ │                         │  │
│  │  Ver todos →                   │ │  Ver todos →            │  │
│  └─────────────────────────────────┘ └────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

### 5.3 Cards de métricas

```
┌───────────────────────────────────┐
│  🔵  Abertos                      │
│                                   │
│     12                            │
│                                   │
│  ↑ 3 novos hoje                   │
└───────────────────────────────────┘
```

- `border-radius: 12px`, borda 1px `--color-border`
- Ícone colorido 20px no topo
- Número: `font-size: 32px, font-weight: 700`
- Variação: seta + texto 13px (verde para positivo em resolvidos, âmbar para aumento em abertos)
- Clique navega para a lista filtrada pelo status correspondente
- Hover: `box-shadow: --shadow-md` suave

### 5.4 Comportamento por role

| Role | O que vê no dashboard |
|---|---|
| `user` | Tickets que criou + Atribuídos a ele |
| `support` | Todos os tickets + Atribuídos a ele (destacado) |
| `admin` | Visão global completa + métricas de todos os usuários |

---

## 6. Lista de tickets

### 6.1 Layout da página

```
┌──────────────────────────────────────────────────────────────────┐
│  Tickets                                    [+ Criar ticket]     │
│  72 tickets encontrados                                          │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Status ▼    Responsável ▼    Ordenar por ▼   [ Busca... ] │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │  ● Em andamento                    Carlos L.  Há 2 horas │    │
│  │                                                          │    │
│  │  Timeout no gateway de pagamento                    #7   │    │
│  │  Usuários relatam timeout ao confirmar cartão...         │    │
│  │                                                          │    │
│  │  Criado por: Ana Costa                                   │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │  ● Aberto                              —      Há 4 horas │    │
│  │                                                          │    │
│  │  Bug ao exportar relatório PDF                      #6   │    │
│  │  O botão de exportar PDF na tela de relatórios...        │    │
│  │                                                          │    │
│  │  Criado por: João Silva                                  │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ◀  1  2  3  ...  8  ▶                           20 por página   │
└──────────────────────────────────────────────────────────────────┘
```

### 6.2 Anatomia do card de ticket

```
┌──────────────────────────────────────────────────────┐
│  [STATUS BADGE]               [AVATAR] [TEMPO RELAT] │  ← linha 1
│                                                      │
│  [TÍTULO DO TICKET]                             [ID] │  ← linha 2
│  [DESCRIÇÃO TRUNCADA - max 2 linhas]                 │  ← linha 3
│                                                      │
│  Criado por: [NOME]                                  │  ← linha 4
└──────────────────────────────────────────────────────┘
```

**Especificações do card:**
- Padding: `20px 24px`
- Border: `1px solid --color-border`
- Border-radius: `12px`
- Título: `16px, peso 500`, truncar em 1 linha com `text-overflow: ellipsis`
- Descrição: `14px, --color-text-secondary`, máximo 2 linhas com `line-clamp: 2`
- ID: `font-size: 12px, font-variant-numeric: tabular-nums`, cor `--color-text-disabled`
- Tempo relativo: `12px, --color-text-secondary` (ex: "há 2 horas", "há 3 dias")
- Hover: `background: --color-surface-raised`, borda levemente mais escura, `cursor: pointer`
- Transição: `150ms ease`

**Avatar do responsável:**
- Círculo 28px com iniciais em 11px peso 500
- Cor gerada deterministicamente pelo nome (hash simples) — cada pessoa tem sua cor consistente
- Se sem responsável: ícone de usuário cinza + tooltip "Não atribuído"

### 6.3 Barra de filtros

```
┌────────────────────────────────────────────────────────────────┐
│  [● Status ▼]  [👤 Responsável ▼]  [↕ Ordenar ▼]  [🔍 Busca] │
└────────────────────────────────────────────────────────────────┘
```

**Dropdown de status:**
```
┌──────────────────────────┐
│ ☐  Todos os status       │
│ ─────────────────────    │
│ ☑  ● Aberto              │
│ ☐  ● Em andamento        │
│ ☐  ● Resolvido           │
│ ☐  ● Fechado             │
└──────────────────────────┘
```

- Multi-select com checkboxes
- Badge no botão mostrando quantos filtros ativos: `Status (2)`
- Botão "Limpar filtros" aparece quando há filtros ativos, à direita da barra

**Busca:**
- Input à direita, 220px mínimo
- Debounce de 300ms antes de chamar a API
- Ícone de X para limpar quando há texto
- Placeholder: `"Buscar tickets..."`

### 6.4 Paginação

```
◀  Anterior     [1] [2] [3] ... [8]     Próximo ▶

                              20 por página ▼
```

- Botões de página: 32px × 32px, `border-radius: 8px`
- Página atual: fundo `--color-primary`, texto branco
- Hover em outras páginas: fundo `--color-surface-raised`
- `Anterior` e `Próximo` desabilitados quando na primeira/última página
- Selector de itens por página: `20`, `50`, `100`
- Manter dados anteriores visíveis com fade leve durante carregamento da nova página

### 6.5 Estado vazio

Quando não há tickets com os filtros aplicados:

```
┌──────────────────────────────────────────────┐
│                                              │
│              🎫                              │
│                                              │
│      Nenhum ticket encontrado               │
│                                              │
│   Tente ajustar os filtros ou criar         │
│   um novo ticket.                           │
│                                             │
│        [+ Criar novo ticket]                │
│                                             │
└──────────────────────────────────────────────┘
```

---

## 7. Detalhe do ticket

### 7.1 Layout

O detalhe usa uma estrutura de **duas colunas**: conteúdo principal à esquerda, painel de metadados e ações à direita.

```
┌──────────────────────────────────────────────────────────────────┐
│  ← Voltar para tickets                                  #7       │
│                                                                  │
│  ┌──────────────────────────────────┐ ┌──────────────────────┐   │
│  │  COLUNA PRINCIPAL (65%)          │ │  COLUNA LATERAL (35%)│   │
│  │                                  │ │                      │   │
│  │  ● Em andamento                  │ │  Status              │   │
│  │                                  │ │  [● Em andamento ▼]  │   │
│  │  Timeout no gateway de           │ │                      │   │
│  │  pagamento                       │ │  Responsável         │   │
│  │                                  │ │  [Carlos Lima    ▼]  │   │
│  │  Criado por Ana Costa            │ │                      │   │
│  │  28 de março de 2026, 13:00     │ │  Criado por          │   │
│  │                                  │ │  Ana Costa           │   │
│  │  ─────────────────────────────  │ │                      │   │
│  │                                  │ │  Abertura            │   │
│  │  Descrição                       │ │  28/03/2026, 13:00   │   │
│  │                                  │ │                      │   │
│  │  Usuários relatam timeout ao     │ │  Última atualização  │   │
│  │  confirmar cartão no checkout.   │ │  28/03/2026, 15:30   │   │
│  │  O erro ocorre após 30s de       │ │                      │   │
│  │  espera sem resposta...          │ │  [🗑 Excluir ticket] │   │
│  │                                  │ │  (apenas admin)      │   │
│  │  ─────────────────────────────  │ └──────────────────────┘   │
│  │                                  │                            │
│  │  Comentários (3)                 │                            │
│  │  [ver seção 9]                   │                            │
│  └──────────────────────────────────┘                            │
└──────────────────────────────────────────────────────────────────┘
```

### 7.2 Painel lateral — controle de status

O select de status na coluna lateral mostra apenas as transições válidas:

**Ticket `open`:**
```
┌──────────────────────────┐
│  ● Aberto           ▼    │
└──────────────────────────┘
Dropdown:
┌──────────────────────────┐
│  → Em andamento          │  ← única opção disponível
└──────────────────────────┘
```

**Ticket `closed`:**
```
┌──────────────────────────┐
│  ● Fechado          ▼    │  ← desabilitado, sem seta
└──────────────────────────┘
Tooltip ao hover: "Tickets fechados não podem ser reabertos"
```

**Quem vê o select de status:**
- Criador do ticket
- Usuário atribuído
- Qualquer `support` ou `admin`
- Para `user` sem vínculo com o ticket: label somente leitura

**Confirmação antes de mudar status:**
```
┌─────────────────────────────────────────────┐
│  Confirmar mudança de status                │
│                                             │
│  Deseja mover este ticket de               │
│  "Em andamento" para "Resolvido"?           │
│                                             │
│  [Cancelar]           [Confirmar]           │
└─────────────────────────────────────────────┘
```

### 7.3 Painel lateral — atribuição

Visível apenas para `support` e `admin`:

```
  Responsável
  ┌──────────────────────────┐
  │  [Avatar] Carlos Lima ▼  │
  └──────────────────────────┘
```

Dropdown de atribuição:
```
┌──────────────────────────────┐
│  🔍 Buscar usuário...        │
│  ─────────────────────────   │
│  [AV] Ana Vargas             │
│  [CL] Carlos Lima  ← atual  │
│  [MB] Marcos Barbosa         │
└──────────────────────────────┘
```

- Lista filtrável de usuários do sistema
- Usuário atual marcado com checkmark
- Avatar circular 24px + nome
- Opção "Remover atribuição" no topo

### 7.4 Breadcrumb e navegação

```
← Voltar para tickets                                          #7
```

- Seta e texto "Voltar" à esquerda — clique navega para a lista com filtros preservados
- ID `#7` à direita em `12px, --color-text-disabled, font-variant-numeric: tabular-nums`
- Botão de copiar ID ao hover no `#7`

---

## 8. Criação de ticket

### 8.1 Layout — página dedicada

```
┌──────────────────────────────────────────────────────────────────┐
│  ← Cancelar                                                      │
│                                                                  │
│  Novo ticket                                                     │
│  Descreva o problema com o máximo de detalhes possível           │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                                                            │  │
│  │  Título *                                                  │  │
│  │  ┌──────────────────────────────────────────────────────┐  │  │
│  │  │  Ex: Timeout no gateway de pagamento                 │  │  │
│  │  └──────────────────────────────────────────────────────┘  │  │
│  │  Seja específico — bons títulos ajudam na triagem           │  │
│  │                                                            │  │
│  │  Descrição *                                               │  │
│  │  ┌──────────────────────────────────────────────────────┐  │  │
│  │  │                                                      │  │  │
│  │  │  Descreva o problema, como reproduzi-lo e o         │  │  │
│  │  │  impacto para os usuários...                        │  │  │
│  │  │                                                      │  │  │
│  │  │                                                      │  │  │
│  │  └──────────────────────────────────────────────────────┘  │  │
│  │  Mínimo de 20 caracteres. Inclua passos para reprodução.   │  │
│  │                                                            │  │
│  │                           [Cancelar]  [Criar ticket →]     │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

### 8.2 Especificações do formulário

**Campo Título:**
- Tipo: `input text`
- Max: 255 caracteres
- Contador de caracteres visível ao digitar: `"47 / 255"` alinhado à direita, abaixo do input
- Validação: obrigatório, mínimo 3 caracteres

**Campo Descrição:**
- Tipo: `textarea`
- Altura mínima: 160px, expansível
- Validação: obrigatório, mínimo 20 caracteres
- Helper text: exemplo de bom preenchimento

**Botões:**
- `Cancelar` — secundário, volta para a lista sem confirmação se formulário vazio, mostra dialog de confirmação se há dados preenchidos
- `Criar ticket →` — primário, desabilitado até formulário válido

**Após sucesso:**
- Toast: `"Ticket #8 criado com sucesso"` com link clicável para o detalhe
- Redireciona automaticamente para o detalhe do ticket criado após 1.5s

---

## 9. Comentários

Os comentários ficam na parte inferior da página de detalhe do ticket, abaixo da descrição.

### 9.1 Layout da seção

```
  ─────────────────────────────────────────────────────

  Comentários (3)

  ┌──────────────────────────────────────────────────┐
  │  [AV]  Ana Costa                     13:05        │
  │                                                  │
  │  Confirmamos o problema. O timeout está          │
  │  ocorrendo no serviço de pagamento externo.      │
  │                                                  │
  │                              [Editar] [Excluir]  │
  └──────────────────────────────────────────────────┘

  ┌──────────────────────────────────────────────────┐
  │  [CL]  Carlos Lima                   14:30        │
  │                                                  │
  │  Iniciando investigação. O serviço externo está  │
  │  retornando 503 intermitentemente.               │
  │                                                  │
  │                                        [Excluir] │
  └──────────────────────────────────────────────────┘

  ─────────────────────────────────────────────────────

  Adicionar comentário

  ┌──────────────────────────────────────────────────┐
  │                                                  │
  │  Escreva um comentário...                        │
  │                                                  │
  │                                                  │
  └──────────────────────────────────────────────────┘
  Seja objetivo e inclua informações relevantes.

                                   [Publicar comentário]
```

### 9.2 Anatomia do comentário

```
┌─────────────────────────────────────────────────┐
│  [AVATAR 32px]  NOME         HORA/DATA          │  ← header
│                                                 │
│  CONTEÚDO DO COMENTÁRIO (texto livre)           │  ← corpo
│                                                 │
│                          [Editar] [Excluir]     │  ← ações (condicionais)
└─────────────────────────────────────────────────┘
```

**Regras de exibição dos botões:**
- `[Editar]` e `[Excluir]`: visíveis para o autor do comentário
- `[Excluir]`: visível adicionalmente para `admin`
- Para outros usuários: sem botões de ação

**Comportamento do hover:**
- Ações aparecem com fadeIn 150ms ao hover no comentário
- Evita poluição visual quando não há intenção de ação

### 9.3 Edição inline de comentário

Ao clicar em `[Editar]`, o texto do comentário é substituído por um textarea no lugar:

```
┌──────────────────────────────────────────────────┐
│  [AV]  Ana Costa                     13:05        │
│                                                  │
│  ┌──────────────────────────────────────────┐   │
│  │  Confirmamos o problema. O timeout está  │   │
│  │  ocorrendo no serviço de pagamento...    │   │
│  └──────────────────────────────────────────┘   │
│                                                  │
│              [Cancelar]    [Salvar alteração]    │
└──────────────────────────────────────────────────┘
```

- Textarea começa com o conteúdo atual selecionado
- `Esc` cancela a edição
- `Ctrl+Enter` salva
- Botão `Salvar` desabilitado se conteúdo não foi alterado

### 9.4 Exclusão com confirmação

```
┌──────────────────────────────────────────────┐
│  Excluir comentário?                         │
│                                              │
│  Esta ação não pode ser desfeita.            │
│                                              │
│         [Cancelar]    [Excluir]              │
└──────────────────────────────────────────────┘
```

- Dialog modal simples, sem excesso de texto
- Botão `Excluir` em vermelho (`--color-danger`)
- Foco inicial no botão `Cancelar` (safe default)

### 9.5 Paginação de comentários

- Carregar 20 por vez com botão `Carregar mais comentários` no final da lista
- Ordenação padrão: cronológica ascendente (mais antigo primeiro)
- Após novo comentário: scroll automático suave para o novo item

---

## 10. Painel de perfil e configurações

Acessível via dropdown do avatar → `"Meu perfil"`.

```
┌──────────────────────────────────────────────────────────────────┐
│  Meu Perfil                                                      │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  [AVATAR 64px]  João da Silva                              │  │
│  │                 joao@empresa.com                           │  │
│  │                 [● Usuário]                                │  │
│  │                                                            │  │
│  │  Membro desde 15 de janeiro de 2026                        │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Informações pessoais                                      │  │
│  │  ─────────────────────────────                            │  │
│  │  Nome     João da Silva                                    │  │
│  │  CPF      123.456.789-01                                   │  │
│  │  E-mail   joao@empresa.com                                 │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Preferências                                              │  │
│  │  ─────────────────────────────                            │  │
│  │  Tema          ○ Claro  ● Escuro  ○ Sistema               │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│                                           [Sair da conta]        │
└──────────────────────────────────────────────────────────────────┘
```

**Seletor de tema:**
- Três opções: Claro / Escuro / Sistema (segue `prefers-color-scheme`)
- Toggle visual com ícone de sol, lua e monitor
- Mudança imediata, salva em `localStorage`

---

## 11. Estados especiais de UI

### 11.1 Loading states

**Skeleton screens** — nunca mostrar spinners genéricos em toda a página. Usar skeletons que espelham o layout real do conteúdo.

**Skeleton do card de ticket:**
```
┌──────────────────────────────────────────────────────┐
│  ░░░░░░░░░░░░░           ░░░░░░░  ░░░░░░░░░░░        │
│                                                      │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ ░░░░      │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░                        │
│                                                      │
│  ░░░░░░░░░░░░░░░░░                                   │
└──────────────────────────────────────────────────────┘
```

- Cor dos blocos: `--color-surface-raised`
- Animação: `shimmer` horizontal, 1.5s linear infinito
- Mostrar 3-5 skeletons empilhados durante o carregamento da lista

**Skeleton do detalhe:**
- Bloco de título 60% da largura
- Bloco de metadados na coluna lateral
- Bloco de descrição com 4 linhas

### 11.2 Erro de carregamento

Quando a query falha (rede, 5xx):

```
┌──────────────────────────────────────┐
│                                      │
│  ⚠️                                  │
│                                      │
│  Não foi possível carregar           │
│  os tickets                          │
│                                      │
│  Verifique sua conexão ou tente      │
│  novamente.                          │
│                                      │
│         [↻ Tentar novamente]         │
│                                      │
└──────────────────────────────────────┘
```

### 11.3 Toast notifications

Posição: `top-right`, 16px de margem.

**Sucesso:**
```
┌────────────────────────────────────────┐
│  ✓  Ticket criado com sucesso          │  ← verde, 4s, auto-dismiss
└────────────────────────────────────────┘
```

**Erro:**
```
┌────────────────────────────────────────┐
│  ✕  Você não tem permissão             │  ← vermelho, 6s, fechar manual
└────────────────────────────────────────┘
```

**Aviso:**
```
┌────────────────────────────────────────┐
│  ⚠  Muitas tentativas. Aguarde 58s...  │  ← âmbar, countdown, persistente
└────────────────────────────────────────┘
```

Specs gerais do toast:
- `border-radius: 12px`
- `padding: 14px 16px`
- `min-width: 280px, max-width: 400px`
- Animação de entrada: `slide-in` da direita + fade, 200ms
- Animação de saída: `fade-out` + `slide-up`, 200ms
- Máximo 3 toasts simultâneos — o mais antigo é descartado

### 11.4 Confirmações destrutivas

Toda ação irreversível (excluir comentário, fechar ticket) exige um dialog de confirmação. Nunca uma ação destrutiva executa no primeiro clique.

Estrutura do dialog:
```
┌────────────────────────────────────────────┐
│  [Ícone de aviso]                          │
│  Título curto da ação                      │
│                                            │
│  Uma frase explicando a consequência.      │
│                                            │
│                  [Cancelar]  [Confirmar]   │
└────────────────────────────────────────────┘
```

- `Cancelar` em estilo secundário, recebe foco automático
- `Confirmar` em `--color-danger` para ações destrutivas
- `Esc` fecha o dialog (mesmo efeito que `Cancelar`)

### 11.5 Página 404

```
┌──────────────────────────────────────────────┐
│                                              │
│               404                            │
│                                              │
│        Página não encontrada                │
│                                              │
│  O ticket ou recurso que você buscou        │
│  não existe ou foi removido.                │
│                                              │
│         [← Voltar para tickets]             │
│                                              │
└──────────────────────────────────────────────┘
```

---

## 12. Acessibilidade

Acessibilidade não é opcional — é requisito de qualidade. O TicketForge deve passar no nível **WCAG 2.1 AA**.

### 12.1 Contraste

Todas as combinações de texto/fundo devem respeitar:
- Texto normal (< 18px): mínimo **4.5:1**
- Texto grande (≥ 18px ou 14px bold): mínimo **3:1**
- Componentes de UI (bordas de input, ícones informativos): mínimo **3:1**

Combinações verificadas com a paleta definida:

| Elemento | Foreground | Background | Ratio |
|---|---|---|---|
| Texto primário | `#09090B` | `#FAFAFA` | 19.7:1 ✓ |
| Status "Aberto" | `#1D4ED8` | `#EFF6FF` | 5.1:1 ✓ |
| Status "Em andamento" | `#B45309` | `#FFFBEB` | 4.7:1 ✓ |
| Texto secundário | `#71717A` | `#FFFFFF` | 4.6:1 ✓ |
| Placeholder | `#A1A1AA` | `#FFFFFF` | 2.9:1 ← melhorar se necessário |

### 12.2 Navegação por teclado

Todos os elementos interativos devem ser acessíveis via `Tab`:

- Ordem de foco lógica: segue o fluxo visual da página
- `Tab` move o foco adiante, `Shift+Tab` move atrás
- `Enter` ou `Space` ativa botões e selects
- `Esc` fecha modais e dropdowns
- `Arrow keys` navegam entre opções de dropdown e selects

**Foco visível:**
```css
/* Nunca remover o outline — customizar em vez de suprimir */
:focus-visible {
  outline: 2px solid #2563EB;
  outline-offset: 2px;
  border-radius: 4px;
}
```

### 12.3 Atributos ARIA

```html
<!-- Status badge — não é interativo, mas carrega semântica -->
<span role="status" aria-label="Status: Em andamento">
  <span aria-hidden="true">●</span> Em andamento
</span>

<!-- Botão de excluir — contexto não está claro só pelo label -->
<button aria-label="Excluir comentário de Ana Costa">
  <TrashIcon />
</button>

<!-- Loading state -->
<div role="status" aria-live="polite">
  <span class="sr-only">Carregando tickets...</span>
</div>

<!-- Dialog modal -->
<div role="dialog" aria-modal="true" aria-labelledby="dialog-title">
  <h2 id="dialog-title">Excluir comentário?</h2>
</div>

<!-- Toast notifications -->
<div role="alert" aria-live="assertive">
  Ticket criado com sucesso
</div>
```

### 12.4 Classe utilitária para conteúdo só visual de acessibilidade

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

---

## 13. Responsividade e mobile

O TicketForge é primariamente desktop, mas deve ser utilizável em tablet e mobile.

### 13.1 Breakpoints

```
mobile:  < 640px
tablet:  640px – 1024px
desktop: > 1024px
```

### 13.2 Comportamento por breakpoint

**Desktop (> 1024px):**
- Sidebar fixa 240px visível
- Grid de duas colunas no detalhe do ticket
- Cards de métricas em linha (4 colunas)

**Tablet (640px – 1024px):**
- Sidebar recolhe para 60px (ícones apenas), expande ao hover/click
- Grid do detalhe vira coluna única (metadados vão para baixo do conteúdo)
- Cards de métricas: 2 colunas

**Mobile (< 640px):**
- Sidebar vira drawer (painel deslizante da esquerda)
- Botão hambúrguer no topbar
- Cards de métricas em grid 2×2
- Filtros colapsam em um botão `Filtrar ▼` que abre bottom sheet
- Paginação simplificada: apenas `◀ Anterior` e `Próximo ▶`

### 13.3 Touch targets

Em mobile, todo elemento tocável deve ter no mínimo `44px × 44px` de área de toque (mesmo que visualmente menor), conforme recomendação da Apple HIG e Google Material.

```css
/* Aumentar área de toque sem alterar visual */
.btn-icon {
  position: relative;
  padding: 8px;
}
.btn-icon::before {
  content: '';
  position: absolute;
  inset: -8px;
}
```

---

## 14. Motion e microinterações

### 14.1 Filosofia

Animações servem para orientar o usuário — não para impressionar. Cada animação deve ter um propósito claro: confirmar uma ação, indicar transição, mostrar carregamento.

**Regra de ouro:** se a animação não pudesse existir e o produto ainda funcionasse bem, ela provavelmente não deve existir. Se ela ajuda o usuário a entender o que aconteceu, ela deve existir.

### 14.2 Durations e easings

```css
/* Micro (hover, foco) */
--duration-fast: 100ms;
--easing-standard: cubic-bezier(0.4, 0, 0.2, 1);

/* Transições de estado (loading, aparecer/sumir) */
--duration-normal: 200ms;
--easing-decelerate: cubic-bezier(0, 0, 0.2, 1);

/* Entradas de elementos (modais, drawers) */
--duration-slow: 300ms;
--easing-accelerate: cubic-bezier(0.4, 0, 1, 1);
```

### 14.3 Catálogo de microinterações

**Hover em card de ticket:**
```css
.ticket-card {
  transition: background-color 150ms ease, border-color 150ms ease;
}
.ticket-card:hover {
  background-color: var(--color-surface-raised);
  border-color: var(--color-border-strong);
}
```

**Botão primário:**
```css
.btn-primary {
  transition: background-color 100ms ease, transform 100ms ease, box-shadow 100ms ease;
}
.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
}
.btn-primary:active {
  transform: translateY(0);
}
```

**Entrada do modal:**
```css
@keyframes modal-in {
  from { opacity: 0; transform: scale(0.95) translateY(8px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}
.modal {
  animation: modal-in 200ms cubic-bezier(0, 0, 0.2, 1);
}
```

**Toast (entrada e saída):**
```css
@keyframes toast-in {
  from { opacity: 0; transform: translateX(100%); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes toast-out {
  from { opacity: 1; transform: translateY(0); max-height: 80px; }
  to   { opacity: 0; transform: translateY(-8px); max-height: 0; }
}
```

**Skeleton shimmer:**
```css
@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-surface-raised) 25%,
    var(--color-border) 50%,
    var(--color-surface-raised) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s linear infinite;
}
```

**Badge de status (troca de status no detalhe):**
- Fade out do badge atual (100ms)
- Fade in do novo badge (100ms)
- Não usar slide — confunde ao usuário

### 14.4 Respeitar prefers-reduced-motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 15. Checklist de qualidade UI/UX

### Design system

- [ ] Todas as cores usam variáveis CSS (`--color-*`), nenhum hexadecimal hardcoded nos componentes
- [ ] Dark mode funciona em todas as telas sem valores hardcoded
- [ ] Escala tipográfica respeitada — nenhum `font-size` fora dos tokens
- [ ] Espaçamento segue a grade de 4px — nenhum valor arbitrário
- [ ] Border-radius consistente com os tokens definidos

### Autenticação

- [ ] Erros de campo aparecem inline abaixo do input (não só toast)
- [ ] Botão de submit desabilitado durante loading
- [ ] Rate limit (429) exibe mensagem específica com countdown
- [ ] Toggle de mostrar/ocultar senha funciona
- [ ] Foco vai automaticamente para o primeiro campo ao abrir a tela

### Lista de tickets

- [ ] Skeleton visível durante carregamento inicial
- [ ] Estado vazio com ação primária quando sem resultados
- [ ] Filtros preservados ao navegar e voltar da tela de detalhe
- [ ] Dados anteriores visíveis durante troca de página (sem flash branco)
- [ ] Contagem de resultados atualiza com os filtros

### Detalhe do ticket

- [ ] Status só mostra transições válidas no dropdown
- [ ] Ticket `closed` tem select desabilitado com tooltip explicativo
- [ ] Ações condicionais por role são corretas em todos os cenários
- [ ] Confirmação antes de mudar status
- [ ] Breadcrumb funciona e preserva filtros da listagem

### Comentários

- [ ] Ações editar/excluir aparecem apenas para autor e admin
- [ ] Edição inline funciona com Esc para cancelar e Ctrl+Enter para salvar
- [ ] Dialog de confirmação antes de excluir
- [ ] Scroll automático para novo comentário após publicar

### Acessibilidade

- [ ] Todos os elementos interativos acessíveis via teclado
- [ ] Indicador de foco visível em todos os elementos focáveis
- [ ] Atributos ARIA corretos em modais, toasts, status badges
- [ ] Contraste mínimo 4.5:1 para texto normal
- [ ] Animações respeitam `prefers-reduced-motion`

### Responsividade

- [ ] Layout funcional em 320px de largura (mobile mínimo)
- [ ] Sidebar vira drawer em mobile com hambúrguer
- [ ] Touch targets mínimo 44×44px em mobile
- [ ] Formulários utilizáveis em teclado virtual mobile

### Performance percebida

- [ ] Skeleton screens em vez de spinners nas listas
- [ ] Dados da lista aparecem em menos de 300ms após navegação (cache hit)
- [ ] Nenhuma tela em branco durante transições de rota
- [ ] Loading states localizados — não bloquear a página inteira

---

## Referências e recursos

### Ferramentas de design
- [Figma](https://figma.com) — prototipagem e handoff
- [Radix Colors](https://www.radix-ui.com/colors) — sistema de cores com dark mode automático
- [shadcn/ui](https://ui.shadcn.com) — componentes base
- [Lucide Icons](https://lucide.dev) — biblioteca de ícones

### Referências de UI para dashboards internos
- [Linear](https://linear.app) — referência de clareza e velocidade
- [Plane](https://plane.so) — open source, similar ao TicketForge
- [GitHub Issues](https://github.com) — padrão de listagem e detalhe

### Guidelines de acessibilidade
- [WCAG 2.1 AA](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)

### Tipografia
- [Inter Font](https://rsms.me/inter/)
- [Tailwind Typography Scale](https://tailwindcss.com/docs/font-size)