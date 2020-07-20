const { DeliveryOrderModel } = require('arroyo-erp-models');
/**
 * Añade el id de factura a los albaranes dados
 * @param {Object} invoiceData
 * @param {DeliveryOrderModel} deliveryOrders
 * @returns {Promise<void>}
 */
const addInvoiceToDeliveryOrder = async (invoiceData, deliveryOrders) => {
  for (const deliveryOrder of deliveryOrders) {
    deliveryOrder.invoice = invoiceData._id;
    await deliveryOrder.save();
  }
};

/**
 * Añade el numero de orden de la factura a los albaranes
 * @param {Object} invoice
 * @returns {Promise<void>}
 */
const addNOrderToDeliveryOrder = async invoice => {
  const { nOrder } = invoice;
  for (const deliveryOrder of invoice.deliveryOrders) {
    const model = await DeliveryOrderModel
      .findOneAndUpdate({ _id: deliveryOrder._id }, { nOrder });
    model.save();
  }
};

module.exports = {
  addInvoiceToDeliveryOrder,
  addNOrderToDeliveryOrder,
};
