# Schema Prisma

## Metadados

- **Tags**: #BancoDeDados #Backend #Prisma
- **Relacionados**: [[Relacionamento de Identidade]], [[Sistema Fato-Fic]]

## Entidades Principais

O Subsolo utiliza o Prisma ORM para gerenciar o esquema do [[PostgreSQL]]. Cada tabela deve refletir os requerimentos de anonimato e gamificação.

### Tabelas (Preview)

- **User**: Armazena dados reais (`email`, `passwordHash` na nota [[Hashing de Senha]]).
- **Nick (Postmascara)**: Tabela vinculada ao User para gerenciar a [[Identidade Temporal]]. Contém `catalogueId` para vincular ao catálogo.
- **NickCatalogue**: Catálogo de nomes pré-definidos para sorteio e rotação de identidades.
- **Post**: Conteúdo da confissão, `tag`, metadados de criação e `deletedAt` (soft delete — ver abaixo).
- **Vote**: Relacionamento N:N entre Nick e Post para o [[Sistema Fato-Fic]].
- **Comment**: Comentários nas postagens.
- **Bot**: Entidade para bots de automação (ex: @RU).

## Soft Delete em Posts

O campo `deletedAt DateTime?` no modelo `Post` implementa exclusão lógica:

- Quando o usuário deleta um post, o backend apenas preenche `deletedAt = now()` — o registro **permanece no banco**.
- Todas as queries de leitura (`GET /posts`) e edição (`PUT /posts/:id`) filtram `where: { deletedAt: null }`, tornando o post invisível para os usuários.
- Um job agendado (`purgePosts`) roda diariamente às 03:00 e deleta permanentemente os posts cujo `deletedAt` é mais antigo que `PURGE_AFTER_DAYS` dias (padrão: 30).
- A variável `PURGE_AFTER_DAYS` é configurável no `.env` — ex: `PURGE_AFTER_DAYS=7` para apagar após 1 semana.

**Índice**: `@@index([deletedAt])` garante que a query do purge job não faça full scan na tabela.

## Migrations

As migrações são gerenciadas via CLI do Prisma e versionadas no repositório.
As tabelas principais seguem o padrão de nomenclatura em Snake Case para o mapeamento no banco de dados.
