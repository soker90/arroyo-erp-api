const { ProductMissingParams } = require('../../../../errors/product.errors');

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
const validateParams = ({
  code,
  name,
  rate,
  iva,
  re,
  provider,
}, isUpdate = false) => {
  if (!name || !(provider || isUpdate) || !iva || !re) throw new ProductMissingParams();

  return {
    code,
    name,
    ...(rate && { rate }),
    iva,
    re,
    ...(provider && { provider }),
  };
};

module.exports = validateParams;
