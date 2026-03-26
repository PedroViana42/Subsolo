# Sistema Fato/Fic

## Metadados
- **Tags**: #Negocio #Gamificacao #Reputacao
- **Relacionados**: [[Identidade Temporal]], [[Schema Prisma]]

## Mecânica
O **Sistema Fato/Fic** substitui o tradicional "curtir/descurtir" por uma validação de veracidade comunitária. 

### Funcionamento
- **Fact (Real Oficial)**: Quando a comunidade valida que a informação é verídica ou útil.
- **Fic (Pura Fic)**: Quando a comunidade sinaliza que a postagem é inventada ou fofoca sem fundamento.
- **Score de Honestidade**: 
    - Um cálculo baseado na proporção de Facts vs Fics nas postagens do usuário.
    - Influencia a exibição da aura (emoji) na [[Identidade Temporal]].

## Implementação Técnica
- Os votos são armazenados conforme o [[Schema Prisma]] na tabela de votos vinculada ao Post.
- O cálculo do Score é feito em tempo de consulta ou via triggers no banco.
