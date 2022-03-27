const { ProductModel } = require('arroyo-erp-models');

/**
 * Edit product
 * @param {Object} params
 * @param {Object} body
 */
const update = ({
  params,
  body: {
    code,
    name,
    rate,
    iva,
    re,
    profit,
    price,
    provider,
  },
}) => ProductModel.findOneAndUpdate({ _id: params.id, provider }, {
  code,
  name,
  ...(rate !== undefined && { rate }),
  ...(iva !== undefined && { iva }),
  ...(re !== undefined && { re }),
  ...(profit !== undefined && { profit }),
  ...(price !== undefined && { price }),
}, { new: true });

module.exports = update;
