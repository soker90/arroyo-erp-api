const { InvoiceModel } = require('arroyo-erp-models');

const {
  calcNewShopping,
} = require('../utils');

/**
 * Añade el id de factura a los albaranes dados
 * @param {Object} invoiceData
 * @param {DeliveryOrderModel} deliveryOrders
 * @returns {Promise<void>}
 */
const _addInvoiceToDeliveryOrder = async (invoiceData, deliveryOrders) => {
  for (const deliveryOrder of deliveryOrders) {
    deliveryOrder.invoice = invoiceData._id;
    await deliveryOrder.save();
  }
};

/**
 * Create invoice
 * @param {Object} data
 */
const create = async data => {
  const invoice = await calcNewShopping(data);

  const newInvoice = await new InvoiceModel(invoice).save();

  await _addInvoiceToDeliveryOrder(newInvoice, invoice.deliveryOrders);

  return newInvoice;
};

module.exports = create;
