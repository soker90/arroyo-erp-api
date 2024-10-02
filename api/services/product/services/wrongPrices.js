/* eslint-disable nonblock-statement-body-position */
const { ProductModel } = require('arroyo-erp-models');
const { PriceModel } = require('arroyo-erp-models/models');

/**
 * TEMPORAL CHECKS FOR PRICES PRODUCTS
 */
/**
 * Return all wrong prirces of products
 * @return {Promise<{data: any}>}
 */
const products = async () => {
  const prods = await ProductModel.find({ provider: { $exists: true } }).collation({
    locale: 'es',
    numericOrdering: true,
  }).sort({
    provider: 1,
  })
    .lean();

  const prodsFilters = prods.filter(p => Boolean(p.provider));

  const bads = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const product of prodsFilters) {
    // eslint-disable-next-line no-await-in-loop
    const prices = await PriceModel.find({
      product: product._id,
    }).sort({ date: 1 });

    // eslint-disable-next-line no-continue
    if (!prices.length) continue;

    const lastPrice = prices[prices.length - 1];

    if (product.price !== lastPrice.price) {
      const info = {
        provider: product.nameProvider,
        id: product._id,
        goodPrice: lastPrice.price,
        badPrice: product.price,
        date: lastPrice.date,
        name: product.name,
      };

      bads.push(info);
    }
  }

  return bads;
};

module.exports = products;
