const { ProductModel } = require('arroyo-erp-models');

/**
 * Calcula los totales del albarán
 * @param deliveryOrder
 */
const calcData = deliveryOrder => {
  const size = deliveryOrder.products.length;
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

  deliveryOrder.set('size', size);
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
 * @param {string | number} price
 * @param {string | number} quantity
 * @return {Promise<{product: *, total: number, code: *, quantity: number, re: number,
 * iva: number, price: number, name: *, diff: number, taxBase: number}>}
 */
const calcProduct = async (product, price, quantity) => {
  const {
    name, historicPrice, iva, re, code, rate,
  } = await ProductModel.findOne({ _id: product });

  const taxBase = quantity * (rate || 1) * price;
  const ivaTotal = taxBase * iva;
  const reTotal = taxBase * re;

  return {
    code,
    product,
    price: Number(price),
    quantity: Number(quantity),
    name,
    taxBase,
    ...(rate && { rate }),
    diff: historicPrice - price,
    iva: ivaTotal,
    re: reTotal,
    total: taxBase + reTotal + ivaTotal + (rate || 0),
  };
};

module.exports = {
  calcData,
  calcProduct,
};
