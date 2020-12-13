/* eslint-disable nonblock-statement-body-position */
const {
  PriceModel,
  ProductModel,
  DeliveryOrderModel,
  PriceChangeModal,
} = require('arroyo-erp-models');

const LogService = require('../log.service');

const TYPE = 'PriceService';

const logService = new LogService(TYPE);
const { roundNumber } = require('../../../utils');

/**
 * Update price of the product
 * @param {Object} deliveryOrder
 * @return {Promise<void>}
 */
const updatePrice = async deliveryOrder => {
  logService.logInfo('[create note] - Actualizando precio');
  const doProduct = deliveryOrder.products.slice(-1)
    .pop();
  const productData = await ProductModel.findOne({ _id: doProduct.product });

  const cost = roundNumber(doProduct.total / doProduct.quantity);

  const sale = productData.profit
    ? roundNumber(cost * productData.profit + cost)
    : undefined;

  if (doProduct.price !== productData.price) {
    await PriceModel.updateOne({
      product: doProduct.product,
      deliveryOrder: deliveryOrder._id,
    }, {
      deliveryOrder: deliveryOrder._id,
      date: deliveryOrder.date,
      product: doProduct.product,
      price: doProduct.price,
      cost,
      ...(sale && { sale }),
    }, { upsert: true });

    await ProductModel.updateOne({ _id: doProduct.product }, {
      price: doProduct.price,
      cost,
      ...(sale && { sale }),
    });

    await new PriceChangeModal({
      product: doProduct.product,
      productName: doProduct.name,
      price: doProduct.price,
      diff: doProduct.diff,
      deliveryOrder: deliveryOrder._id,
      date: deliveryOrder.date,
    }).save();
  }
};

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
      sale: lastPrice?.sale,
    });
  }
};

module.exports = {
  updatePrice,
  deletePrice,
};
