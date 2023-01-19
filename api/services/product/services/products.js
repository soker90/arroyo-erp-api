/* eslint-disable nonblock-statement-body-position */
const { ProductModel } = require('arroyo-erp-models');

/**
 * Return all product witch the filter
 * @param {String} provider
 * @return {Promise<{data: any}>}
 */
const products = ({ provider }) => {
  const filter = (provider && { provider })
    || { $or: [{ provider: { $exists: false } }, { provider: null }] };

  return ProductModel
    .find(filter)
    .select('_id name code price cost sale price iva')
    .collation({
      locale: 'es',
      numericOrdering: true,
    })
    .sort({
      code: 1,
      name: 1,
    })
    .lean();
};

module.exports = products;
