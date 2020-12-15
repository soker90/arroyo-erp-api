const { DeliveryOrderModel } = require('arroyo-erp-models');
const {
  calcData, calcProduct,
} = require('../utils');

/**
 * Añade un nuevo producto al objecto del albarán
 * @param {Object} deliveryOrder
 * @param {Object} product
 * @returns {Object}
 */
const _mergeProduct = (deliveryOrder, product) => {
  deliveryOrder.set('products', [
    ...deliveryOrder.products,
    product,
  ]);

  return deliveryOrder;
};
/**
 * Add product to delivery order
 * @param {String} id
 * @param {String} product
 * @param {Number} price
 * @param {Number} quantity
 * @param {String} canal
 * @return {Promise<void>}
 */
const addProduct = ({
  params: { id }, body: {
    product, price, quantity, canal,
  },
}) => (
  DeliveryOrderModel.findOne({ _id: id })
    .then(async response => {
      const newProduct = await calcProduct({
        product,
        price,
        quantity,
        date: response.date,
        canal,
      });
      return _mergeProduct(response, newProduct);
    })
    .then(calcData)
);

module.exports = addProduct;
