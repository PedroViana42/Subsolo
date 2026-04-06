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
FROM node:22-alpine AS runner # nosemgrep: use-distroless-base-image — node:alpine é necessário para shell+npx (entrypoint.sh)

# Definimos o diretório direto no backend para facilitar a vida do Node/Prisma
WORKDIR /app/backend

# Copia as dependências da raiz (respeitando a estrutura do monorepo)
COPY --from=builder --chown=node:node /app/node_modules ../node_modules
COPY --from=builder --chown=node:node /app/package.json ../package.json

# Copia o backend compilado e arquivos vitais de infra
COPY --from=builder --chown=node:node /app/backend/dist ./dist
COPY --from=builder --chown=node:node /app/backend/package.json ./package.json
COPY --from=builder --chown=node:node /app/backend/prisma ./prisma
COPY --from=builder --chown=node:node /app/backend/prisma.config.ts ./prisma.config.ts

# Copia o entrypoint e torna executável como root antes de trocar de usuário
COPY backend/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENV NODE_ENV=production

# Executa como usuário não-root (node UID 1000, pré-criado na imagem node:alpine)
USER node

EXPOSE 10000

ENTRYPOINT ["/entrypoint.sh"]
