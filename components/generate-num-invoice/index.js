const { AutoIncrement } = require('arroyo-erp-models');

/**
 * Generate new order number for the year
 * @param {Number} date
 * @returns {Promise<number>}
 * @private
 */
const generateNumberInvoice = date => {
  const dateInvoice = new Date(date);
  return AutoIncrement.increment(`clientInvoice${dateInvoice.getFullYear()}`);
};

module.exports = generateNumberInvoice;
