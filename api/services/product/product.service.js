const { ProductModel } = require('arroyo-erp-models');
const { ProductMissingParams } = require('../../../errors/product.errors');

/**
 * Validate params
 * @param {number} code
 * @param {string} name
 * @param {string} provider
 * @param {number} amount
 * @param {number} iva
 * @param {number} re
 * @return {Object}
 * @private
 */
const _validateParams = ({
  code,
  name,
  amount,
  iva,
  re,
  provider,
}) => {
  if (!code || !name || !provider || !amount || !iva || !re) throw new ProductMissingParams();
  return {
    code,
    name,
    amount,
    iva,
    re,
    provider,
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

module.exports = {
  products,
  create,
  update,
};
