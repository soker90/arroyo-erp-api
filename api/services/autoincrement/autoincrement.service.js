/* eslint-disable nonblock-statement-body-position */
const { AutoIncrement } = require('arroyo-erp-models');

const LogService = require('../log.service');

const TYPE = 'AutoIncrementService';
const logService = new LogService(TYPE);

/**
 * Decrement invoice nOrder
 * @return {Promise<string>}
 */
// eslint-disable-next-line consistent-return
const decrementInvoice = invoice => {
  if (invoice.nOrder) {
    logService.logInfo('[decrementInvoice] - Se decrementa el último número de orden');
    const dateInvoice = new Date(invoice.dateInvoice);
    return AutoIncrement.decrease(`invoice${dateInvoice.getFullYear()}`);
  }
  logService.logInfo('[decrementInvoice] - No se decrementa el número de orden');
};

/**
 * Decrement client invoice
 * @param {ClientInvoiceModel} invoice
 * @return {Promise<string>}
 */
// eslint-disable-next-line consistent-return
const decrementClientInvoice = invoice => {
  if (invoice.nInvoice) {
    logService.logInfo('[decrementInvoice] - Se decrementa el último número de factura de cliente');
    const date = new Date(invoice.date);
    return AutoIncrement.decrease(`clientInvoice${date.getFullYear()}`);
  }
  logService.logInfo('[decrementInvoice] - No se decrementa el número de orden');
};

module.exports = {
  decrementInvoice,
  decrementClientInvoice,
};
