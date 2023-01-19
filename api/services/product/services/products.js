/* eslint-disable nonblock-statement-body-position */
const { ProductModel } = require('arroyo-erp-models');
const { PriceModel } = require('arroyo-erp-models/models');

/**
 * Return all product witch the filter
 * @param {String} provider
 * @return {Promise<{data: any}>}
 */
const products = async ({ provider }) => {
  const filter = (provider && { provider })
    || { $or: [{ provider: { $exists: false } }, { provider: null }] };

  const prod = await ProductModel.find({ provider: { $exists: true } }).collation({
    locale: 'es',
    numericOrdering: true,
  }).sort({
    provider: 1,
  })
    .lean();

  const malos = [];
  for (let i = 0; i < prod.length - 1; i++) {
    const product = prod[i];
    // eslint-disable-next-line no-await-in-loop
    const prices = await PriceModel.find({
      product: product._id,
    }).sort({ date: 1 });

    if (!prices.length) continue;

    const lastPrice = prices[prices.length - 1];
    const newP = {
      provider: product.nameProvider,
      product: product._id,
      price: lastPrice.price,
      date: lastPrice.date,
      name: product.name,
    };

    if (product.price !== newP.price)
      malos.push(`Proveedor: ${newP.provider}, Producto: ${newP.name}, Precio malo: ${product.price}, Precio Bueno: ${lastPrice.price}, id: ${newP.product}`);
  }

  return malos;

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
