const {
  ProductModel,
  PriceModel,
  DeliveryOrderModel,
} = require('arroyo-erp-models');

const { roundNumber } = require('../../../utils');

/**
 * Calcula los totales del albarán
 * @param deliveryOrder
 */
const calcData = deliveryOrder => {
  let ivaDO = 0;
  let reDO = 0;
  let totalDO = 0;
  let taxBaseDO = 0;
  let rateDO = 0;

  deliveryOrder.products.forEach(({
    iva, re, total, taxBase, rate,
  }) => {
    ivaDO += iva;
    reDO += re;
    totalDO += total;
    taxBaseDO += taxBase;
    if (rate) rateDO += rate;
  });

  deliveryOrder.set('iva', ivaDO);
  deliveryOrder.set('re', reDO);
  deliveryOrder.set('total', totalDO);
  deliveryOrder.set('taxBase', taxBaseDO);
  deliveryOrder.set('rate', rateDO);
  deliveryOrder.save();
  return deliveryOrder;
};

/**
 * Calcula los datos de un producto del albarán
 * @param {string} product
 * @param {number} price
 * @param {number} quantity
 * @param {Number} date
 * @return {Promise<{product: *, total: number, code: *, quantity: number, re: number,
 * iva: number, price: number, name: *, diff: number, taxBase: number}>}
 */
const calcProduct = async (product, price, quantity, date = 0) => {
  const {
    name, iva, re, code, rate, _id,
  } = await ProductModel.findOne({
    _id: product,
  });

  const prices = await PriceModel.find({
    product,
    date: {
      $gt: 0,
      $lt: date,
    },
  })
    .sort({ date: -1 });
  const lastPrice = prices.length ? prices[0].price : null;

  const rateCalc = rate ? roundNumber(rate * quantity) : 0;
  const taxBase = roundNumber(quantity * price + rateCalc);
  const ivaTotal = roundNumber(taxBase * iva);
  const reTotal = roundNumber(taxBase * re);

  return {
    _id,
    code,
    product,
    price: Number(price),
    quantity: Number(quantity),
    name,
    taxBase,
    ...(rate && { rate }),
    ...(lastPrice !== null && { diff: price - lastPrice }),
    iva: ivaTotal,
    re: reTotal,
    total: taxBase + ivaTotal + reTotal,
  };
};

/**
 * Get all free delivery orders for one provider
 * @param {String} provider
 * @return {Object}
 */
const getFreeDeliveryOrders = async provider => {
  const freeOrders = await DeliveryOrderModel.find({
    provider,
    invoice: { $exists: false },
  })
    .lean();

  // TODO to adapter
  return freeOrders.map(({
    _id, date, taxBase, products,
  }) => ({
    _id,
    date,
    taxBase,
    products: products.map(
      ({
        name, price, quantity, taxBase: totalProduct,
      }) => ({
        name,
        price,
        quantity,
        taxBase: totalProduct,
      }),
    ),
  }));
};

/**
 * Get all free delivery orders for one provider
 * @param {String} provider
 * @param {Number} offset
 * @param {Number} limit
 * @return {Promise<{data: *, count: *}>}
 */
const getInInvoicesDeliveryOrders = async (provider, offset, limit) => {
  const inInvoicesOrders = await DeliveryOrderModel.find({
    provider,
    invoice: { $exists: true },
  })
    .skip(0)
    .limit(10)
    .lean();

  const data = inInvoicesOrders.map(
    ({
      _id, date, total, nOrder, nInvoice,
    }) => ({
      _id,
      date,
      total,
      nOrder,
      nInvoice,
    }),
  );

  const count = await DeliveryOrderModel.find({
    provider,
    nOrder: { $exists: true },
  })
    .countDocuments();

  return {
    count,
    data,
  };
};

module.exports = {
  calcData,
  calcProduct,
  getFreeDeliveryOrders,
  getInInvoicesDeliveryOrders,
};
