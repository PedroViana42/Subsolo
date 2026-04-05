# Estágio 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

# Copia arquivos de definição do root
COPY package.json package-lock.json ./
COPY backend/package.json ./backend/

# Instala todas as dependências na raiz (Workspaces)
RUN npm install -w backend

# Copia tudo para o build
COPY . .
WORKDIR /app/backend
RUN npx prisma generate
RUN npm run build

# Estágio 2: Runner
FROM node:22-alpine AS runner

# Definimos o diretório direto no backend para facilitar a vida do Node/Prisma
WORKDIR /app/backend

# Copia as dependências da raiz (respeitando a estrutura do monorepo)
COPY --from=builder /app/node_modules ../node_modules
COPY --from=builder /app/package.json ../package.json

# Copia o backend compilado e arquivos vitais de infra
COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/backend/package.json ./package.json
COPY --from=builder /app/backend/prisma ./prisma
COPY --from=builder /app/backend/prisma.config.ts ./prisma.config.ts

ENV NODE_ENV=production

EXPOSE 10000

# Comando final: Com logs para sabermos onde trava
CMD echo "🚀 Iniciando Migrações..." && \
    npx prisma migrate deploy && \
    echo "✅ Migrações concluídas!" && \
    echo "📦 Iniciando Servidor..." && \
    npm start
