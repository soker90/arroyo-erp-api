/* eslint-disable nonblock-statement-body-position */
const { PriceModel } = require('arroyo-erp-models');
const {
  ProductMissingUpdate,
} = require('../../../errors/product.errors');
const { validateProductId } = require('./utils/index');

const products = require('./services/products');
const create = require('./services/create');
const update = require('./services/update');
const product = require('./services/products');

/**
 * Update price of the product
 * @param {Object} params
 * @param {Object} body
 * @return {Promise<void>}
 */
const updatePrice = async ({ params, body }) => {
  if (!body.price || typeof body.price !== 'number' || !body.date || typeof body.date !== 'number')
    throw new ProductMissingUpdate();

  await validateProductId(params.id);

  await new PriceModel({
    date: body.date,
    product: params.id,
    price: body.price,
  }).save();
};

module.exports = {
  products,
  create,
  update,
  updatePrice,
  product,
};
