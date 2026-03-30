# Anonimato Controlado

## Metadados

- **Tags**: #Privacidade #Seguranca #Negocio
- **Relacionados**: [[Autenticação JWT]], [[Identidade Temporal]], [[Relacionamento de Identidade]]

## Definição

O **Anonimato Controlado** é o equilíbrio entre a liberdade do usuário e a responsabilidade legal/administrativa.

### Estrutura (UserID Real vs Nick Mascara)

1. **User ID (Real)**: ID único, persistente e criptografado no banco de dados, vinculado à conta real (ex: e-mail de cadastro).
2. **Nick (Mascara)**: Identidade visual temporária visível para os outros usuários (ex: "Panda Galático").

### A Ponte

- O sistema mantém um mapeamento interno temporário através do [[Relacionamento de Identidade]].
- **Auditoria**: Em caso de violação de termos de uso, a administração pode rastrear o Nick até o UserID real, mas essa informação nunca é exposta via API pública.
- **Proteção**: O [[Autenticação JWT]] carrega o UserID real no payload, mas o frontend só tem acesso ao Nick da sessão.
