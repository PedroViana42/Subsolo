<div align="center">
  <img src="./src/assets/logo.png" alt="Subsolo Logo" width="400" />
  <h3><i>Anonimato Conectado. Onde o campus se encontra nas sombras.</i></h3>
</div>

---

## 🕳️ O que é o Subsolo?
O **Subsolo** é uma rede social universitária anônima projetada para integrar a comunidade acadêmica através de confissões, fofocas e utilidade pública, sem o peso da identidade real.

Utilizando o conceito de **Identidades Temporais**, o Subsolo garante que a privacidade venha em primeiro lugar, permitindo que a voz do campus seja ouvida sem julgamentos persistentes.

## 🚀 Principais Funcionalidades

- **🎭 Identidade Temporal (48h)** (Em Desenvolvimento 🚧): Sua máscara no Subsolo (Nick) expira e se renova a cada 48 horas, evitando rastreamento histórico de longo prazo.
- **✅ Sistema Fato/Fic** (Em Desenvolvimento 🚧): A comunidade valida a veracidade das postagens. "Real Oficial" vs "Pura Fic" decidem sua reputação na rede.
- **😇 Honesty Score** (Em Desenvolvimento 🚧): Uma aura visual que acompanha seu Nick, baseada no seu histórico de veracidade nas últimas sessões.
- **🍱 O Fiscal do RU** (Em Desenvolvimento 🚧): Menu diário do Restaurante Universitário com votação em tempo real sobre a qualidade da comida.
- **📅 Agenda do Campus** (Em Desenvolvimento 🚧): Widgets dinâmicos com os próximos eventos, festas e avisos acadêmicos.

## 🛠️ Stack Tecnológica

- **Frontend**: Vite + React + Tailwind CSS (Localizado em `/frontend`)
- **Backend API**: Express (Node.js) + Prisma ORM (Localizado em `/backend`)
- **Banco de Dados**: PostgreSQL + Prisma ORM
- **Infra**: Docker + Docker Compose

## 📦 Como Rodar com Docker

### Pré-requisitos
- Docker e Docker Compose instalados

### Passos para Execução

1. **Configuração de Variáveis de Ambiente** (opcional):
   Crie um arquivo `.env` na raiz do projeto com as variáveis necessárias:
   ```env
   POSTGRES_USER=user
   POSTGRES_PASSWORD=password
   POSTGRES_DB=subsolo
   DATABASE_URL=postgresql://user:password@db:5432/subsolo?schema=public
   JWT_SECRET=seu_secret_aqui
   ```

2. **Inicie todos os serviços**:
   ```bash
   docker-compose up
   ```

3. **Acesso aos serviços**:
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:3001
   - **Prisma Studio**: http://localhost:5555
   - **Banco de Dados**: postgresql://user:password@localhost:5434/subsolo

### Seviços Inclusos
- **Frontend**: React + Vite (Auto-reload habilitado)
- **Backend API**: Express + Prisma ORM (Auto-reload habilitado)
- **PostgreSQL**: Banco de dados relacional
- **Prisma Studio**: IDE visual para o banco de dados

### Comandos Úteis

```bash
# Reconstruir imagens
docker-compose build

# Parar os serviços
docker-compose down

# Ver logs em tempo real
docker-compose logs -f

# Executar migrations do Prisma
docker-compose exec backend npx prisma migrate deploy

# Acessar o PostgreSQL diretamente
docker-compose exec db psql -U user -d subsolo
```

---

*Desenvolvido com foco em segurança, escalabilidade e na melhor experiência universitária.*
