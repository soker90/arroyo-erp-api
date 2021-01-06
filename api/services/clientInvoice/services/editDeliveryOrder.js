const { ClientInvoiceModel } = require('arroyo-erp-models');

/**
 * Create invoice
 * @param {Object} data
 */
const editDeliveryOrder = async ({
  params: {
    id,
    deliveryOrder,
  },
  body: {
    date,
  },
}) => {
  await ClientInvoiceModel.updateOne({
    _id: id,
    'deliveryOrders._id': deliveryOrder,
  }, { $set: { 'deliveryOrders.$.date': date } });
};

module.exports = editDeliveryOrder;
