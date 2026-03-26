FROM node:22-alpine

WORKDIR /app

# Copy package files from root to use workspaces
COPY package.json package-lock.json ./
COPY frontend/package.json ./frontend/

# Install dependencies (only for frontend workspace)
RUN npm install -w frontend

# Copy frontend source
COPY frontend ./frontend

WORKDIR /app/frontend

EXPOSE 3000

CMD ["npm", "run", "dev"]
