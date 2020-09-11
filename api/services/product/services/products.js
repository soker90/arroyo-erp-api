/* eslint-disable nonblock-statement-body-position */
const { ProductModel } = require('arroyo-erp-models');

/**
 * Return all product witch the filter
 * @param {String} provider
 * @return {Promise<{data: any}>}
 */
const products = ({ provider }) => {
  const filter = {
    ...(provider && { provider }),
  };

  return ProductModel
    .find(filter)
    .select('_id name code price cost sale')
    .lean();
};

module.exports = products;
