const { DeliveryOrderModel } = require('arroyo-erp-models');
const {
  InvoiceNotFoundDeliveryOrder,
} = require('../../../../errors/invoice.errors');
const { roundNumber } = require('../../../../utils');

/**
 * Obtiene los datos de los albaranes de la factura
 * @param {Array} deliveryOrdersData
 * @returns {Promise<{deliveryOrders: [], total: number, re: number, iva: number, taxBase: number}>}
 * @private
 */
const calcDeliveryOrdersData = async deliveryOrdersData => {
  let ivaI = 0;
  let reI = 0;
  let totalI = 0;
  let taxBaseI = 0;
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

    deliveryOrders.push(deliveryOrder);
  }

  return {
    deliveryOrders,
    total: roundNumber(totalI, 2),
    iva: roundNumber(ivaI, 2),
    re: roundNumber(reI, 2),
    taxBase: roundNumber(taxBaseI, 2),
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
  ...(await calcDeliveryOrdersData(invoice.deliveryOrders)),
  dateRegister: Date.now(),
  concept: invoice.concept,
});

module.exports = {
  calcNewShopping,
  calcDeliveryOrdersData,
};
