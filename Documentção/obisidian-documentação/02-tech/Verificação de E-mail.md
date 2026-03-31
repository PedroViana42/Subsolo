# Verificação de E-mail

## Metadados
- **Tags**: #Backend #Seguranca #Email
- **Relacionados**: [[Autenticação JWT]], [[Hashing de Senha]]

## Visão Geral
O Subsolo exige verificação de e-mail antes do primeiro login. Isso impede cadastros com e-mails falsos e garante que o usuário tenha acesso real à caixa de entrada usada no registro.

---

## Provedor de E-mail
**Nodemailer + Gmail** com App Password.

- Conta dedicada: `subsolo.noreply@gmail.com`
- Autenticação via App Password (não usa a senha da conta Google)
- Variáveis de ambiente: `GMAIL_USER`, `GMAIL_APP_PASSWORD`

> Para produção com domínio próprio, considerar migrar para Resend ou SendGrid para melhor deliverability e evitar filtros de spam.

---

## Fluxo Completo

```
Cadastro (POST /auth/register)
    ↓
Gera token: crypto.randomBytes(32).toString('hex')
Salva em EmailVerificationToken com expiresAt = now + 24h
Envia e-mail com link: FRONTEND_URL?verify=TOKEN
    ↓
Usuário clica no link → Frontend detecta ?verify=TOKEN
    ↓
Renderiza EmailVerifyScreen → chama GET /auth/verify/:token
    ↓
Backend: valida token, marca emailVerified = true, apaga token
    ↓
Frontend exibe sucesso → usuário faz login normalmente
```

---

## Rotas

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/auth/verify/:token` | Verifica o token e ativa a conta |
| `POST` | `/auth/resend-verification` | Reenvia o e-mail (apaga token antigo, gera novo) |

### Comportamento de segurança
- **Token de uso único**: apagado do banco após verificação bem-sucedida
- **Expiração de 24h**: tokens vencidos retornam `400`
- **Resposta genérica no reenvio**: não revela se o e-mail existe no sistema
- **Login bloqueado**: retorna `403 + code: EMAIL_NOT_VERIFIED` enquanto não verificado

---

## Modelo Prisma

```prisma
model EmailVerificationToken {
  id        String   @id @default(uuid())
  userId    String   @map("user_id")
  token     String   @unique
  expiresAt DateTime @map("expires_at")
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("email_verification_tokens")
}
```

Campo adicionado em `User`:
```prisma
emailVerified Boolean @default(false) @map("email_verified")
```

---

## Variáveis de Ambiente

| Variável | Descrição |
|----------|-----------|
| `GMAIL_USER` | E-mail da conta de envio |
| `GMAIL_APP_PASSWORD` | App Password de 16 caracteres gerado no Google |
| `FRONTEND_URL` | Base da URL do frontend (ex: `http://localhost:3000`) |

---

## Componente Frontend
`EmailVerifyScreen.tsx` — exibe três estados:
- `loading`: spinner enquanto chama o backend
- `success`: confirmação com botão para ir ao login
- `error`: mensagem de link inválido/expirado com botão para voltar

Usa `useRef` para evitar dupla chamada causada pelo React StrictMode em desenvolvimento.
