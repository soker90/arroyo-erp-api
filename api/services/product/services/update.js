const { ProductModel, PriceModel } = require('arroyo-erp-models');
const { roundNumber } = require('../../../../utils');

/**
 * Devuelve el último precio
 * @param product
 * @return {PriceModel}
 */
const getLastPrice = product => PriceModel.find({ product })
  .sort({ date: -1 })
  .limit(1);

/**
 * Añade el nuevo precio de coste al histórico de precios del producto
 * @param product
 * @returns {Promise<number | void>}
 */
const addPrice = async ({
  rate, price, iva, re, id,
}) => {
  const lastPrice = (await getLastPrice(id))?.pop();
  if (!lastPrice || !lastPrice.cost) return;

  const taxBase = price + (rate || 0);
  const ivaTotal = taxBase * iva;
  const reTotal = taxBase * re;
  const cost = roundNumber(taxBase + ivaTotal + reTotal);

  if (lastPrice.cost === cost) return;

  await PriceModel.create({
    product: lastPrice.product,
    date: Date.now(),
    price: lastPrice.price,
    cost,
    deliveryOrder: lastPrice.deliveryOrder,
    invoice: lastPrice.invoice,
  });

  // eslint-disable-next-line consistent-return
  return cost;
};

/**
 * Edit product
 * @param {Object} params
 * @param {Object} body
 */
const update = async ({
  params,
  body: {
    code,
    name,
    rate,
    iva,
    re,
    sale,
    price,
    provider,
  },
}) => {
  const product = await ProductModel.findOneAndUpdate({ _id: params.id, provider }, {
    code,
    name,
    ...(rate !== undefined && { rate }),
    ...(iva !== undefined && { iva }),
    ...(re !== undefined && { re }),
    ...(sale !== undefined && { sale }),
    ...(price !== undefined && { price }),
  }, { new: true });

  const cost = await addPrice(product);

  if (!cost) return product;

  return await ProductModel.findOneAndUpdate({ _id: params.id, provider }, {
    cost,
  }, { new: true });
};

module.exports = update;
