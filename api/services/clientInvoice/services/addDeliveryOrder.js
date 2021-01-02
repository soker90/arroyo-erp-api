const { ClientInvoiceModel } = require('arroyo-erp-models');

/**
 * Create invoice
 * @param {Object} data
 */
const addDeliveryOrder = async ({ id }) => {
  await ClientInvoiceModel.updateOne({
    _id: id,
  }, {
    $push: {
      deliveryOrders: {
        date: null,
        total: 0,
        products: [],
      },
    },
  });
};

module.exports = addDeliveryOrder;
