const { InvoiceModel } = require('arroyo-erp-models');
const { replaceArrayElement } = require('../../../utils');
const { calcDeliveryOrdersData } = require('./utils/invoices');

/**
 * Genera una nueva lista de albaranes con el albarán con cambios actualizado
 * @param {Array} deliveryOrders
 * @param {Object} deliveryOrder
 * @returns {Promise<{deliveryOrders: *[], total: number, re: number, iva: number, taxBase: number}>}
 */
const generateNewDeliveryOrders = (deliveryOrders, deliveryOrder) => {
  const deliveryOrderIndex = deliveryOrders
    .findIndex(deliveryOrdersSaved => deliveryOrdersSaved._id === deliveryOrder._id);

  const newDeliveryOrders = replaceArrayElement({
    array: deliveryOrders,
    element: deliveryOrder,
    index: deliveryOrderIndex,
  });
  return calcDeliveryOrdersData(newDeliveryOrders);
};
/**
 * Actualiza la factura del albaran dado, en caso de que este
 * esté en una factura
 * @param {Object} deliveryOrder
 * @returns {Promise<{invoice}|*>}
 */
const refresh = async deliveryOrder => {
  if (!deliveryOrder.invoice) return;

  const newData = await InvoiceModel.findOne({ _id: deliveryOrder.invoice })
    .then(({ deliveryOrders }) => generateNewDeliveryOrders(deliveryOrders, deliveryOrder));

  await InvoiceModel.update({ _id: deliveryOrder.invoice }, newData);
};

module.exports = refresh;
