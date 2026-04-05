import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Subsolo API',
      version: '1.7.4',
      description: 'API do Subsolo — rede social universitária anônima com identidades temporais de 48h.',
    },
    servers: [
      { 
        url: process.env.API_URL || 'http://localhost:3001', 
        description: 'Servidor API' 
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        RegisterRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'estudante@uni.br' },
            password: { type: 'string', minLength: 8, example: 'senha123' },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'estudante@uni.br' },
            password: { type: 'string', example: 'senha123' },
          },
        },
        LoginResponse: {
          type: 'object',
          properties: {
            token: { type: 'string', description: 'JWT válido por 48h' },
            nick: {
              type: 'object',
              properties: {
                name: { type: 'string', example: 'Capivara de Cálculo' },
                expiresAt: { type: 'string', format: 'date-time' },
                score: { type: 'integer', example: 100 },
                aura: { type: 'string', nullable: true, example: null },
              },
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Credenciais inválidas' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
