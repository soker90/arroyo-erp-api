const { ProductModel } = require('arroyo-erp-models');
const { productErrors } = require('../../../errors');

/**
 * Check if exist id
 * @param {String} id
 * @returns {Promise<void>}
 */
const _checkId = async id => {
  const productExist = await ProductModel.exists({ _id: id });
  if (!productExist) throw new productErrors.ProductNotFound();
};

/**
 * Check if exist id
 * @param {String} id
 * @returns {Promise<void>}
 */
// const validateId = ({ id }) => _checkId(id);
// const validateIdParam = ({ params }) => validateId(params);
const validateProductBody = ({ body: { product } }) => _checkId(product);

module.exports = {
  validateProductBody,
};
