const { AutoIncrement } = require('arroyo-erp-models');

/**
 * Generate new order number for the year
 * @param {Number} date
 * @returns {Promise<number>}
 * @private
 */
const generateOrderNumber = date => {
  const dateInvoice = new Date(date);
  return AutoIncrement.increment(`invoice${dateInvoice.getFullYear()}`);
};

module.exports = generateOrderNumber;
