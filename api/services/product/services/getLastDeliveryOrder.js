const { DeliveryOrderModel } = require('arroyo-erp-models');

/**
 * Get last delivery order for a product
 * @param {string} productId
 */
const lastProductViewer = ({ id }) => DeliveryOrderModel.findOne(
  { 'products.product': id },
).sort({ date: -1 }).then(({ _id }) => ({ deliveryOrder: _id }));

module.exports = lastProductViewer;
