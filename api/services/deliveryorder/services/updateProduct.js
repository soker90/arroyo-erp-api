const { DeliveryOrderModel } = require('arroyo-erp-models');

const {
  calcData, calcProduct,
} = require('../utils');

/**
 * Modifica el albarán y reemplaza un producto dado
 * @param {Object} deliveryOrder
 * @param {Object} product
 * @param {number} index
 * @returns {Object}
 * @private
 */
const _replaceProduct = (deliveryOrder, product, index) => {
  const products = deliveryOrder.products.slice();

  products[index] = product;
  deliveryOrder.set('products', products);
  return deliveryOrder;
};

/**
 * Actualiza un producto del albarán
 * @param {String} id
 * @param {number} index
 * @param {String} product
 * @param {Number} price
 * @param {Number} quantity
 * @param {String} canal
 * @return {Promise<void>}
 */
const updateProduct = ({
  params: { id, index }, body: {
    product, price, quantity, canal,
  },
}) => (
  DeliveryOrderModel.findOne({ _id: id })
    .then(async response => {
      const productModified = await calcProduct({
        product,
        price,
        quantity,
        date: response.date,
        canal,
      });
      return _replaceProduct(response, productModified, index);
    })
    .then(calcData)
);

module.exports = updateProduct;
