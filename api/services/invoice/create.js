const { InvoiceModel } = require('arroyo-erp-models');
const {
  InvoiceMissingDeliveryOrders,
} = require('../../../errors/invoice.errors');

const {
  calcNewShopping, addInvoiceToDeliveryOrder,
} = require('./utils');

/**
 * Create invoice
 * @param {Object} data
 */
const create = async data => {
  let invoice = {};
  if (data.deliveryOrders) {
    if (!data.deliveryOrders.length) throw new InvoiceMissingDeliveryOrders();
    invoice = await calcNewShopping(data);
  }

  const newInvoice = await new InvoiceModel(invoice).save();

  if (data.deliveryOrders) await addInvoiceToDeliveryOrder(newInvoice, invoice.deliveryOrders);

  return newInvoice;
};

module.exports = create;
