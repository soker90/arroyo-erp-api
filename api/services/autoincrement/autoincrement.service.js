/* eslint-disable nonblock-statement-body-position */
const { AutoIncrement } = require('arroyo-erp-models');

const LogService = require('../log.service');

const TYPE = 'AutoIncrementService';
const logService = new LogService(TYPE);

/**
 * Create note
 * @return {Promise<string>}
 */
const decrementInvoice = invoice => {
  logService.logInfo('[decrementInvoice] - Se decrementa el último número de orden');

  // TODO decrementar autoincrement, desde el modelo
};

module.exports = {
  decrementInvoice,
};
