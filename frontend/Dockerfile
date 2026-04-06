# Estágio 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files from root to use workspaces
COPY package.json package-lock.json ./
COPY frontend/package.json ./frontend/

# Install dependencies (only for frontend workspace)
RUN npm install -w frontend

# Copy frontend source and build
COPY frontend ./frontend

WORKDIR /app/frontend

RUN npm run build

# Estágio 2: Runner (nginx serve static files — sem Node.js, npm ou shell na imagem final)
FROM nginx:1.27-alpine AS runner # nosemgrep: use-distroless-base-image — nginx:alpine é necessário para servir arquivos estáticos

# Remove config padrão do nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copia config customizada
COPY frontend/nginx.conf /etc/nginx/conf.d/app.conf

# Copia os arquivos estáticos buildados
COPY --from=builder /app/frontend/dist /usr/share/nginx/html

# nginx:alpine já roda como root para bind na porta 80, mas suporta usuário não-root
# em portas > 1024. Usamos porta 3000 para manter compatibilidade.
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown nginx:nginx /var/run/nginx.pid

USER nginx

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
