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

const getProductChanged = (deliveryOrder, index) => {
  if (index)
    return deliveryOrder.products[index];

  return deliveryOrder.products.slice(-1)
    .pop();
};

/**
 * Devuelve el último precio
 * @param product
 * @return {PriceModel}
 */
const getLastPrice = product => PriceModel.find({ product })
  .sort({ date: -1 })
  .limit(1);

const isPriceChanges = (doProduct, lastPrice) => (
  roundNumber(doProduct.price, 3) !== roundNumber(lastPrice?.price, 3)
  && doProduct.price !== 0
);

/**
 * Update price of the product
 * @param {Object} deliveryOrder
 * @param {number} index
 * @return {Promise<void>}
 */
const updatePrice = async ({
  deliveryOrder,
  index,
}) => {
  const doProduct = getProductChanged(deliveryOrder, index);
  const lastPrice = (await getLastPrice(doProduct.product))?.pop?.();

  if (isPriceChanges(doProduct, lastPrice)) {
    logService.logInfo(`[update price] - Actualizando precio de ${doProduct.name} ${doProduct.product}`);

    const cost = roundNumber(doProduct.total / doProduct.quantity);

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
    }, { upsert: true });

    const isNewestOrder = deliveryOrder.date > (lastPrice?.date || 0)
      || deliveryOrder._id.toString() === lastPrice?.deliveryOrder;

    // Actualiza el último precio en el producto
    if (isNewestOrder) {
      await ProductModel.updateOne({ _id: doProduct.product }, {
        price: doProduct.price,
        cost,
      });
    }

    // Añade el nuevo precio a las notificaciones de cambio de precio
    if (doProduct.diff) {
      await PriceChangeModel.updateOne({
        product: doProduct.product,
        deliveryOrder: deliveryOrder._id,
      }, {
        product: doProduct.product,
        productName: doProduct.name,
        price: doProduct.price,
        diff: roundNumber(cost - lastPrice.cost),
        deliveryOrder: deliveryOrder._id,
        date: deliveryOrder.date,
        cost,
      }, { upsert: true });
    }
  }

  return deliveryOrder;
};

module.exports = updatePrice;
