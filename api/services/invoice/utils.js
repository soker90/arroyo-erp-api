const { DeliveryOrderModel } = require("arroyo-erp-models");
const {
  InvoiceNotFoundDeliveryOrder,
} = require("../../../errors/invoice.errors");

/**
 * Obtiene los datos de los albaranes de la factura
 * @param {Array} deliveryOrdersData
 * @returns {Promise<{deliveryOrders: [], total: number, re: number, iva: number, taxBase: number}>}
 * @private
 */
const _calcDeliveryOrdersData = async (deliveryOrdersData) => {
  let ivaI = 0;
  let reI = 0;
  let totalI = 0;
  let taxBaseI = 0;
  let rateI = 0;
  let deliveryOrders = [];

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
  };
};

/**
 * Calcula los totales del albarán para compras
 * @param {Object} invoice
 */
const calcNewShopping = async (invoice) => ({
  ...(await _calcDeliveryOrdersData(invoice.deliveryOrders)),
  dateRegister: Date.now(),
  concept: invoice.concept,
});

const addInvoiceToDeliveryOrder = async (invoiceData, deliveryOrders) => {
  for (const deliveryOrder of deliveryOrders) {
    deliveryOrder.invoice = invoiceData._id;
    await deliveryOrder.save();
  }
};

module.exports = {
  calcNewShopping,
  addInvoiceToDeliveryOrder,
};
