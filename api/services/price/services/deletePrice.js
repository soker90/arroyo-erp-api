/* eslint-disable nonblock-statement-body-position */
const {
  PriceModel,
  ProductModel,
  DeliveryOrderModel,
} = require('arroyo-erp-models');

const deletePrice = async ({
  id,
  index,
}) => {
  const deliveryOrder = await DeliveryOrderModel.findOne({ _id: id });
  const productId = deliveryOrder?.products?.[index]?.product;
  const deleted = await PriceModel.deleteOne({
    product: productId,
    deliveryOrder: id,
  });
  if (deleted.deletedCount) {
    const prices = await PriceModel.find({ product: productId })
      .sort({ nOrder: -1 })
      .limit(1);
    const lastPrice = prices?.[0];
    await ProductModel.updateOne({ _id: productId }, {
      price: lastPrice?.price,
      cost: lastPrice?.cost,
    });
  }
};

module.exports = deletePrice;
