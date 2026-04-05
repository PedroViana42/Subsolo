# Estágio 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

# Copia os arquivos de definição de pacotes do root para gerenciar workspaces
COPY package.json package-lock.json ./
COPY backend/package.json ./backend/

# Instala TODAS as dependências (incluindo devDependencies para o build)
RUN npm install -w backend

# Copia o código fonte do backend e o schema do Prisma
COPY backend ./backend

WORKDIR /app/backend

# Gera o Prisma Client
RUN npx prisma generate

# Transpila o TypeScript para JavaScript (dist/)
RUN npm run build

# Estágio 2: Runner (Produção)
FROM node:22-alpine AS runner

WORKDIR /app/backend

# Copia apenas o necessário do estágio de build
COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/backend/node_modules ./node_modules
COPY --from=builder /app/backend/package.json ./package.json

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

# Comando para rodar em produção
CMD ["npm", "start"]
