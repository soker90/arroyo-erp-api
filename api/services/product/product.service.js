/* eslint-disable nonblock-statement-body-position */
const { ProductModel, PriceModel } = require('arroyo-erp-models');
const { ProductMissingParams, ProductMissingUpdate, ProductNotFound } = require('../../../errors/product.errors');

/**
 * Validate params
 * @param {number} code
 * @param {string} name
 * @param {string} provider
 * @param {number} fee
 * @param {number} iva
 * @param {number} re
 * @return {Object}
 * @private
 */
const _validateParams = ({
  code,
  name,
  rate,
  iva,
  re,
  provider,
  historicPrice,
}) => {
  if (!code || !name || !provider || !iva || !re)
    throw new ProductMissingParams();
  return {
    code,
    name,
    ...(rate && { rate }),
    iva,
    re,
    provider,
    ...(historicPrice && { historicPrice }),
  };
};

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
  const data = _validateParams(product);

  await new ProductModel(data).save();
};

/**
 * Edit product
 * @param {Object} params
 * @param {Object} body
 */
const update = async ({ params, body }) => {
  if (!params.id) throw new ProductMissingParams();

  const data = _validateParams(body);
  await ProductModel.findOneAndUpdate({ _id: params.id }, { $set: data })
    .leans();
};

/**
 * Validate if existe id
 * @param {string} id
 * @return {Promise<void>}
 * @private
 */
const _validateProductId = async id => {
  let product;
  try {
    product = await ProductModel.findOne({ _id: id });
  } catch (e) {
    throw new ProductNotFound();
  }
  if (!product)
    throw new ProductNotFound();
};

/**
 * Update price of the product
 * @param {Object} params
 * @param {Object} body
 * @return {Promise<void>}
 */
const updatePrice = async ({ params, body }) => {
  if (!body.price || typeof body.price !== 'number') throw new ProductMissingUpdate();

  await _validateProductId(params.id);

  await new PriceModel({
    date: Date.now(),
    product: params.id,
    price: body.price,
  }).save();
};

module.exports = {
  products,
  create,
  update,
  updatePrice,
};
