# Estágio 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

<<<<<<< HEAD
# Em monorepos/workspaces, precisamos do arquivo de lock e do package.json da raiz
COPY package.json package-lock.json ./
COPY backend/package.json ./backend/

# Instala todas as dependências (necessário para o build do TS e Prisma)
RUN npm install

# Copia o código fonte e as configurações do Prisma
=======
# Copia arquivos de definição do root
COPY package.json package-lock.json ./
COPY backend/package.json ./backend/

# Instala todas as dependências na raiz (Workspaces)
RUN npm install -w backend

# Copia o código do backend e gera o client
>>>>>>> dev
COPY backend ./backend
WORKDIR /app/backend
<<<<<<< HEAD

# Gera o Prisma Client (ele vai para a pasta node_modules na raiz do projeto)
RUN npx prisma generate

# Executa o build do TypeScript
=======
RUN npx prisma generate
>>>>>>> dev
RUN npm run build

# Estágio 2: Runner
FROM node:22-alpine AS runner

WORKDIR /app

<<<<<<< HEAD
# No modo workspace, precisamos dos arquivos de definição na raiz
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/backend/package.json ./backend/
COPY --from=builder /app/backend/dist ./backend/dist

# Copiamos TODOS os node_modules para garantir que o @prisma/client e as extensões funcionem
COPY --from=builder /app/node_modules ./node_modules

WORKDIR /app/backend
=======
# Copia as dependências da raiz (onde estão as libs do monorepo)
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Copia o backend compilado e o schema (necessário para migrações)
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/backend/package.json ./backend/package.json
COPY --from=builder /app/backend/prisma ./backend/prisma
>>>>>>> dev

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

# Comando final: Migra o banco e inicia o servidor
CMD npx prisma migrate deploy && npm start -w backend
