const { ClientInvoiceModel } = require('arroyo-erp-models');

/**
 * Create invoice
 * @param {Object} data
 */
const addDeliveryOrder = ({ id }) => ClientInvoiceModel.findOneAndUpdate({
  _id: id,
}, {
  $push: {
    deliveryOrders: {
      date: null,
      total: 0,
      products: [],
    },
  },
}, { new: true });

module.exports = addDeliveryOrder;
