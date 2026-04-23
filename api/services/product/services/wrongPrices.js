/* eslint-disable nonblock-statement-body-position */
const { ProductModel } = require('arroyo-erp-models');
const { PriceModel } = require('arroyo-erp-models/models');

/**
 * Return all products with wrong price or cost compared to last price in history
 * @return {Promise<Array>}
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
    }).sort({ date: -1 }).limit(1);

    // eslint-disable-next-line no-continue
    if (!prices.length) continue;

    const lastPrice = prices[0];

    const wrongPrice = product.price !== lastPrice.price;
    const wrongCost = lastPrice.cost && Math.abs((product.cost || 0) - lastPrice.cost) >= 0.01;

    if (wrongPrice || wrongCost) {
      bads.push({
        provider: product.nameProvider,
        id: product._id,
        goodPrice: lastPrice.price,
        badPrice: product.price,
        goodCost: lastPrice.cost,
        badCost: product.cost,
        wrongPrice,
        wrongCost,
        date: lastPrice.date,
        name: product.name,
      });
    }
  }

  return bads;
};

module.exports = products;
