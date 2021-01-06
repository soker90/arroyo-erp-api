const { ClientInvoiceModel } = require('arroyo-erp-models');

/**
 * Create invoice
 * @param {Object} data
 */
const deleteDeliveryOrder = async ({
  id,
  deliveryOrder,
}) => {
  await ClientInvoiceModel.updateOne({
    _id: id,
    'deliveryOrders._id': deliveryOrder,
  }, { $pull: { deliveryOrders: { _id: deliveryOrder } } });
};

module.exports = deleteDeliveryOrder;
