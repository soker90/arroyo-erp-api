const LokiTransport = require('winston-loki');
const morgan = require('morgan');
import { createLogger, format, transports } from 'winston';

import config from '../';

const { combine, prettyPrint } = format;

function initLogger(app) {
  const transportList = [
    new transports.Console({
      silent: process.env.LOG !== '1',
      format: combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
        format.colorize({ all: true }),
        format.printf(
          (info) => `${info.timestamp} ${info.level}: ${info.message}`,
        ),
      )
    })
  ];

  if (process.env.NODE_ENV === 'prod') {
    transportList.push(new LokiTransport({
      format: prettyPrint(),
      host: config.logger.loki.host,
      silent: config.logger.loki.isActive,
      labels: { job: config.logger.loki.job },
      basicAuth: `${config.logger.loki.user}:${config.logger.loki.password}`,
    }));
  }

  const logger = createLogger({
    exitOnError: true,
    transports: transportList,
  });

  const morganOptions = {
    write: function (message) {
      logger.info(message);
    }
  };

  function initLogger(req, res, next) {
    console.log = (args) => logger.info.call(logger, args);
    console.info = (args) => logger.info.call(logger, args);
    console.warn = (args) => logger.warn.call(logger, args);
    console.error = (args) => logger.error.call(logger, args);
    console.debug = (args) => logger.debug.call(logger, args);

    next();
  }

  app.use(morgan('tiny', { stream: morganOptions }));
  app.use(initLogger);
}

module.exports = initLogger;