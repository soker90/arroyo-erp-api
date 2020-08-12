/* eslint-disable nonblock-statement-body-position */
const { ProductModel, PriceModel, ProviderModel } = require('arroyo-erp-models');
const {
  ProductMissingParams, ProductMissingUpdate, ProviderNotFound,
} = require('../../../errors/product.errors');
const { getPricesOfProduct, validateProductId, validateParams } = require('./utils/index');

/**
 * Return all product witch the filter
 * @param {String} provider
 * @return {Promise<{data: any}>}
 */
const products = async ({ provider }) => {
  const filter = {
    ...(provider && { provider }),
  };
  const data = await ProductModel.find(filter, 'name _id code')
    .lean();
  return data;
};

/**
 * Create product
 * @return {Promise<string>}
 */
const create = async product => {
  const data = validateParams(product);
  const provider = await ProviderModel.findOne({ _id: data.provider });

  if (!provider)
    throw new ProviderNotFound();

  await new ProductModel({
    ...data,
    nameProvider: provider.name,
  }).save();
};

/**
 * Edit product
 * @param {Object} params
 * @param {Object} body
 */
const update = async ({ params, body }) => {
  if (!params.id) throw new ProductMissingParams();
  await validateProductId(params.id);

  const data = validateParams(body, true); // TODO adecentar esto...
  return ProductModel.findOneAndUpdate({ _id: params.id }, data, { new: true });
};

/**
 * Return the product
 * @param {string} id
 * @returns {Object}
 */
const product = async ({ id }) => ({
  product: await validateProductId(id),
  prices: await getPricesOfProduct(id),
});

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
