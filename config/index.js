const config = {
  port: 3008,
  session: {
    secret: 'dff4gdf56g4d6f5g4d6f5g46d5fw',
    timeout: '2h',
  },
  mongo: {
    user: process.env.DATABASE_ROOT_USERNAME || '',
    pass: process.env.DATABASE_ROOT_PASSWORD || '',
    port: ['27017'],
    host: [process.env.DATABASE_HOST || '127.0.0.1'],
    dataBaseName: process.env.DATABASE_NAME || 'arroyoErp',
  },
  logger: {
    loki: {
      isActive: true,
      user: process.env.GRAFANA_LOGGER_USER || 'test',
      job: 'arroyo-erp',
      host: 'https://logs-prod-eu-west-0.grafana.net',
      password: process.env.GRAFANA_LOGGER_PASSWORD || 'test',
    }
  }
};

module.exports = config;
