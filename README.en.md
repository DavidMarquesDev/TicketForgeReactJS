# TicketForge ReactJS

🇺🇸 English | [🇧🇷 Português](./README.pt-BR.md)

TicketForge frontend built with **React + TypeScript**, responsible for consuming the **NestJS** API for authentication, ticket management, and comments.

## Overview

The project implements a web application with:

- JWT authentication with session control;
- protected routes by authentication and user role;
- full ticket flow (create, list, detail, assign, and status update);
- full per-ticket comment flow (create, list, edit, and delete);
- consistent API error handling;
- responsive layout with topbar, sidebar, and content area.

## Technologies and libraries

### Runtime

- `react` `^19.1.1`
- `react-dom` `^19.1.1`
- `react-router-dom` `^7.8.2`

### Build, typing, and quality

- `vite` `^7.1.2`
- `typescript` `~5.8.3`
- `@vitejs/plugin-react` `^5.0.0`
- `eslint` `^9.34.0`
- `typescript-eslint` `^8.41.0`
- `eslint-plugin-react-hooks` `^5.2.0`
- `eslint-plugin-react-refresh` `^0.4.20`

## Requirements

- Node.js 20+ (recommended)
- npm 10+ (recommended)
- TicketForge API (NestJS) available

## How to run

### 1) Install dependencies

```bash
npm install
```

### 2) Configure API URL

By default, the frontend uses:

- `http://localhost:3000/api/v1`

If needed, create a `.env` file at the project root with:

```bash
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

### 3) Run in development mode

```bash
npm run dev
```

The app will be available at the URL shown by Vite (usually `http://localhost:5173`).

## Available scripts

- `npm run dev`: starts the development server
- `npm run build`: runs build typecheck (`tsc -b`) and generates production bundle
- `npm run preview`: serves the local production build
- `npm run lint`: validates standards with ESLint
- `npm run typecheck`: validates TypeScript types without building

## NestJS API integration

- Base prefix: `/api/v1`
- Expected local URL: `http://localhost:3000/api/v1`
- Swagger: `http://localhost:3000/docs/api`
- ReDoc: `http://localhost:3000/docs/redoc`

### Consumed endpoints

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

## Business rules reflected in frontend

- allowed status transition: `open -> in_progress -> resolved -> closed`;
- assignment action available for `support` and `admin`;
- comment edit/delete available for author or `admin`;
- HTTP error mapping for UX:
  - `400` validation;
  - `401` invalid/expired session;
  - `403` forbidden;
  - `404` resource not found;
  - `409` business conflict;
  - `429` rate limit reached.

## Project structure

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

### Module pattern

- `domain`: domain types and contracts
- `application`: use-case services
- `infrastructure`: HTTP repository implementations
- `presentation`: pages, components, and React context

## Important technical behaviors

- JWT token stored in `sessionStorage`;
- automatic token forwarding in authenticated requests;
- automatic logout on `401` responses;
- session bootstrap with `/auth/me` to keep user logged in;
- support for both API success formats (`data` envelope and direct `success` response).

## Current status

Project has a functional base for authentication, tickets, and comments, including a responsive main layout and readiness for module evolution.
