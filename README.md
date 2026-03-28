# TicketForgeReactJS

Frontend do **TicketForge** desenvolvido em **React + TypeScript**, responsável por consumir a API em **NestJS** para autenticação, gestão de tickets e comentários.

## Visão geral

O projeto implementa uma aplicação web com:

- autenticação JWT com controle de sessão;
- rotas protegidas por autenticação e papel de usuário;
- fluxo completo de tickets (criação, listagem, detalhe, atribuição e alteração de status);
- fluxo completo de comentários por ticket (criar, listar, editar e excluir);
- tratamento consistente de erros da API;
- layout responsivo com topbar, sidebar e área de conteúdo.

## Tecnologias e bibliotecas

### Runtime

- `react` `^19.1.1`
- `react-dom` `^19.1.1`
- `react-router-dom` `^7.8.2`

### Build, tipagem e qualidade

- `vite` `^7.1.2`
- `typescript` `~5.8.3`
- `@vitejs/plugin-react` `^5.0.0`
- `eslint` `^9.34.0`
- `typescript-eslint` `^8.41.0`
- `eslint-plugin-react-hooks` `^5.2.0`
- `eslint-plugin-react-refresh` `^0.4.20`

## Requisitos

- Node.js 20+ (recomendado)
- npm 10+ (recomendado)
- API TicketForge (NestJS) disponível

## Como rodar o projeto

### 1) Instalar dependências

```bash
npm install
```

### 2) Configurar URL da API

Por padrão o frontend usa:

- `http://localhost:3000/api/v1`

Se precisar mudar, crie um arquivo `.env` na raiz com:

```bash
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

### 3) Executar em desenvolvimento

```bash
npm run dev
```

A aplicação ficará disponível na URL exibida pelo Vite (normalmente `http://localhost:5173`).

## Scripts disponíveis

- `npm run dev`: inicia o servidor de desenvolvimento
- `npm run build`: executa typecheck de build (`tsc -b`) e gera o bundle de produção
- `npm run preview`: sobe a versão buildada localmente
- `npm run lint`: valida padrões com ESLint
- `npm run typecheck`: valida tipos TypeScript sem gerar build

## Integração com a API NestJS

- Prefixo base: `/api/v1`
- URL local esperada: `http://localhost:3000/api/v1`
- Swagger: `http://localhost:3000/docs/api`
- ReDoc: `http://localhost:3000/docs/redoc`

### Endpoints consumidos

#### Auth

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`

#### Tickets

- `POST /tickets`
- `GET /tickets`
- `GET /tickets/:id`
- `PATCH /tickets/:id/status`
- `PATCH /tickets/:id/assign`

#### Comments

- `POST /tickets/:ticketId/comments`
- `GET /tickets/:ticketId/comments`
- `PATCH /tickets/:ticketId/comments/:id`
- `DELETE /tickets/:ticketId/comments/:id`

## Regras de negócio refletidas no frontend

- transição de status permitida: `open -> in_progress -> resolved -> closed`;
- ação de atribuição liberada para `support` e `admin`;
- edição e exclusão de comentário liberadas para autor ou `admin`;
- mapeamento de erros HTTP para UX:
  - `400` validação;
  - `401` sessão inválida/expirada;
  - `403` sem permissão;
  - `404` recurso não encontrado;
  - `409` conflito de regra;
  - `429` limite de tentativas.

## Estrutura do projeto

```text
src/
  core/
    auth/
    config/
    http/
    router/
    utils/
  modules/
    auth/
      application/
      domain/
      infrastructure/
      presentation/
    tickets/
      application/
      domain/
      infrastructure/
      presentation/
    comments/
      application/
      domain/
      infrastructure/
      presentation/
  shared/
  styles/
```

### Padrão adotado por módulo

- `domain`: tipos e contratos de domínio
- `application`: serviços de caso de uso
- `infrastructure`: implementação de repositórios HTTP
- `presentation`: páginas, componentes e contexto React

## Comportamentos técnicos importantes

- token JWT armazenado em `sessionStorage`;
- envio automático de token nas requisições autenticadas;
- logout automático em respostas `401`;
- bootstrap de sessão com `/auth/me` para manter usuário logado;
- suporte aos dois formatos de sucesso da API (`data` envelopado e retorno direto com `success`).

## Status atual

Projeto com base funcional de autenticação, tickets e comentários, incluindo layout principal responsivo e pronto para evolução dos módulos.
