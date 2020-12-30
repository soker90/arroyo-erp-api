const { InvoiceModel } = require('arroyo-erp-models');
const { calcDeliveryOrdersData } = require('../utils/invoices');

/**
 * Actualiza la factura del albaran dado, en caso de que este
 * esté en una factura
 * @param {Object} deliveryOrder
 * @returns {Promise<{invoice}|*>}
 */
const refresh = async deliveryOrder => {
  if (!deliveryOrder.invoice) return;

  const newData = await InvoiceModel.findOne({ _id: deliveryOrder.invoice })
    .then(({ deliveryOrders }) => calcDeliveryOrdersData(deliveryOrders));

  await InvoiceModel.updateOne({ _id: deliveryOrder.invoice }, newData.dataInvoice);
};

module.exports = refresh;
