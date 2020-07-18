const { BillingModel, InvoiceModel } = require('arroyo-erp-models');

/**
 * Suma todas las facturas del provedor entre las fechas dadas
 * @param {string} provider
 * @param {number} startDate
 * @param {number} endDate
 * @returns {Promise}
 * @private
 */
const _sumInvoices = (provider, startDate, endDate) => (
  InvoiceModel.aggregate([
    {
      $match: {
        provider,
        dateInvoice: {
          $gt: startDate,
          $lt: endDate,
        },
      },
    },
    {
      $group: {
        _id: null,
        sum: { $sum: '$total' },
      },
    },
  ])
);

/**
 * Set billing sum
 * @param {number} year
 * @param {string} provider
 * @param {number} trimester
 * @param {number} sum
 * @returns {*|Promise<void>|PromiseLike<any>|Promise<any>}
 * @private
 */
const _setBilling = ({
  year,
  provider,
  trimester,
  sum,
}) => (
  BillingModel.findOne({
    year,
    provider,
  })
    .then(billing => {
      if (billing) {
        const { trimesters } = billing;
        trimesters[trimester] = sum;
        billing.save();
      } else {
        const trimesters = [0, 0, 0, 0];
        trimesters[trimester] = sum;
        new BillingModel({
          year,
          provider,
          trimesters,
        }).save();
      }
    })
);

/**
 * Recalc amount total of the provider in trimester
 * @param {number} dateTime
 * @param {String} provider
 * @returns {Promise<void>}
 */
const refreshBilling = async (dateTime, provider) => {
  const date = new Date(dateTime);
  const month = date.getMonth();
  const year = date.getFullYear();
  const trimester = Math.trunc(month / 3);
  const startDate = new Date(year, trimester * 3, 2).getTime();
  const endDate = new Date(year, (trimester * 3) + 3, 1).getTime();

  const [totals] = await _sumInvoices(provider, startDate, endDate);

  await _setBilling({
    year,
    provider,
    trimester,
    sum: totals.sum,
  });
};

module.exports = {
  refreshBilling,
};
