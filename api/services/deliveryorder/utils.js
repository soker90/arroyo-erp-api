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
  let taxBaseDO = 0;
  let rateDO = 0;

  deliveryOrder.products.forEach(({
    iva, re, taxBase, rate,
  }) => {
    ivaDO += iva;
    reDO += re;
    taxBaseDO += taxBase;
    if (rate) rateDO += rate;
  });

  ivaDO = roundNumber(ivaDO, 2);
  reDO = roundNumber(reDO, 2);
  taxBaseDO = roundNumber(taxBaseDO, 2);
  const totalDO = ivaDO + reDO + taxBaseDO;

  deliveryOrder.set('iva', roundNumber(ivaDO, 2));
  deliveryOrder.set('re', roundNumber(reDO, 2));
  deliveryOrder.set('total', totalDO);
  deliveryOrder.set('taxBase', roundNumber(taxBaseDO, 2));
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
 * @param {String} canal
 * @return {Promise<{product: *, total: number, code: *, quantity: number, re: number,
 * iva: number, price: number, name: *, diff: number, taxBase: number}>}
 */
const calcProduct = async ({
  product,
  price,
  quantity,
  date,
  canal,
}) => {
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

  const rateCalc = rate ? (rate * quantity) : 0;
  const taxBase = quantity * price + rateCalc;
  const ivaTotal = taxBase * iva;
  const reTotal = taxBase * re;

  return {
    _id,
    code,
    product,
    price: Number(price),
    quantity: Number(quantity),
    name,
    ...(canal !== undefined && { canal }),
    taxBase,
    ...(rate && { rate: rateCalc }),
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
