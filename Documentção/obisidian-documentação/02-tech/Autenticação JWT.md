# Autenticação JWT

## Metadados
- **Tags**: #Backend #Seguranca #Infra
- **Relacionados**: [[Middleware de Proteção]], [[Anonimato Controlado]]

## Visão Geral
O Subsolo usa **JSON Web Tokens (JWT)** para autenticação sem estado (stateless), permitindo escalabilidade via [[Docker]].

### Estrutura do Token
1. **Header**: Indica o algoritmo (ex: RS256) e tipo (JWT).
2. **Payload (Dados)**: 
    - `userId`: ID persistente do usuário (ex: UUID).
    - `nickId`: ID da máscara atual ([[Identidade Temporal]]).
    - `iat` (Issued At) e `exp` (Expiration).
3. **Assinatura**: Garante que o token não foi alterado pelo cliente.

## Segurança
- O Secret JWT é armazenado em variáveis de ambiente `.env`.
- Os tokens são validados em cada requisição pelo [[Middleware de Proteção]].
