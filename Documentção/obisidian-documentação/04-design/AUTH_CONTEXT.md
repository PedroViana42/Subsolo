# 📑 Documentação de Contexto: Projeto Subsolo

## 🎯 1. Visão Geral
O **Subsolo** é uma rede social universitária anônima voltada para confissões, fofocas e utilidade pública dentro do campus. O diferencial técnico e ético do projeto é o sistema de **Identidades Temporais**, que dissocia a atividade do usuário de sua identidade real de forma cíclica, garantindo privacidade radical e evitando o rastreamento histórico de longo prazo.

## 🛠️ 2. Stack Tecnológica
*   **Runtime:** Node.js (TypeScript) com Framework Express.
*   **Banco de Dados:** PostgreSQL.
*   **ORM:** Prisma.
*   **Autenticação:** JSON Web Tokens (JWT) Stateless.
*   **Criptografia:** Argon2id ou BCrypt para hashing de senhas.
*   **Infraestrutura:** Containerização via Docker.

## 🎭 3. Regras de Negócio: Identidades & Anonimato

### 3.1. Identidade Temporal (A Máscara)
*   **Duração:** Cada identidade (Nick) expira estritamente após **48 horas**, independentemente da frequência de acesso ou atividade do usuário.
*   **Vínculo de Dados:** Postagens, votos e comentários são vinculados ao `NickID` (volátil) e **nunca** diretamente ao `UserID` (persistente) nas consultas da API pública.
*   **Expiração em Tempo Real:** Se o token expirar durante o uso, o Middleware de Proteção retornará `401 Unauthorized`, exigindo um novo login para que o sistema processe a renovação da máscara.

### 3.2. Pool de Nicks (Catálogo Estático)
*   **Origem:** Os nomes não são gerados via string aleatória pura em cada login. Eles são sorteados de uma tabela pré-populada chamada `NickCatalogue`.
*   **Unicidade:** Múltiplos usuários podem possuir o mesmo "Nome" (ex: "Panda Galático"), pois o que os diferencia no banco de dados são seus UUIDs únicos. Isso fortalece o anonimato de "rebanho".
*   **Regra de Recorrência:** Ao renovar uma identidade, o sistema garante que o novo nome sorteado seja obrigatoriamente diferente do nome utilizado pelo `UserID` no ciclo imediatamente anterior.

## 🔐 4. Fluxo de Autenticação e Segurança

1.  **Cadastro:** Requer `email` e `password`. A senha é hasheada com bcryptjs (cost 12). Um token de verificação (32 bytes hex, validade 24h) é gerado e enviado por e-mail via Nodemailer + Gmail.
2.  **Verificação de E-mail:** O usuário clica no link (`FRONTEND_URL?verify=TOKEN`). O frontend detecta o parâmetro, chama `GET /auth/verify/:token`, que marca `emailVerified = true` e apaga o token. Token de uso único — reenvio disponível via `POST /auth/resend-verification`.
3.  **Login e Refresh de Identidade:**
    *   O sistema valida as credenciais do usuário.
    *   Bloqueia com `403 EMAIL_NOT_VERIFIED` se o e-mail não foi confirmado.
    *   Verifica se existe um `Nick` vinculado ao usuário com `expiresAt > agora`.
    *   Caso não exista (novo usuário ou expirado), realiza o sorteio no `NickCatalogue` e registra o novo `Nick`.
    *   Emite um JWT contendo o `userId` (para controle interno) e o `nickId` (para operações de conteúdo).
4.  **Persistência de Sessão:** Token e dados do nick são salvos no `localStorage`. No carregamento, o frontend restaura a sessão automaticamente se `expiresAt > agora`.
5.  **Middleware de Proteção:** Intercepta rotas privadas, valida a assinatura do segredo JWT e verifica a integridade da sessão.

## 🗄️ 5. Resumo do Esquema de Dados (Prisma)
*   **User:** Armazena credenciais, metadados da conta real e flag `emailVerified`.
*   **EmailVerificationToken:** Token temporário (24h) vinculado ao usuário para verificação de e-mail. Apagado após uso.
*   **NickCatalogue:** Repositório global de nomes disponíveis (Ex: "Capivara de Cálculo", "Veterano Fantasma").
*   **Nick:** Representa a máscara ativa de um usuário, com data de expiração e relação com as interações (Posts/Comments).
*   **Interações:** `Post`, `Comment` e `Vote` referenciam apenas o `NickID`.

---
*Documentação gerada para suporte ao desenvolvimento do Backend Subsolo, para o modulo de Autenticação.*