const { ProductModel } = require('arroyo-erp-models');
const wrongPrices = require('./wrongPrices');

/**
 * Fix all products with wrong price or cost
 * @return {Promise<void>}
 */
const fixPrices = async () => {
  const wrongPricesProducts = await wrongPrices();
  const promises = wrongPricesProducts.map(product => ProductModel.updateOne(
    { _id: product.id },
    {
      ...(product.wrongPrice && { price: product.goodPrice }),
      ...(product.wrongCost && { cost: product.goodCost }),
    }
  ));

  return Promise.all(promises);
};

module.exports = fixPrices;
