# Relacionamento de Identidade

## Metadados
- **Tags**: #Dados #Privacidade #Arquitetura
- **Relacionados**: [[Anonimato Controlado]], [[Identidade Temporal]], [[Schema Prisma]]

## Lógica de Vínculo
O desafio técnico do Subsolo é manter a integridade referencial sem expor o usuário.

### Funcionamento
- O sistema usa um identificador secundário (UUID) para a Máscara.
- No [[Schema Prisma]], o `Post` aponta para o `NickID`, não para o `UserID`.
- A relação entre `UserID` e o `NickID` atual é mantida em uma tabela de sessão ou perfil temporário.
- **Objetivo**: Garantir que mesmo que o banco de dados seja comprometido, a conexão histórica entre posts e usuários reais seja difícil de reconstruir programaticamente após a expiração da [[Identidade Temporal]].
