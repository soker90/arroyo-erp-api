/* eslint-disable nonblock-statement-body-position */
const { ProductModel } = require('arroyo-erp-models');

/**
 * Return all product witch the filter
 * @param {String} provider
 * @return {Promise<{data: any}>}
 */
const products = ({ provider }) => {
  const filter = {
    provider: provider || { $exists: false },
  };

  return ProductModel
    .find(filter)
    .select('_id name code price cost sale price')
    .sort({
      code: 1,
      name: 1,
    })
    .lean();
};

module.exports = products;
