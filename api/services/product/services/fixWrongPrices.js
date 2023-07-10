const { ProductModel } = require('arroyo-erp-models');
const wrongPrices = require('./wrongPrices');

/**
 * Return all wrong prirces of products
 * @return {Promise<{data: any}>}
 */
const fixPrices = async () => {
  // throw new Error('Not implemented');
  const wrongPricesProducts = await wrongPrices();
  // eslint-disable-next-line max-len
  const promises = wrongPricesProducts.map(product => ProductModel.updateOne({ _id: product.id }, { price: product.goodPrice }));

  return Promise.all(promises);
};

module.exports = fixPrices;
