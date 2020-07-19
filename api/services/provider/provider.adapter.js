/**
 * Adapter billing response
 * @param {Number} year
 * @param {[]} trimesters
 * @param {number} annual
 * @returns {{year: *, trimesters: *, annual: *}}
 */
const billingAdapter = ({ year, trimesters, annual }) => ({
  year,
  trimesters,
  annual,
});

/**
 * Response for no billing data
 * @returns {{year: number, trimesters: number[], annual: number}}
 */
const noBillingData = () => ({
  year: new Date().getFullYear(),
  trimesters: [0, 0, 0, 0],
  annual: 0,
});

module.exports = {
  billingAdapter,
  noBillingData,
};
