# Relacionamento de Identidade

## Metadados

- **Tags**: #Dados #Privacidade #Arquitetura
- **Relacionados**: [[Anonimato Controlado]], [[Identidade Temporal]], [[Schema Prisma]]

## Lógica de Vínculo

O desafio técnico do Subsolo é manter a integridade referencial sem expor o usuário real.

### Funcionamento

- O sistema utiliza um identificador secundário (UUID) para a **Máscara (Nick)**.
- No [[Schema Prisma]], as entidades públicas (`Post`, `Comment`, `Vote`) apontam para o `NickID`, nunca para o `UserID`.
- A relação entre `UserID` e `NickID` é monitorada em tempo real para permitir a atribuição de nicks únicos e rotativos.
- Com a inclusão do **Catálogo de Nicks**, cada `NickID` agora carrega um `catalogueId`, vinculando a máscara a uma entrada específica do catálogo durante seu ciclo de vida.
- **Objetivo**: Garantir que, mesmo com acesso ao banco de dados, reconstruir a conexão histórica entre posts e identidades reais exija o cruzamento de logs de auditoria temporais, protegendo o anonimato após a expiração da [[Identidade Temporal]].
