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
};

module.exports = {
  calcData,
};
