# Estágio 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

# Copia arquivos de definição do root
COPY package.json package-lock.json ./
COPY backend/package.json ./backend/

# Instala todas as dependências na raiz (Workspaces)
RUN npm install -w backend

# Copia o código do backend e gera o client
COPY backend ./backend
WORKDIR /app/backend
RUN npx prisma generate
RUN npm run build

# Estágio 2: Runner
FROM node:22-alpine AS runner

WORKDIR /app

# Copia as dependências da raiz (onde estão as libs do monorepo)
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Copia o backend compilado e o schema (necessário para migrações)
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/backend/package.json ./backend/package.json
COPY --from=builder /app/backend/prisma ./backend/prisma

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

# Comando final: Migra o banco e inicia o servidor
CMD npx prisma migrate deploy --schema backend/prisma/schema.prisma && npm start -w backend
