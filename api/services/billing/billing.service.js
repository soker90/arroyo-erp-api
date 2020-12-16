/* eslint-disable nonblock-statement-body-position */
const {
  BillingModel,
  ProviderModel,
} = require('arroyo-erp-models');

const LogService = require('../log.service');

const TYPE = 'BillingService';
const logService = new LogService(TYPE);

const exportOds = require('./services/export');
const refresh = require('./services/refresh');

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

const remove = invoice => {
  if (invoice.nOrder) {
    const date = new Date(invoice.dateInvoice);

    const month = date.getMonth();
    const year = date.getFullYear();
    const trimester = Math.trunc(month / 3);
    logService.logInfo(`[remove] - Fecha ${date.toLocaleDateString()}`);

    logService.logInfo(`[remove] - Se eliminará del ${trimester + 1} trimestre del año ${year}`);

    return BillingModel.updateOne({
      provider: invoice.provider,
      year,
    }, {
      $pull: {
        [`invoicesTrimester${trimester}`]: {
          invoice: invoice._id,
        },
      },
    });
  }
  logService.logInfo('[remove] - No es necesario eliminar la factura de la facturación');
  return undefined;
};

/**
 * Get all invoices
 * @param {Object} params
 * @returns {Promise<*>}
 */
const billings = ({ year }) => {
  logService.logInfo(`[billings] - Facturación del año ${year}`);

  return BillingModel.find({ year }, 'trimesters provider annual')
    .populate('provider', 'businessName name', ProviderModel)
    .sort({ 'provider.name': 1 });
};

module.exports = {
  add,
  remove,
  billings,
  exportOds,
  refresh,
};
