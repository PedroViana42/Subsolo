# Identidade Temporal

## Metadados
- **Tags**: #Negocio #Regras #Seguranca
- **Relacionados**: [[Anonimato Controlado]], [[Relacionamento de Identidade]]

## Conceito
A **Identidade Temporal** é o pilar de privacidade do Subsolo. Para garantir o anonimato e evitar o rastreamento histórico de longo prazo, cada usuário recebe uma "Máscara" (Nick) que possui um ciclo de vida limitado.

### Regras de Negócio
- **Duração**: Cada identidade expira após **48 horas**.
- **Renovação**: Após a expiração, o usuário deve gerar uma nova identidade para continuar postando.
- **Logica de Expiração**: 
    - O backend calcula `expiresAt` no momento da geração.
    - Postagens antigas permanecem com o Nick original, mas o vínculo com o usuário real é dissociado após o ciclo, se não houver registros persistentes de segurança.

## Conexões
- A expiração é refletida no [[Relacionamento de Identidade]] entre o UserID e o Nick atual.
- O [[Anonimato Controlado]] depende dessa rotatividade para manter a rede saudável.
