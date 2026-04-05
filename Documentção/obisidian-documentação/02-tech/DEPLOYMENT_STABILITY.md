# 🛡️ Guia de Estabilidade e Resiliência (Subsolo)

Este documento registra os desafios técnicos superados durante a migração para produção e serve como manual de manutenção para o ambiente Render + Supabase + Vercel.

---

## 🚀 1. Resolvendo o "Crash de Login" (Nicks)
**Problema**: O servidor encerrava o processo (Erro 500) ao tentar autenticar um usuário porque a tabela `NickCatalogue` estava vazia.
**Solução de Arquitetura**:
- **Semente Manual (Seed)**: Injetamos 60+ nicks temáticos no catálogo.
- **Fallback Automático**: Implementamos em `src/services/nick.ts` uma lógica de reserva. Se o catálogo esvaziar, o sistema gera nomes como `Anon_[Hex]`. O login **nunca** mais falhará por falta de dados.

## 🌐 2. Whitelist Dinâmica de CORS
**Problema**: O navegador bloqueava requisições vindas de subdomínios da Vercel (`*.vercel.app`) ou do novo domínio oficial.
**Solução (v1.7.2)**:
- O `index.ts` agora confia em qualquer origem que contenha ou termine com `usenexora.online` e `vercel.app`, garantindo que o acesso via `subsolo.usenexora.online` seja imediato.

## 📦 3. Portas e Resiliência no Render
**Problema**: O Render reportava "No open ports detected" ou falha no boot.
**Solução**:
- **Docker**: O `Dockerfile` agora usa `$PORT` dinâmico enviado pelo Render em vez de uma porta fixa (3001).
- **Boot Script**: O comando de inicialização (`CMD`) agora executa `npx prisma db push` e `npx prisma db seed` automaticamente para garantir a integridade do banco antes de subir o servidor Express.

## 🔗 4. Supabase: Direct Connection vs Pooler
**Problema**: Erros de timeout ou falta de migrações ao usar portas erradas do Supabase.
**Solução**:
- Configuramos a `DATABASE_URL` para usar a porta **5432** (Session Mode) com o parâmetro `?directConnection=true`. Isso permite que o Prisma realize migrações e operações de escrita pesadas sem sofrer bloqueios do Transaction Mode (Porta 6543).

## 🛡️ 5. Trust Proxy e Rate Limit
**Problema**: Bloqueios de "Too many requests" injustos devido ao proxy reverso do Render.
**Solução**:
- Adicionamos `app.set('trust proxy', 1)` no `index.ts`. O servidor agora reconhece o IP real do usuário em vez do IP do Render, permitindo que o limitador de acessos seja justo e seguro.

## 🚀 6. Falha no Envio de E-mail (Gmail)
**Problema**: E-mails de verificação não eram enviados (Timeout ou Auth Error).
**Solução (v1.7.2)**:
- **Transporte Seguro**: Mudamos de `service: 'gmail'` para o transporte explícito: `host: 'smtp.gmail.com'`, `port: 465` e `secure: true`.
- **Logs de Auditoria**: Adicionamos `try/catch` com `console.error` detalhado no `email.ts` para diagnosticar falhas de senha em tempo real.
- **Dica de Produção**: No painel do Render, a `GMAIL_APP_PASSWORD` deve ser salva **sem espaços** (ex: `jhlkgblrsuzaktek`).

---

## 🏷️ Guia de Domínio Novo (Nexora Online)

Para que o site funcione em `subsolo.usenexora.online`:

1. **DNS**: CNAME `subsolo` -> `cname.vercel-dns.com`.
2. **Vercel**: Adicionar o domínio nas configurações do projeto Frontend.
3. **Render**: Atualizar a variável `FRONTEND_URL` para `https://subsolo.usenexora.online`.

*Documento mantido pela Engenharia de Confiabilidade do Subsolo.*
