const { DeliveryOrderModel } = require('arroyo-erp-models');
const {
  calcData,
} = require('../utils');

/**
 * Delete element from products array
 * @param {Object} deliveryOrder
 * @param {Number} index
 * @returns {Object}
 * @private
 */
const _deleteProduct = (deliveryOrder, index) => {
  const products = deliveryOrder.products.slice();
  products.splice(index, 1);
  deliveryOrder.set('products', products);

  return deliveryOrder;
};

/**
 * Elimina un producto del albarán
 * @param {String} id
 * @param {number} index
 * @return {Promise<void>}
 */
const deleteProduct = ({
  id, index,
}) => (
  DeliveryOrderModel.findOne({ _id: id })
    .then(response => _deleteProduct(response, index))
    .then(calcData)
);

module.exports = deleteProduct;
