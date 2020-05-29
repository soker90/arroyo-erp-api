const { DeliveryOrderModel, ProductModel, ProviderModel } = require('arroyo-erp-models');
const { INITIAL_SCHEMA } = require('./constants');
const { DeliveryOrderMissingId, DeliveryOrderProviderNotFound, DeliveryOrderNotFound } = require('../../../errors/delivery-order.errors');
const DeliveryOrderAdapter = require('./deliveryorder.adapter');
const { calcData } = require('./utils');
/**
 * Validate params
 * @param {number} date
 * @param {string} provider
 * @param {string} products
 * @return {Object}
 * @private
 */
const _validateParams = (
  {
    date,
    provider,
    products,
  },
) => {
  if (!date || !provider || !products) throw new DeliveryOrderMissingId();
  return {
    date,
    provider,
    products,
  };
};

/**
 * Return all delivery orders
 * @return {Promise<{data: any}>}
 */
const orders = async ({ provider }) => (
  // eslint-disable-next-line no-return-await
  await DeliveryOrderModel.aggregate([
    { $match: { ...(provider && { provider }) } },
    {
      $project: {
        _id: 1,
        date: 1,
        size: { $size: '$products' },
        total: { $sum: '$products.total' },
      },
    },
  ])
);


/**
 * Create product
 * @param {string} provider
 */
const create = async ({ provider }) => {
  if (!provider) throw new DeliveryOrderMissingId();

  const { name } = await ProviderModel.findOne({ _id: provider });
  if (!name) throw new DeliveryOrderProviderNotFound();

  const data = {
    provider,
    nameProvider: name,
    ...INITIAL_SCHEMA,
  };

  const newDeliveryOrder = await new DeliveryOrderModel(data).save();
  return new DeliveryOrderAdapter(newDeliveryOrder).standardResponse();
};

/**
 * Edit product
 * @param {Object} params
 * @param {Object} body
 */
const update = async ({ params, body: { date } }) => {
  if (!params.id || typeof date !== 'number') throw new DeliveryOrderMissingId();

  const set = {
    ...(date && { date }),
  };
  // eslint-disable-next-line no-return-await
  return await DeliveryOrderModel.findOneAndUpdate(
    { _id: params.id },
    { $set: set },
    {
      new: true,
      fields: {
        ...(date && { date: 1 }),
      },
    },
  );

  /* await DeliveryOrderModel.find({_id: params.id})
    .then(response => {
      response.set('date', date);
      response.set('provider', provider);
      response.set('products', products);
      response.save();
    }); */
};

/**
 * Get data from id
 * @param {string} id
 * @return {Promise<{data: *}>}
 */
const deliveryOrder = async ({ id }) => {
  if (!id) throw new DeliveryOrderMissingId();

  const deliveryOrderData = await DeliveryOrderModel.findOne({ _id: id })
    .lean();

  if (!deliveryOrderData) throw new DeliveryOrderNotFound();
  return new DeliveryOrderAdapter(deliveryOrderData).standardResponse();
};


const addProduct = async ({
  params: { id }, body: {
    product, price, quantity,
  },
}) => {
  const {
    name, amount, iva, re, code, rate,
  } = await ProductModel.findOne({ _id: product });

  const taxBase = quantity * (rate || 1) * price;

  await DeliveryOrderModel.findOne({ _id: id })
    .then(response => {
      response.set('products', [
        ...response.products,
        {
          code,
          product,
          price,
          quantity,
          name,
          taxBase,
          ...(rate && { rate }),
          diff: amount - price,
          iva: taxBase * iva,
          re: taxBase * re,
          total: taxBase * re * iva * (rate || 1),
        },
      ]);
      return response;
    }).then(calcData);
};

module.exports = {
  orders,
  create,
  update,
  deliveryOrder,
  addProduct,
};
