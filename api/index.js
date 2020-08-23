const swaggerUi = require('swagger-ui-express');
const { swaggerDocument } = require('./swagger');

const routes = require('./controllers');
const buildRouter = require('./build-router');

const swaggerOptions = {
  explorer: true,
};

module.exports = async app => {
  const router = buildRouter(routes, []);
  app.use('/', router);
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));
  app.get('/monit/health', (req, res) => res.send('OK'));
};
