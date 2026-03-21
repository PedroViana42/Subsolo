# Hashing de Senha

## Metadados
- **Tags**: #Seguranca #Backend #Dados
- **Relacionados**: [[Autenticação JWT]], [[Rate Limiting]]

## Conceito
Senhas nunca são armazenadas em texto puro no [[PostgreSQL]]. Elas passam por um processo de derivação de chave criptográfica.

### Tecnologias Recomendadas
- **Argon2id**: Atualmente o vencedor da competição de hashing de senha. Resistente a ataques de CPU/GPU (side-channel).
- **BCrypt**: Alternativa robusta e amplamente utilizada.

### Salt & Iterações
- **Salt**: Valor aleatório adicionado a cada senha antes do hash para evitar ataques de Tabela Rainbow.
- **Iterações**: Custo computacional configurado no backend para tornar o ataque de força bruta proibitivo em termos de tempo.

## Aplicação
Integrado no momento do cadastro e validação no [[Autenticação JWT]].
