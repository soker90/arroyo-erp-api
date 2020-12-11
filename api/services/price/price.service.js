/* eslint-disable nonblock-statement-body-position */
const {
  PriceModel,
  ProductModel,
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
  logService.logInfo('[create note] - Creando note');
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
  }
};

module.exports = {
  updatePrice,
};
