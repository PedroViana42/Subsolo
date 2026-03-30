# Identidade Temporal

## Metadados

- **Tags**: #Negocio #Regras #Seguranca
- **Relacionados**: [[Anonimato Controlado]], [[Relacionamento de Identidade]], [[Schema Prisma]]

## Conceito

A **Identidade Temporal** é o pilar de privacidade do Subsolo. Para garantir o anonimato e evitar o rastreamento histórico de longo prazo, cada usuário recebe uma "Máscara" (Nick) que possui um ciclo de vida limitado.

No Subsolo, as identidades não são geradas aleatoriamente no momento do uso, mas sim sorteadas de um catálogo pré-definido, garantindo uma curadoria de nomes e evitando colisões indesejadas.

## Regras de Negócio

- **Duração**: Cada identidade (Nick) expira após **48 horas**.
- **Atribuição via Catálogo**:
    - O sistema sorteia um nome disponível na tabela `NickCatalogue`.
    - Um nome é considerado disponível se seu campo `isActive` for `true`.
    - Ao ser atribuído a um usuário, o nome no catálogo é marcado como `isActive = false` até que o Nick expire.
- **Evitar Repetição**: O sistema garante que o novo Nick sorteado seja diferente do último Nick utilizado pelo usuário (se houver).
- **Reciclagem Automática**:
    - Quando um Nick expira, sua entrada correspondente no catálogo volta a ficar disponível (`isActive = true`) para sorteio por outros usuários.
- **Logica de Expiração**: 
    - O backend calcula `expiresAt` no momento da atribuição.
    - Postagens antigas permanecem vinculadas ao Nick original, mas o vínculo técnico com o `UserID` real é rotacionado.

## Conexões

- A expiração é refletida no [[Relacionamento de Identidade]] entre o UserID e o Nick atual.
- O [[Anonimato Controlado]] depende dessa rotatividade para manter a rede saudável.
- O catálogo de nomes é gerenciado na tabela `NickCatalogue` detalhada no [[Schema Prisma]].
