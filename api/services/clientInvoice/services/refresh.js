const { ClientInvoiceModel } = require('arroyo-erp-models');
const roundNumber = require('../../../../utils/roundNumber');

/**
 * Actualiza la factura
 * @param {Object} invoice
 * @returns {Promise<{invoice}|*>}
 */
const refresh = invoice => {
  let total = 0;
  const deliveryOrders = invoice.deliveryOrders.map(deliveryOrder => {
    const totalDO = deliveryOrder.products.reduce(
      (accumulator, current) => accumulator + current.total,
      0,
    );
    total += totalDO;

    return {
      _id: deliveryOrder._id,
      date: deliveryOrder.date,
      products: deliveryOrder.products,
      total: totalDO,
    };
  });
  total = roundNumber(total);

  const taxBase = roundNumber(total / 1.1);
  const iva = roundNumber(taxBase * 0.1);
  return ClientInvoiceModel.findOneAndUpdate({ _id: invoice._id }, {
    deliveryOrders,
    total,
    iva,
    taxBase,
  }, { new: true });
};

module.exports = refresh;
