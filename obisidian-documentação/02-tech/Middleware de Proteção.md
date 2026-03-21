# Middleware de Proteção

## Metadados
- **Tags**: #Backend #Infra #Seguranca
- **Relacionados**: [[Autenticação JWT]], [[Rate Limiting]]

## Funcionamento
O **Middleware de Proteção** é uma função que intercepta requisições para rotas privadas no Fastify.

### Pipeline de Validação
1. **Extração**: Obtém o token do Header `Authorization: Bearer <token>`.
2. **Verificação**: Valida a assinatura do token usando a chave secreta.
3. **Decodificação**: Extrai o `userId` e anexa ao objeto de requisição (`request.user`).
4. **Próxima Etapa**: Se válido, permite o acesso ao controlador da rota. Se inválido, retorna `401 Unauthorized`.

## Contexto
Essencial para garantir a integridade do [[Anonimato Controlado]], assegurando que apenas usuários logados possam postar.
