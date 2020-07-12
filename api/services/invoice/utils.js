const { DeliveryOrderModel, InvoiceModel } = require('arroyo-erp-models');
const {
  InvoiceNotFoundDeliveryOrder,
} = require('../../../errors/invoice.errors');

/**
 * Obtiene los datos de los albaranes de la factura
 * @param {Array} deliveryOrdersData
 * @returns {Promise<{deliveryOrders: [], total: number, re: number, iva: number, taxBase: number}>}
 * @private
 */
const _calcDeliveryOrdersData = async deliveryOrdersData => {
  let ivaI = 0;
  let reI = 0;
  let totalI = 0;
  let taxBaseI = 0;
  let rateI = 0;
  const deliveryOrders = [];

  for (const deliveryOrderId of deliveryOrdersData) {
    const deliveryOrder = await DeliveryOrderModel.findOne({
      _id: deliveryOrderId,
    });

    if (!deliveryOrder) throw new InvoiceNotFoundDeliveryOrder();

    ivaI += deliveryOrder.iva;
    reI += deliveryOrder.re;
    totalI += deliveryOrder.total;
    taxBaseI += deliveryOrder.taxBase;
    if (deliveryOrder.rate) rateI += deliveryOrder.rate;

    deliveryOrders.push(deliveryOrder);
  }

  return {
    deliveryOrders,
    total: totalI,
    iva: ivaI,
    ...(rateI && { rate: rateI }),
    re: reI,
    taxBase: taxBaseI,
    ...(deliveryOrders.length && {
      nameProvider: deliveryOrders[0].nameProvider,
      provider: deliveryOrders[0].provider,
    }),
  };
};

/**
 * Calcula los totales del albarán para compras
 * @param {Object} invoice
 */
const calcNewShopping = async invoice => ({
  ...(await _calcDeliveryOrdersData(invoice.deliveryOrders)),
  dateRegister: Date.now(),
  concept: invoice.concept,
});

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
 * Actualiza la factura del albaran dado, en caso de que este
 * esté en una factura
 * @param {Object} deliveryOrder
 * @returns {Promise<{invoice}|*>}
 */
const refreshInvoice = async deliveryOrder => {
  if (!deliveryOrder.invoice) return deliveryOrder;

  const newData = await InvoiceModel.findOne({ _id: deliveryOrder.invoice })
    .then(
      invoice => {
        const deliveryOrderIndex = invoice.deliveryOrders
          .findIndex(deliveryOrdersSaved => deliveryOrdersSaved._id === deliveryOrder._id);
        invoice.deliveryOrders[deliveryOrderIndex] = deliveryOrder;
        return _calcDeliveryOrdersData(invoice.deliveryOrders);
      }
    );

  await InvoiceModel.update({ _id: deliveryOrder.invoice }, newData);
  return deliveryOrder;
};

module.exports = {
  calcNewShopping,
  addInvoiceToDeliveryOrder,
  refreshInvoice,
};
