const {
  ProductModel,
  PriceModel,
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

  deliveryOrder.set('iva', roundNumber(ivaDO, 2));
  deliveryOrder.set('re', roundNumber(reDO, 2));
  deliveryOrder.set('total', totalDO);
  deliveryOrder.set('taxBase', taxBaseDO);
  deliveryOrder.set('rate', roundNumber(rateDO, 3));
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
const calcProduct = async (product, price, quantity, date) => {
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
  const taxBase = roundNumber(quantity * price + rateCalc, 2);
  const ivaTotal = roundNumber(taxBase * iva, 2);
  const reTotal = roundNumber(taxBase * re, 2);

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

module.exports = {
  calcData,
  calcProduct,
};
