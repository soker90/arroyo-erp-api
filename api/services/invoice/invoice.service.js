const { InvoiceModel } = require('arroyo-erp-models');
const { InvoiceMissingDeliveryOrders } = require('../../../errors/invoice.errors');
const { calcData } = require('./utils');

/**
 * Create invoice
 * @param {string} data
 */
const create = async data => {
  let invoice = {};
  if (data.deliveryOrders) {
    if (!data.deliveryOrders.length)
      throw new InvoiceMissingDeliveryOrders();
    invoice = calcData(data);
  }

  await new InvoiceModel(invoice).save();
};

module.exports = {
  create,
};
