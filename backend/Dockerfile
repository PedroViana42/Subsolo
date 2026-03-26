FROM node:22-alpine

WORKDIR /app

# Copy package files from root to use workspaces
COPY package.json package-lock.json ./
COPY backend/package.json ./backend/

# Install dependencies (only for backend workspace)
RUN npm install -w backend

# Copy backend source
COPY backend ./backend

WORKDIR /app/backend

# Generate Prisma client if schema exists
RUN if [ -f ./prisma/schema.prisma ]; then npx prisma generate; fi

EXPOSE 3001

CMD ["npm", "run", "dev"]
