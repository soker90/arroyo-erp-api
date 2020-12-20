const { BillingModel } = require('arroyo-erp-models');

const LogService = require('../../log.service');
const { roundNumber } = require('../../../../utils');

const TYPE = 'BillingService';
const logService = new LogService(TYPE);

/**
 * Calcula la facturación del trimestre dado
 * @param {Object} billing
 * @param {String} trimester
 * @returns {number}
 */
const _getSumByTrimesters = (billing, trimester) => billing?.[`invoicesTrimester${trimester}`]?.reduce(
  (accumulator, currentValue) => roundNumber(accumulator + currentValue.total), 0,
);

/**
 * Devuelve la facturación del año del proveedor
 * @param {Object} invoice
 * @param {number} year
 * @return {Promise<BillingModel>}
 * @private
 */
const _getBilling = (invoice, year) => BillingModel.findOne({
  provider: invoice.provider,
  year,
});

/**
 * Realiza los sumatorios para calcular la facturación
 * @param {Object} billing
 * @return {{trimesters: number[], annual: number}}
 */
const calcNewBilling = billing => {
  const trimesters = [0, 0, 0, 0];
  let annual = 0;

  [0, 1, 2, 3].forEach(trimester => {
    const sumTrimester = _getSumByTrimesters(billing, trimester) || 0;
    trimesters[trimester] = sumTrimester;
    annual += sumTrimester;
  });

  return {
    trimesters,
    annual,
  };
};

/**
 *  * Actualiza la facturación trimestral y anual del proveedor
 * @param invoice
 * @return {Promise<void>}
 */
const refresh = async invoice => {
  if (invoice.nOrder) {
    const year = new Date(invoice.dateInvoice).getFullYear();
    logService.logInfo(`[billings] - Refrescando la facturación del año ${year} del proveedor ${invoice.nameProvider}`);

    const billing = await _getBilling(invoice, year);

    await BillingModel.updateOne({
      provider: invoice.provider,
      year,
    }, calcNewBilling(billing));
  }
};
module.exports = refresh;
