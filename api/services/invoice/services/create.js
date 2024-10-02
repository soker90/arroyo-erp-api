const {
  InvoiceModel,
} = require('arroyo-erp-models');

const {
  calcNewShopping,
} = require('../utils');

/**
 * Añade el id de factura a los albaranes dados
 * @param {Object} invoiceData
 * @param {[DeliveryOrderModel]} deliveryOrders
 * @returns {Promise<void>}
 */
const _addInvoiceToDeliveryOrder = async (invoiceData, deliveryOrders) => {
  // eslint-disable-next-line no-restricted-syntax
  for (const deliveryOrder of deliveryOrders) {
    deliveryOrder.invoice = invoiceData._id;
    // eslint-disable-next-line no-await-in-loop
    await deliveryOrder.save();
  }
};

/**
 * Create invoice
 * @param {Object} data
 */
const create = async data => {
  const {
    dataInvoice,
    deliveryOrders,
  } = await calcNewShopping(data);

  const newInvoice = await new InvoiceModel(dataInvoice).save();

  await _addInvoiceToDeliveryOrder(newInvoice, deliveryOrders);

  return {
    id: newInvoice._id,
  };
};

module.exports = create;
