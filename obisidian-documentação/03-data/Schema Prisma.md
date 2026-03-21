# Schema Prisma

## Metadados
- **Tags**: #BancoDeDados #Backend #Prisma
- **Relacionados**: [[Relacionamento de Identidade]], [[Sistema Fato-Fic]]

## Entidades Principais
O Subsolo utiliza o Prisma ORM para gerenciar o esquema do [[PostgreSQL]]. Cada tabela deve refletir os requerimentos de anonimato e gamificação.

### Tabelas (Preview)
- **User**: Armazena dados reais (`email`, `passwordHash` na nota [[Hashing de Senha]]).
- **Postmascara (Nick)**: Tabela vinculada ao User para gerenciar a [[Identidade Temporal]].
- **Post**: Conteúdo da confissão, `tag`, e metadados de criação.
- **Vote**: Relacionamento N:N entre Nick e Post para o [[Sistema Fato-Fic]].
- **Comment**: Comentários nas postagens.
- **Bot**: Entidade para bots de automação (ex: @RU).

## Migrations
As migrações são gerenciadas via CLI do Prisma e versionadas no repositório.
