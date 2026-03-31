# Melhorias e Correções

> Todas as tarefas desta sprint foram concluídas em 30/03/2026.

## ✅ 1. Persistência de Sessão — Concluído
- `useEffect` em `App.tsx` restaura sessão via `subsolo_token` + `subsolo_nick` no localStorage.
- Verifica `expiresAt` antes de restaurar — se expirado, limpa e redireciona para login.

## ✅ 2. Validações de Cadastro — Concluído
- **Senha:** mínimo 8 caracteres, 1 maiúscula, 1 número.
- **E-mail:** formato válido (qualquer e-mail, não institucional).
- Erros exibidos no bloco `rose-500` existente em `LoginScreen.tsx`.

## ✅ 3. Lógica da "Tela de Máscara" — Concluído
- Exibe `MaskGenerationScreen` apenas quando o nick é novo.
- Flag `has_seen_mask_for_[nickname]` no localStorage controla a exibição.

## ✅ 4. Validação do Tempo (Ciclo 48h) — Concluído
- `getHoursRemaining()` usa `expiresAt` real do backend em `LeftSidebar.tsx` e `PostForm.tsx`.

## ✅ 5. Verificação de E-mail — Concluído
- Cadastro envia link de verificação via Gmail (Nodemailer).
- Login bloqueado até e-mail ser confirmado.
- Tela `EmailVerifyScreen` exibe resultado da verificação.
- Botão de reenvio aparece automaticamente na tela de login quando necessário.

---

## ⚠️ IMPORTANTE
- Manter a estética **Glassmorphism** ao adicionar novos campos ou mensagens de erro  
- Utilizar:
  - `violet-500` para sucesso  
  - `rose-500` para erros críticos  