const { ProductModel } = require('arroyo-erp-models');
const { ProductNotFound } = require('../../../../errors/product.errors');

/**
 * Validate if existe id
 * @param {string} id
 * @return {Promise<void>}
 * @private
 */
const validateProductId = async id => {
  const product = await ProductModel.findOne({ _id: id });
  if (!product) throw new ProductNotFound();

  return product;
};

module.exports = validateProductId;
