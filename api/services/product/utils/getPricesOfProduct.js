const { PriceModel } = require('arroyo-erp-models');

/**
 * Get dates and prices of the product
 * @param product
 * @returns {*|Promise<void>|PromiseLike<any>|Promise<any>}
 */
const getPricesOfProduct = product => PriceModel.find({ product })
  .then(prices => prices.map(({ date, price }) => ({
    date,
    price,
  })));

module.exports = getPricesOfProduct;
