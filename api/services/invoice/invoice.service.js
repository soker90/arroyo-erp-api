const { InvoiceModel } = require('arroyo-erp-models');

/**
 * Create invoice
 * @param {string} provider
 */
const create = async ({ deliveryOrders }) => {
  await new InvoiceModel({ deliveryOrders }).save();
};

module.exports = {
  create,
};
