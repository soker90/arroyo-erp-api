const { PriceModel, ProductModel } = require('arroyo-erp-models');
const { roundNumber } = require('../../../../utils');

/**
 * Update price of the product
 * @param {Object} params
 * @param {Object} body
 * @return {Promise<void>}
 */
const updatePrice = async ({ params, body }) => {
  const product = await ProductModel.findOne({ _id: params.id });
  const sale = product.profit
    ? roundNumber((body.cost * product.profit + body.cost))
    : null;

  await new PriceModel({
    date: body.date,
    product: params.id,
    price: body.price,
    cost: body.cost,
    ...(sale && { sale }),
  }).save();
};

module.exports = updatePrice;
