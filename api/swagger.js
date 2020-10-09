const { version } = require('../package.json');

const swaggerDocument = {
  openapi: '3.0.3',
  info: {
    version,
    title: 'Arroyo ERP API',
    description: 'Api para el backoffice del Arroyo',
    termsOfService: '',
    contact: {
      name: 'Eduardo Parra',
      email: 'eduparra90@gmail.com',
      url: 'https://www.eduardoparra.es',
    },
    license: {
      name: 'MIT',
      url: 'https://github.com/soker90/arroyo-erp-api/blob/master/LICENSE',
    },
  },
  servers: [
    {
      url: 'http://localhost:3008/',
      description: 'Local',
    },
  ],
  securitySchemes: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    },
  },
  paths: {
    '/monit/health': {
      get: {
        tags: ['Monit'],
        description: 'Comprueba que está corriendo el servidor',
        operationId: 'monit',
        security: [
          {
            bearerAuth: [],
          },
        ],
        responses: {
          200: {
            description: 'Indica que el servidor está corriendo',
            content: {
              'application/json': {
                schema: {
                  schema: {
                    type: 'String',
                  },
                  example: 'OK',
                },
              },
            },
          },
        },
      },
    },
  },
  component: {
    schemas: {
      Error: {
        required: ['message'],
        message: {
          type: 'string',
        },
      },
    },
  },
};

module.exports = {
  swaggerDocument,
};
