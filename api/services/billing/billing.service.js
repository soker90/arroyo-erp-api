/* eslint-disable nonblock-statement-body-position */
const { BillingModel } = require('arroyo-erp-models');

const LogService = require('../log.service');

const TYPE = 'BillingService';
const logService = new LogService(TYPE);

/**
 * Create payment
 * @return {Promise<string>}
 */
const add = invoice => {
  logService.logInfo(`[add] - Añadiendo la factura ${invoice._id}`);

  const date = new Date(invoice.dateInvoice);
  const month = date.getMonth();
  const year = date.getFullYear();
  const trimester = Math.trunc(month / 3);

  logService.logInfo(`[add] - Fecha ${date.toLocaleDateString()}`);
  logService.logInfo(`[add] - Se añadirá al ${trimester + 1} trimestre del año ${year}`);

  return BillingModel.updateOne({
    provider: invoice.provider,
    year,
  }, {
    $push: {
      [`invoicesTrimester${trimester}`]: {
        invoice: invoice._id,
        total: invoice.total,
        date: invoice.dateInvoice,
      },
    },
  }, { upsert: true });
};

module.exports = {
  add,
};
