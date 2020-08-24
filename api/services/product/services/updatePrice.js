const { PriceModel } = require('arroyo-erp-models');

/**
 * Update price of the product
 * @param {Object} params
 * @param {Object} body
 * @return {Promise<void>}
 */
const updatePrice = ({ params, body }) => (
  new PriceModel({
    date: body.date,
    product: params.id,
    price: body.price,
  }).save()
);

module.exports = updatePrice;
