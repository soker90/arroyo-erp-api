const { billingErrors } = require('../../../errors');

/**
 * Check if have year
 * @param {String} id
 * @returns {boolean}
 */
const validateYear = ({ year }) => {
  if (!year) throw new billingErrors.BillingYearMissing();
};

module.exports = {
  validateYear,
};
