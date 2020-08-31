const { ProductModel } = require('arroyo-erp-models');

/**
 * Edit product
 * @param {Object} params
 * @param {Object} body
 */
const update = ({
  params, body: {
    code, name, rate, iva, re, profit,
  },
}) => ProductModel.findOneAndUpdate({ _id: params.id }, {
  code,
  name,
  ...(rate && { rate }),
  iva,
  re,
  profit,
}, { new: true });

module.exports = update;
