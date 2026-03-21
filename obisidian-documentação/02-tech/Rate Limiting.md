# Rate Limiting

## Metadados
- **Tags**: #Infra #Seguranca #Resiliencia
- **Relacionados**: [[Hashing de Senha]], [[Middleware de Proteção]]

## Objetivo
Proteger a infraestrutura contra abusos, ataques DDoS e tentativas de força bruta no login.

### Estratégia
- **Balcket-level**: Limite de requisições por IP em um janela de tempo (ex: 100 reqs / min).
- **Route-level**: Limites específicos para rotas sensíveis como `/login` ou `/register`.
- **Estratégia de Resposta**: Retorna `429 Too Many Requests` quando o limite é excedido.

## Tecnologias
- Implementado via utilitário do Fastify (`fastify-rate-limit`) ou em nível de Gateway/Nginx.
- Persistência dos contadores de requisições normalmente feita em memória ou Redis.
