const config = {
  port: 3008,
  session: {
    secret: 'dff4gdf56g4d6f5g4d6f5g46d5fw',
    timeout: '2h',
  },
  mongo: {
    user: '',
    pass: '',
    port: ['27017'],
    host: ['127.0.0.1'],
    dataBaseName: 'arroyoErp',
  },
  services: {
    spider: {
      baseURL: 'http://localhost:8123',
      trackElement: {
        method: 'POST',
        url: '/trackElement',
      },
    },
  },
};

module.exports = config;
