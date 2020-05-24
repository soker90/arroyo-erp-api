const {DeliveryOrderModel} = require('arroyo-erp-models');
const {DeliveryOrderMissingId} = require('../../../errors/delivery-order.errors');
const {yesterdayDate} = require('./utils');
const DeliveryOrderAdapter = require('./deliveryorder.adapter');

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
const orders = async ({provider}) => {
  const data = await DeliveryOrderModel.aggregate([
    {$match: {...(provider && {provider})}},
    {
      $project: {
        _id: 1,
        date: 1,
        // provider: 1,
        size: {$size: '$products'},
        total: {$sum: '$products.total'},
      },
    },
  ]);

  return data;
};

/**
 * Create product
 * @param {number} date
 * @param {string} provider
 */
const create = async ({provider}) => {
  if (!provider) throw new DeliveryOrderMissingId();
  const data = {
    provider,
    date: null,
  };
  const deliveryOrder = await new DeliveryOrderModel(data).save();
  return new DeliveryOrderAdapter(deliveryOrder).standardResponse();
};

/**
 * Edit product
 * @param {Object} params
 * @param {Object} body
 */
const update = async ({params, body: {date, ...rest}}) => {
  if (!params.id) throw new DeliveryOrderMissingId();

  const set = {
    ...(date && {date}),
  };
  return await DeliveryOrderModel.findOneAndUpdate(
    {_id: params.id},
    {$set: set,},
    {new: true,
      fields: {
        ...(date && {date: 1}),
      },});

  /*await DeliveryOrderModel.find({_id: params.id})
    .then(response => {
      response.set('date', date);
      response.set('provider', provider);
      response.set('products', products);
      response.save();
    });*/
};

/**
 * Get data from id
 * @param {string} id
 * @return {Promise<{data: *}>}
 */
const deliveryOrder = async ({id}) => {
  if (!id) throw new DeliveryOrderMissingId();

  const deliveryOrder = await DeliveryOrderModel.findOne({_id: id}).lean();
  return new DeliveryOrderAdapter(deliveryOrder).standardResponse();
};

module.exports = {
  orders,
  create,
  update,
  deliveryOrder,
};
