# Estágio 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

# Em monorepos/workspaces, precisamos do arquivo de lock e do package.json da raiz
COPY package.json package-lock.json ./
COPY backend/package.json ./backend/

# Instala todas as dependências (necessário para o build do TS e Prisma)
RUN npm install

# Copia o código fonte e as configurações do Prisma
COPY backend ./backend

WORKDIR /app/backend

# Gera o Prisma Client (ele vai para a pasta node_modules na raiz do projeto)
RUN npx prisma generate

# Executa o build do TypeScript
RUN npm run build

# Estágio 2: Runner (Produção)
FROM node:22-alpine AS runner

WORKDIR /app

# No modo workspace, precisamos dos arquivos de definição na raiz
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/backend/package.json ./backend/
COPY --from=builder /app/backend/dist ./backend/dist

# Copiamos TODOS os node_modules para garantir que o @prisma/client e as extensões funcionem
COPY --from=builder /app/node_modules ./node_modules

WORKDIR /app/backend

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

# Comando para rodar em produção
CMD ["npm", "start"]
