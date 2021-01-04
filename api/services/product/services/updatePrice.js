const { ProductModel } = require('arroyo-erp-models');

/**
 * Edit product
 * @param {Object} params
 * @param {Object} body
 */
const updatePrice = ({
  body: {
    name,
    price,
  },
}) => ProductModel.findOneAndUpdate({ name }, {
  price,
}, {
  new: true,
  upsert: true,
});

module.exports = updatePrice;
