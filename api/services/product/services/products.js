/* eslint-disable nonblock-statement-body-position */
const { ProductModel, PriceModel } = require('arroyo-erp-models');

/**
 * Return all product witch the filter
 * @param {String} provider
 * @return {Promise<{data: any}>}
 */
const products = async ({ provider }) => {
  const filter = {
    ...(provider && { provider }),
  };

  const productsData = await ProductModel
    .find(filter)
    .select('_id name code')
    .lean();

  for (const product of productsData) {
    product.price = await PriceModel.findOne({ product: product._id })
      .sort({ date: -1 });
  }

  return productsData;
};

module.exports = products;
