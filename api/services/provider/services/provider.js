const { ProviderModel, BillingModel } = require('arroyo-erp-models');

/**
 * Adapter billing response
 * @param {Number} year
 * @param {[]} trimesters
 * @param {number} annual
 * @returns {{year: *, trimesters: *, annual: *}}
 */
const _billingAdapter = ({ year, trimesters, annual }) => ({
  year,
  trimesters,
  annual,
});

/**
 * Response for no billing data
 * @returns {{year: number, trimesters: number[], annual: number}}
 */
const _noBillingData = () => ({
  year: new Date().getFullYear(),
  trimesters: [0, 0, 0, 0],
  annual: 0,
});

/**
 * Get data from id
 * @param {string} id
 * @return {Promise<{data: *}>}
 */
const provider = async ({ id }) => {
  const data = await ProviderModel.findOne({ _id: id })
    .lean();

  const billing = await BillingModel.findOne({
    provider: id,
    year: new Date().getFullYear(),
  })
    .then(_billingAdapter)
    .catch(_noBillingData);

  return {
    provider: data,
    billing,
  };
};

module.exports = provider;
