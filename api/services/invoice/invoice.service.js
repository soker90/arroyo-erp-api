const { InvoiceModel } = require('arroyo-erp-models');
const { InvoiceMissingDeliveryOrders } = require('../../../errors/invoice.errors');

/**
 * Create invoice
 * @param {string} provider
 */
const create = async ({ deliveryOrders }) => {
  if(!deliveryOrders?.length)
    throw new InvoiceMissingDeliveryOrders();

  await new InvoiceModel({ deliveryOrders }).save();
};

module.exports = {
  create,
};
