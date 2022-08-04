const { DeliveryOrderModel } = require('arroyo-erp-models');

/**
 * Get last delivery order for a product
 * @param {string} productId
 */
const lastProductViewer = ({ id }) => DeliveryOrderModel.find(
  { 'products.product': id },
)
  .sort({ date: -1 })
  .limit(2)
  .then(deliveryOrders => ({
    last: deliveryOrders?.[0]?._id,
    nextToLast: deliveryOrders?.[1]?._id,
  }));

module.exports = lastProductViewer;
