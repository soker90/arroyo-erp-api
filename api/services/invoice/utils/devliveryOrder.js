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

module.exports = {
  addInvoiceToDeliveryOrder,
};
