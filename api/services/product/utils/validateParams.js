const { ProductMissingParams } = require('../../../../errors/product.errors');

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
const validateParams = ({
  code,
  name,
  rate,
  iva,
  re,
  provider,
  historicPrice,
}) => {
  if (!code || !name || !provider || !iva || !re) throw new ProductMissingParams();

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

module.exports = validateParams;
