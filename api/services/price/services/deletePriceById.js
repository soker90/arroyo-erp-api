const {
  PriceModel,
  ProductModel,
} = require('arroyo-erp-models');

const deletePriceById = async ({
  id,
  priceId,
}) => {
  await PriceModel.deleteOne({ _id: priceId, product: id });

  const prices = await PriceModel.find({ product: id })
    .sort({ nOrder: -1 })
    .limit(1);
  const lastPrice = prices?.[0];
  await ProductModel.updateOne({ _id: id }, {
    price: lastPrice?.price,
    cost: lastPrice?.cost,
  });
};

module.exports = deletePriceById;
