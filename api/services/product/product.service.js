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
}) => {
  if (!code || !name || !amount || !iva || !re) throw new ProductMissingParams();
  return {
    code,
    name,
    amount,
    iva,
    re,
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
  return { data };
};

/**
 * Create product
 * @param {number} code
 * @param {string} name
 * @param {number} amount
 * @param {number} iva
 * @param {number} re
 * @return {Promise<string>}
 */
const create = async ({
  code,
  name,
  amount,
  iva,
  re,
}) => {
  const data = _validateParams({
    code,
    name,
    amount,
    iva,
    re,
  });

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
  await ProductModel.findOneAndUpdate({ _id: params.id }, { $set: data }).leans();
};

module.exports = {
  products,
  create,
  update,
};
