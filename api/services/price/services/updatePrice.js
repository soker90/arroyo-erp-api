/* eslint-disable nonblock-statement-body-position */
const {
  PriceModel,
  ProductModel,
  PriceChangeModel,
} = require('arroyo-erp-models');

const LogService = require('../../log.service');

const TYPE = 'PriceService';

const logService = new LogService(TYPE);
const { roundNumber } = require('../../../../utils');

/**
 * Update price of the product
 * @param {Object} deliveryOrder
 * @return {Promise<void>}
 */
const updatePrice = async deliveryOrder => {
  const doProduct = deliveryOrder.products.slice(-1)
    .pop();
  const productData = await ProductModel.findOne({ _id: doProduct.product });

  const cost = roundNumber(doProduct.total / doProduct.quantity);

  const sale = productData.profit
    ? roundNumber(cost * productData.profit + cost)
    : undefined;

  if (doProduct.price !== productData.price) {
    logService.logInfo(`[update price] - Actualizando precio de ${doProduct.name} ${doProduct.product}`);
    // Añade el precio a la collection de precios
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

    // Actualiza el último precio en el producto
    await ProductModel.updateOne({ _id: doProduct.product }, {
      price: doProduct.price,
      cost,
      ...(sale && { sale }),
    });

    // Añade el nuevo precio a las notificaciones de cambio de precio
    await new PriceChangeModel({
      product: doProduct.product,
      productName: doProduct.name,
      price: doProduct.price,
      diff: doProduct.diff,
      deliveryOrder: deliveryOrder._id,
      date: deliveryOrder.date,
    }).save();
  }
};

module.exports = updatePrice;
