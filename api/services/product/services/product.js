/* eslint-disable nonblock-statement-body-position */
const {
  PriceModel,
  ProductModel,
  ProductPvpModel,
} = require('arroyo-erp-models');

/**
 * Get dates and prices of the product
 * @param product
 * @returns {*|Promise<void>|PromiseLike<any>|Promise<any>}
 */
const _getPricesOfProduct = product => PriceModel.find({ product }, 'date price cost deliveryOrder invoice')
  .sort({ date: -1 })
  .limit(25);

const _getPriceSaleOfProduct = product => ProductPvpModel.find({ product }, 'date price')
  .sort({ date: -1 })
  .limit(25)
  .exec();
/**
 * Return the product
 * @param {string} id
 * @returns {Object}
 */
const product = async ({ id }) => ({
  product: await ProductModel.findOne({ _id: id }),
  prices: await _getPricesOfProduct(id),
  pvps: await _getPriceSaleOfProduct(id),
});

module.exports = product;
