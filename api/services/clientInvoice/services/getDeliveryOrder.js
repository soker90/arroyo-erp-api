const {
  ClientInvoiceModel,
} = require('arroyo-erp-models');

/**
 * Create invoice
 * @param {string} deliveryOrder
 */
const getDeliveryOrder = async ({
  deliveryOrder,
}) => ClientInvoiceModel.findOne({
  'deliveryOrders._id': deliveryOrder,
})
  .then(invoice => invoice.deliveryOrders.find(({ _id }) => _id === deliveryOrder));

module.exports = getDeliveryOrder;
