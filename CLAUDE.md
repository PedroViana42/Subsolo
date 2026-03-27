# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Subsolo** is an anonymous university social network ("Where the campus meets in the shadows"). Users get temporary identities (nicknames) that expire every 48 hours, enabling anonymous posting with community-driven fact/fiction validation.

## Development Commands

### Docker (primary dev workflow)
```bash
docker compose up --build      # First run or after adding dependencies
docker compose up              # Subsequent runs
docker compose down            # Stop (keeps data)
docker compose down -v         # Stop and reset database
docker compose logs -f backend # Follow backend logs
```

### First-time setup
```bash
cp .env.example .env           # Configure env vars (JWT_SECRET is mandatory)
docker compose up --build
docker compose exec backend npm run prisma:seed   # Populate NickCatalogue (run once)
```

### Local Development (without Docker)
```bash
npm install                              # Install all workspace dependencies
npm run dev:frontend                     # Start frontend (port 3000)
npm run dev:backend                      # Start backend (port 3001)
```

### Backend
```bash
npm run dev --workspace=backend          # Start with tsx watch (auto-reload)
npm run build --workspace=backend        # Compile TypeScript
npm run prisma:generate --workspace=backend   # Regenerate Prisma client after schema changes
npm run prisma:studio --workspace=backend     # Open Prisma Studio (port 5555)
npm run prisma:seed --workspace=backend       # Populate NickCatalogue
```

### Frontend
```bash
npm run dev --workspace=frontend         # Start Vite dev server (port 3000)
npm run build --workspace=frontend       # Production build
npm run lint --workspace=frontend        # TypeScript type-check (tsc --noEmit)
```

## Services & Ports

| Service        | URL                       |
|----------------|---------------------------|
| Frontend       | http://localhost:3000      |
| Backend API    | http://localhost:3001      |
| Swagger UI     | http://localhost:3001/docs |
| Prisma Studio  | http://localhost:5555      |
| PostgreSQL     | localhost:5434             |

## Environment Setup

Copy `.env.example` to `.env`. Key variables:
- `DATABASE_URL` — `db:5432` inside Docker, `localhost:5434` outside
- `JWT_SECRET` — **obrigatório**, gere com `openssl rand -hex 32`
- `FRONTEND_URL` — origem permitida pelo CORS do backend
- `VITE_API_URL` — URL do backend consumida pelo frontend

## Architecture

### Monorepo Structure
npm workspaces with `frontend/` and `backend/` packages. The root `package.json` only contains workspace scripts.

### Backend (`backend/`)
```
src/
  index.ts          — Express server, CORS, rate limiting, global error handler
  routes/auth.ts    — POST /auth/register, POST /auth/login
  services/nick.ts  — Nick assignment logic (atomic transaction)
  middleware/auth.ts — JWT validation, attaches req.user = { userId, nickId }
  lib/
    prisma.ts       — PrismaClient singleton (with PrismaPg adapter)
    swagger.ts      — OpenAPI 3.0 spec
prisma/
  schema.prisma     — Database schema
  seed.ts           — Populates NickCatalogue with 40 university nicknames
```

- **Runtime**: `tsx watch` (ES Modules, no compilation step in dev)
- **Auth**: JWT stateless, 48h expiry matching nick TTL
- **Password hashing**: bcryptjs, cost factor 12
- **Prisma 7**: requires `PrismaPg` adapter in `PrismaClient` constructor; `prisma.config.ts` handles CLI only

### Frontend (`frontend/`)
```
src/
  App.tsx              — Root component, auth state machine (login → mask → app)
  services/auth.ts     — fetch wrappers for /auth/register and /auth/login
  components/
    LoginScreen.tsx    — Login + register form (toggle with "Criar conta" link)
    MaskGenerationScreen.tsx — Shows nick assigned by backend
    Header.tsx         — Logo + logout button
    ...                — Feed, PostForm, sidebars (still using mock data)
```

- **Auth state**: `'login' | 'mask' | 'app'` in App.tsx
- **Token storage**: `localStorage` under key `subsolo_token`
- **Path alias**: `@/*` maps to `src/`

### Data Model (Prisma)
- **User** — Persistent account (email + passwordHash)
- **Nick** — Temporary identity, `expiresAt = now + 48h`, linked to `NickCatalogue` via `catalogueId`
- **NickCatalogue** — Pool of 40 pre-seeded names; `isActive=false` means in use by an active nick
- **Post / Vote / Comment** — All linked to `nickId`, never to `userId`

### Anonymity & Nick Assignment
1. On login, check for an active nick (`expiresAt > now`) → reuse it
2. Otherwise run `assignNick()` inside a **Prisma transaction**:
   - Reactivate catalogue entries whose nicks have expired (lazy reactivation)
   - Pick a random entry (using `crypto.randomInt`, not `Math.random`)
   - Atomically mark it `isActive=false` — if already taken, transaction fails gracefully
   - Create new Nick with 48h TTL
3. Sign JWT with `{ userId, nickId }`, expiry 48h

### Security Decisions
- **Timing attack prevention**: login always runs `bcrypt.compare` even if user doesn't exist (uses dummy hash)
- **Race condition prevention**: nick assignment wrapped in `prisma.$transaction`
- **JWT payload validation**: middleware validates `userId` and `nickId` are strings before trusting
- **No default JWT_SECRET**: docker-compose uses `${JWT_SECRET:?...}` — fails fast if not set
- **Global error handler**: prevents unhandled async throws from leaking stack traces to client
- **Rate limiting**: login 10 req/15min, register 5 req/1h per IP

### Minha responsabilidade neste projeto

Para o seu amigo conseguir sentar e codar a parte de segurança (e entender o contexto do Subsolo), ele precisa enxergar o projeto não como um "site de fofoca", mas como um sistema de gerenciamento de identidades temporárias.
Aqui está um guia "mastigado" que você pode copiar e mandar para ele. Ele cobre a arquitetura, o fluxo de dados e os pontos críticos de segurança do projeto:
🛠️ O Projeto: Subsolo
O que é: Uma plataforma de confissões e utilidade universitária onde o anonimato é a regra, mas a responsabilidade é controlada pelo backend.
1. A Arquitetura (O que ele vai tocar)
 * Backend: Node.js com Fastify (Framework rápido e focado em performance).
 * Banco de Dados: PostgreSQL com Prisma ORM (Modelagem de dados).
 * Frontend: Next.js (Consome a API que ele vai proteger).
 * Conceito Chave: O usuário loga com e-mail, mas o sistema gera um Nick de 48h (Ex: Capivara Cansada). Ninguém vê o e-mail de ninguém, só o Nick.
2. O Fluxo de Login (Onde a Segurança entra)
Passa esse passo a passo para ele implementar:
 * Registro/Login: O usuário envia E-mail e Senha.
 * Hashing: Ele deve usar a lib bcrypt ou argon2. Regra de Ouro: Nunca salve a senha real. Salve o hash.
 * Geração de Token (JWT): Se a senha bater, o backend gera um JWT (JSON Web Token).
   * O Token deve conter o userId.
   * O Token deve ser assinado com uma SECRET_KEY (que fica só no .env do servidor).
 * Middleware de Proteção: Ele vai criar uma função no Fastify que verifica se o Token é válido antes de deixar alguém postar ou votar. Se não tiver token ou for inválido, retorna 401 Unauthorized.
3. O Desafio Técnico: Anonimato vs. Identificação
Explica para ele que o maior desafio de segurança aqui é o vínculo de dados:
 * No Banco de Dados, o Post está ligado ao User.
 * Na API (Frontend), a gente nunca envia o userId ou o email.
 * Ele precisa garantir que, ao buscar os posts, o backend faça o "de-para": troca o ID real pelo Nick Temporal ativo daquele usuário.
4. Checklist de Segurança para ele focar:
 * [ ] Rate Limiting: Impedir que alguém tente 1.000 senhas por minuto (Brute Force).
 * [ ] Input Validation: Usar o zod ou ajv no Fastify para garantir que ninguém envie um código malicioso no lugar do e-mail (XSS/Injection).
 * [ ] JWT Expiration: O token não pode ser eterno. Se o cara logar num PC da faculdade e esquecer aberto, o token tem que expirar.
 * [ ] CORS: Configurar para que apenas o seu domínio do frontend consiga conversar com a API.
5. Sugestão de "Primeiro Passo" para ele:
Peça para ele instalar o Fastify e tentar criar uma rota /register que receba um JSON, faça o hash da senha e mostre no console. Depois, a rota /login que devolve um JWT.
