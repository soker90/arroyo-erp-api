/* eslint-disable nonblock-statement-body-position */

const LogService = require('../log.service');
const { TYPE_PAYMENT } = require('../../../constants/payments');

const TYPE = 'DashboardService';
const logService = new LogService(TYPE);
const reminderService = require('../reminder');
const invoiceService = require('../invoice');

/**
 * Dashboard info
 * @return {Promise<string>}
 */
const dashboard = async () => {
  logService.logInfo('[dashboard] - Devuelve la información del dashboard');

  return {
    reminders: await reminderService.reminders(),
    cash: await invoiceService.totals({
      year: new Date().getFullYear(),
      type: TYPE_PAYMENT.CASH,
    }),
  };
};

module.exports = {
  dashboard,
};
