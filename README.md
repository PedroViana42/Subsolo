<div align="center">
  <img src="./src/assets/logo.png" alt="Subsolo Logo" width="400" />
  <h3><i>Anonimato Conectado.</i></h3>
</div>

---

## 🕳️ O que é o Subsolo?
O **Subsolo** é uma rede social anônima projetada para integrar a comunidade através de confissões, fofocas e utilidade pública, sem o peso da identidade real.

Utilizando o conceito de **Identidades Temporais**, o Subsolo garante que a privacidade venha em primeiro lugar, permitindo que a voz da comunidade seja ouvida sem julgamentos persistentes.

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

## 📦 Como Rodar Localmente

1. **Instale as dependências** (na raiz do projeto):
   ```bash
   npm install
   ```
2. **Configuração**:
   Crie um arquivo `.env` na pasta desejada (`frontend` ou `backend`) baseado nos exemplos (se disponíveis).
3. **Inicie o Ambiente**:

   **Para o Frontend:**
   ```bash
   npm run dev:frontend
   ```

   **Para o Backend:**
   ```bash
   npm run dev:backend
   ```

---
