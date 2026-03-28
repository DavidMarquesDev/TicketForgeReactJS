# TicketForgeReactJS

Aplicação frontend em React para o ecossistema TicketForge, responsável por consumir a API em NestJS e oferecer a interface de autenticação, gestão de tickets e comentários.

## Objetivo do projeto

Este projeto implementa o cliente web do TicketForge com foco em:

- autenticação JWT;
- gestão completa de tickets (criar, listar, detalhar, atribuir e atualizar status);
- gestão de comentários por ticket;
- tratamento padronizado de erros e paginação server-side;
- experiência orientada a papéis (`admin`, `support`, `user`).

## Integração com a API NestJS

- Prefixo base: `/api/v1`
- Base URL local esperada: `http://localhost:3000/api/v1`
- Documentação da API:
  - Swagger: `http://localhost:3000/docs/api`
  - ReDoc: `http://localhost:3000/docs/redoc`

### Endpoints principais consumidos

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

## Regras de negócio que impactam o frontend

- transições válidas de status: `open -> in_progress -> resolved -> closed`;
- ação de atribuir ticket disponível para `support` e `admin`;
- edição/exclusão de comentário permitida para autor do comentário ou `admin`;
- tratamento de erros por status:
  - `400`: validação;
  - `401`: sessão inválida/expirada;
  - `403`: sem permissão;
  - `404`: recurso não encontrado;
  - `409`: conflito de regra de negócio;
  - `429`: limite de tentativas.

## Diretrizes técnicas de frontend

- enviar token JWT em `Authorization: Bearer <token>`;
- validar sessão no bootstrap com `GET /auth/me`;
- aplicar paginação server-side em tickets e comentários;
- suportar os dois formatos de sucesso da API (`data` e retorno direto com `success`);
- capturar `trace_id` e `x-request-id` para suporte em incidentes.

## Status

Repositório inicializado para receber a implementação do frontend React do TicketForge.
