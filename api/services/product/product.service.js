const { ProductModel } = require('arroyo-erp-models');
const { ProductMissingParams } = require('../../../errors/product.errors');

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
 * @param {string} provider
 * @param {number} amount
 * @param {number} iva
 * @param {number} re
 * @return {Promise<string>}
 */
const create = async ({
  code,
  name,
  provider,
  amount,
  iva,
  re,
}) => {
  if (!code || !name || !provider || !amount || !iva || !re) throw new ProductMissingParams();

  await new ProductModel({
    code,
    name,
    provider,
    amount,
    iva,
    re,
  }).save();

  return 'El producto se ha creado correctamente.';
};

module.exports = {
  products,
  create,
};
