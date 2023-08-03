const {
  ClientInvoiceModel,
  PriceModel,
} = require('arroyo-erp-models');

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
    date = undefined,
  },
}) => {
  await ClientInvoiceModel.updateOne({
    _id: id,
    'deliveryOrders._id': deliveryOrder,
  }, { $set: { 'deliveryOrders.$.date': date } });
  await PriceModel.updateMany({
    invoice: id,
    deliveryOrder,
  }, { $set: { date } });
};

module.exports = editDeliveryOrder;
