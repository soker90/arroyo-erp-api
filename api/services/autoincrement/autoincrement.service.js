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
  if (invoice.nOrder) {
    logService.logInfo('[decrementInvoice] - Se decrementa el último número de orden');
    const dateInvoice = new Date(invoice.dateInvoice);
    return AutoIncrement.decrease(`invoice${dateInvoice.getFullYear()}`);
  }
  logService.logInfo('[decrementInvoice] - No se decrementa el número de orden');
};

module.exports = {
  decrementInvoice,
};
