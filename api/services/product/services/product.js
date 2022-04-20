/* eslint-disable nonblock-statement-body-position */
const {
  PriceModel,
  ProductModel,
} = require('arroyo-erp-models');

/**
 * Get dates and prices of the product
 * @param product
 * @returns {*|Promise<void>|PromiseLike<any>|Promise<any>}
 */
const _getPricesOfProduct = product => PriceModel.find({ product })
  .sort({ date: -1 })
  .limit(25)
  .then(prices => prices.map(({
    date,
    price,
    cost,
    sale,
    deliveryOrder,
    invoice,
  }) => ({
    date,
    price,
    cost,
    sale,
    deliveryOrder,
    invoice,
  })));

/**
 * Return the product
 * @param {string} id
 * @returns {Object}
 */
const product = async ({ id }) => ({
  product: await ProductModel.findOne({ _id: id }),
  prices: await _getPricesOfProduct(id),
});

module.exports = product;
