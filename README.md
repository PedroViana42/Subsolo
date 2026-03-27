<div align="center">
  <img src="./frontend/src/assets/logo.png" alt="Subsolo Logo" width="400" />
  <h3><i>Anonimato Conectado. Onde o campus se encontra nas sombras.</i></h3>
</div>

---

## O que é o Subsolo?

O **Subsolo** é uma rede social universitária anônima para confissões, fofocas e utilidade pública dentro do campus. O diferencial é o sistema de **Identidades Temporais** — cada usuário recebe um apelido único que expira em 48h, impedindo rastreamento histórico de longo prazo.

## Funcionalidades

| Feature | Status |
|---|---|
| 🎭 Identidade Temporal (Nick 48h) | ✅ Implementado |
| 🔐 Cadastro e Login com JWT | ✅ Implementado |
| ✅ Sistema Fato/Fic | 🚧 Em Desenvolvimento |
| 😇 Honesty Score | 🚧 Em Desenvolvimento |
| 🍱 Fiscal do RU | 🚧 Em Desenvolvimento |
| 📅 Agenda do Campus | 🚧 Em Desenvolvimento |

## Stack

- **Frontend**: React 19 + Vite 6 + Tailwind CSS 4
- **Backend**: Express 4 + Node.js 22 + TypeScript
- **Banco**: PostgreSQL 17 + Prisma 7 ORM
- **Auth**: JWT (stateless, 48h) + bcryptjs
- **Infra**: Docker + Docker Compose

## Rodando com Docker

### Pré-requisitos
- Docker e Docker Compose instalados

### 1. Configure as variáveis de ambiente

Copie o `.env.example` e preencha com seus valores:

```bash
cp .env.example .env
```

**Importante**: gere um `JWT_SECRET` forte antes de subir:
```bash
# Linux/Mac
openssl rand -hex 32

# Ou use qualquer gerador de string aleatória
```

### 2. Suba os serviços

```bash
docker compose up --build
```

Na primeira vez o `--build` é obrigatório. Nas próximas, basta `docker compose up`.

### 3. Popule o catálogo de nicks (apenas na primeira vez)

```bash
docker compose exec backend npm run prisma:seed
```

### Serviços disponíveis

| Serviço | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:3001 |
| Swagger UI | http://localhost:3001/docs |
| Prisma Studio | http://localhost:5555 |
| PostgreSQL | localhost:5434 |

## Comandos úteis

```bash
# Parar tudo (mantém dados)
docker compose down

# Parar e apagar banco (reset completo)
docker compose down -v

# Ver logs do backend
docker compose logs -f backend

# Acessar o banco diretamente
docker compose exec db psql -U user -d subsolo

# Rodar seed novamente (idempotente)
docker compose exec backend npm run prisma:seed

# Abrir Prisma Studio
docker compose up prisma-studio
```

## Arquitetura de Autenticação

O sistema usa **identidades temporárias** desvinculadas da conta real:

- O usuário se cadastra com e-mail + senha (hash bcrypt)
- No login, o backend sorteia um Nick do `NickCatalogue` e o vincula ao usuário por 48h
- O JWT contém `userId` (interno) e `nickId` (usado em posts/votos/comentários)
- Quando o nick expira, um novo é sorteado automaticamente no próximo login
- O nick anterior é reativado no catálogo e pode ser atribuído a outro usuário

Veja `backend/AUTH_CONTEXT.md` para a documentação técnica completa.

---

*Desenvolvido com foco em privacidade, segurança e experiência universitária.*
