const { ClientInvoice } = require('arroyo-erp-models');

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
      0
    );
    total += totalDO;
    return {
      ...deliveryOrder,
      total: totalDO,
    };
  });

  const taxBase = total / 1.1;
  const iva = taxBase * 0.1;
  return ClientInvoice.findOneAndUpdate({ _id: invoice._id }, {
    deliveryOrders,
    total,
    iva,
    taxBase,
  }, { new: true });
};

module.exports = refresh;
