# ✅ Checklist de Implementação - Subsolo

Este documento serve para o rastreio granular de tarefas e atribuição de responsabilidades. Cada tarefa deve conter o nome de quem a executou para fins de histórico e transparência.

---

## 🏗️ 1. Core & Arquitetura

*Regras de negócio, base de dados e lógica central.*

| Tarefa                                     | Responsável | Status        | Data       |
| :----------------------------------------- | :----------- | :------------ | :--------- |
| Definição de Schema Prisma               | Pedro        | ✅ Concluído | -          |
| Lógica de Rotação de Identidade (48h)   | Pedro        | ✅ Concluído | -          |
| Sistema de Fato-Fic (Mock Inicial)         | Pedro        | ✅ Concluído | -          |
| Persistência de Sessão (Auto-login)      | Alexandre    | ✅ Concluído | 30/03/2026 |
| Lógica de Exibição de Identidade (Mask) | Alexandre    | ✅ Concluído | 30/03/2026 |
| Auditoria de Expiração (48h/Sincronia)   | Alexandre    | ✅ Concluído | 30/03/2026 |
| Lógica de Votos (Fato/Fic) Real           | Pedro        | ✅ Concluído | 02/04/2026 |
| Filtro Global de Busca                     | Pedro        | ✅ Concluído | 04/04/2026 |

---

## 🎨 2. Frontend & UI/UX

*Interface, componentes e experiência do usuário.*

| Tarefa                                        | Responsável   | Status        | Data       |
| :-------------------------------------------- | :------------- | :------------ | :--------- |
| Refatoração para Bento Grid (Aesthetic)     | Antigravity AI | ✅ Concluído | 28/03/2026 |
| Consolidação de Identidade na Barra Lateral | Antigravity AI | ✅ Concluído | 28/03/2026 |
| Ampliação de Input de Texto (Foco)          | Antigravity AI | ✅ Concluído | 28/03/2026 |
| Design de Micro-animações (PostForm)        | Antigravity AI | ✅ Concluído | 28/03/2026 |
| Responsividade Mobile-First                   | Antigravity AI | ✅ Concluído | 04/04/2026 |
| Notificações Real-time (Sockets)            | [A DEFINIR]    | ⏳ Pendente   | -          |
| Galeria de Relíquias (Mural de Relíquias)   | Pedro          | ✅ Concluído | 04/04/2026 |
| Otimização de Feed (Anti-Flickering)        | Pedro          | ✅ Concluído | 04/04/2026 |

---

## 🛡️ 3. Segurança & Anonimato

*Proteção de dados e camadas de privacidade.*

| Tarefa                                  | Responsável   | Status        | Data       |
| :-------------------------------------- | :------------- | :------------ | :--------- |
| Setup de JWT & Auth Flow                | Alexandre      | ✅ Concluído | -          |
| Proteção de Rotas Base (Middlewares)  | Alexandre      | ✅ Concluído | -          |
| Validação de E-mail (Formato válido) | Alexandre      | ✅ Concluído | 30/03/2026 |
| Validação de Senha (Complexidade)     | Alexandre      | ✅ Concluído | 30/03/2026 |
| Mascaramento de Identidade Real         | Antigravity AI | ✅ Concluído | 04/04/2026 |
| Sanitização Global de Inputs (XSS)    | Pedro          | ✅ Concluído | 02/04/2026 |
| Rate Limiting (Anti-spam)               | Pedro          | ✅ Concluído | 02/04/2026 |

---

## 🚢 4. DevOps & Infra

*Containerização, logs e ambiente de produção.*

| Tarefa                                     | Responsável | Status        | Data |
| :----------------------------------------- | :----------- | :------------ | :--- |
| Dockerização (Multi-stage Build)         | Pedro        | ✅ Concluído | -    |
| Setup de Variáveis de Ambiente (.env)     | Pedro        | ✅ Concluído | -    |
| Configuração de Logs Persistentes        | [A DEFINIR]  | ⏳ Pendente   | -    |
| Pipeline CI/CD (GitHub Actions)            | [A DEFINIR]  | ⏳ Pendente   | -    |
| Deploy em Produção (Vercel/DigitalOcean) | [A DEFINIR]  | ⏳ Pendente   | -    |

---

> [!TIP]
> **Como usar:** Para novas tarefas, adicione uma linha à tabela correspondente. Use `⏳ Pendente`, `🚧 Em Progresso` ou `✅ Concluído`.
