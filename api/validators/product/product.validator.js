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
const validateId = ({ id }) => _checkId(id);
const validateIdParam = ({ params }) => validateId(params);
const validateProductBody = ({ body: { product } }) => _checkId(product);

/**
 * Validate params
 * @param {number} code
 * @param {string} name
 * @param {string} provider
 * @param {number} fee
 * @param {number} iva
 * @param {number} re
 * @param {boolean} isUpdate
 * @return {Object}
 * @private
 */
const validateFields = ({
  name,
  iva,
  re,
}) => {
  if (!name || !iva || !re) throw new productErrors.ProductMissingParams();
};

module.exports = {
  validateProductBody,
  validateFields,
  validateIdParam,
  validateId,
};
