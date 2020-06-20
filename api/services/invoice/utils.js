const { DeliveryOrderModel } = require('arroyo-erp-models');
const { InvoiceNotFoundDeliveryOrder } = require('../../../errors/invoice.errors');

/**
 * Calcula los totales del albarán
 * @param {Object} invoice
 */
const calcData = invoice => {
  let ivaI = 0;
  let reI = 0;
  let totalI = 0;
  let taxBaseI = 0;
  let rateI = 0;
  let deliveryOrders = [];

  invoice.deliveryOrders.forEach(async deliveryOrderId => {
    await DeliveryOrderModel.findOne({ _id: deliveryOrderId })
      .then(deliveryOrder => {
        if (!deliveryOrder) throw new InvoiceNotFoundDeliveryOrder();
        ivaI += deliveryOrder.iva;
        reI += deliveryOrder.re;
        totalI += deliveryOrder.total;
        taxBaseI += deliveryOrder.taxBase;
        if (deliveryOrder.rate) rateI += deliveryOrder.rate;
        deliveryOrders.push(deliveryOrder);
      });
    console.log(deliveryOrders)
  });

  return {
    deliveryOrders,
    dateInvoice: invoice.date,
    dateRegister: Date.now(),
    total: totalI,
    iva: ivaI,
    ...(rateI && { rate: rateI }),
    re: reI,
    nInvoice: invoice.nInvoice,
    concept: invoice.concept,
    taxBase: taxBaseI,
  };
};

module.exports = {
  calcData,
};
