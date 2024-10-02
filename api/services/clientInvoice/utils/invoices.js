const {
  DeliveryOrderModel,
  ProviderModel,
} = require('arroyo-erp-models');
const {
  InvoiceNotFoundDeliveryOrder,
} = require('../../../../errors/invoice.errors');
const { roundNumber } = require('../../../../utils');

/**
 * Obtiene los datos de los albaranes de la factura
 * @param {Array} deliveryOrdersData
 * @returns {Promise<{deliveryOrders: [], dataInvoice: {total: (number|*),
 * re: (number|*), iva: (number|*), taxBase: (number|*)}}>}
 * @private
 */
const calcDeliveryOrdersData = async deliveryOrdersData => {
  let ivaI = 0;
  let reI = 0;
  let totalI = 0;
  let taxBaseI = 0;
  let provider = null;
  const deliveryOrders = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const deliveryOrderId of deliveryOrdersData) {
    // eslint-disable-next-line no-await-in-loop
    const deliveryOrder = await DeliveryOrderModel.findOne({
      _id: deliveryOrderId,
    });

    if (!deliveryOrder) throw new InvoiceNotFoundDeliveryOrder();

    ivaI += deliveryOrder.iva;
    reI += deliveryOrder.re;
    totalI += deliveryOrder.total;
    taxBaseI += deliveryOrder.taxBase;

    if (!provider) provider = deliveryOrder.provider;
    deliveryOrders.push(deliveryOrder);
  }

  return {
    dataInvoice: {
      total: roundNumber(totalI, 2),
      iva: roundNumber(ivaI, 2),
      re: roundNumber(reI, 2),
      taxBase: roundNumber(taxBaseI, 2),
      ...(deliveryOrdersData.length && {
        provider,
        deliveryOrders: deliveryOrdersData,
      }),
    },
    deliveryOrders,
  };
};

/**
 * Calcula los totales del albarán para compras
 * @param {Object} invoice
 */
const calcNewShopping = async invoice => {
  const {
    dataInvoice,
    deliveryOrders,
  } = await calcDeliveryOrdersData(invoice.deliveryOrders);
  const provider = await ProviderModel.findOne({ _id: dataInvoice.provider });
  return ({
    deliveryOrders,
    dataInvoice: {
      ...dataInvoice,
      dateRegister: Date.now(),
      concept: invoice.concept,
      bookColumn: invoice.bookColumn,
      businessName: provider?.businessName,
      cif: provider?.cif,
      nameProvider: provider?.name,
    },
  });
};

module.exports = {
  calcNewShopping,
  calcDeliveryOrdersData,
};
