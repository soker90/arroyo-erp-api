const { DeliveryOrderModel, ProviderModel } = require('arroyo-erp-models');
const { INITIAL_SCHEMA } = require('./constants');
const {
  DeliveryOrderNotFound,
} = require('../../../errors/delivery-order.errors');
const DeliveryOrderAdapter = require('./deliveryorder.adapter');
const {
  calcData, calcProduct,
} = require('./utils');

const {
  refreshInvoice,
} = require('../invoice/utils');

const orders = require('./services/orders');
/**
 * Create product
 * @param {string} provider
 */
const create = async ({ provider }) => {
  const { name } = await ProviderModel.findOne({ _id: provider });

  const data = {
    provider,
    nameProvider: name,
    ...INITIAL_SCHEMA,
  };

  return new DeliveryOrderModel(data).save();
};

/**
 * Edit delivery order
 * @param {Object} params
 * @param {Object} body
 */
const update = ({ params, body: { date } }) => {
  const set = {
    ...(date && { date }),
  };

  return DeliveryOrderModel.findOneAndUpdate(
    { _id: params.id },
    { $set: set },
    {
      new: true,
      fields: {
        ...(date && { date: 1 }),
      },
    },
  );
};

/**
 * Get data from id
 * @param {string} id
 * @return {Promise<{data: *}>}
 */
const deliveryOrder = async ({ id }) => {
  const deliveryOrderData = await DeliveryOrderModel.findOne({ _id: id })
    .lean();

  if (!deliveryOrderData) throw new DeliveryOrderNotFound();
  return new DeliveryOrderAdapter(deliveryOrderData).standardResponse();
};

/**
 * Add product to delivery order
 * @param {String} id
 * @param {String} product
 * @param {Number} price
 * @param {Number} quantity
 * @return {Promise<void>}
 */
const addProduct = async ({
  params: { id }, body: {
    product, price, quantity,
  },
}) => await DeliveryOrderModel.findOne({ _id: id })
  .then(async response => {
    const newProduct = await calcProduct(product, price, quantity, response.date);
    response.set('products', [
      ...response.products,
      newProduct,
    ]);
    return response;
  })
  .then(calcData)
  .then(refreshInvoice)
  .then(data => new DeliveryOrderAdapter(data).productsResponse());

/**
 * Actualiza un producto del albarán
 * @param {String} id
 * @param {number} index
 * @param {String} product
 * @param {Number} price
 * @param {Number} quantity
 * @return {Promise<void>}
 */
const updateProduct = async ({
  params: { id, index }, body: {
    product, price, quantity,
  },
}) => await DeliveryOrderModel.findOne({ _id: id })
  .then(async response => {
    const productModified = await calcProduct(product, price, quantity, response.date);
    const products = response.products.slice();

    products[index] = productModified;
    response.set('products', products);
    return response;
  })
  .then(calcData)
  .then(refreshInvoice)
  .then(data => new DeliveryOrderAdapter(data).productsResponse());

/**
 * Elimina un producto del albarán
 * @param {String} id
 * @param {number} index
 * @return {Promise<void>}
 */
const deleteProduct = ({
  id, index,
}) => DeliveryOrderModel.findOne({ _id: id })
  .then(response => {
    const { products } = response;

    products.splice(index, 1);
    response.set('products', products);
    return response;
  })
  .then(calcData)
  .then(refreshInvoice)
  .then(data => new DeliveryOrderAdapter(data).productsResponse());

module.exports = {
  orders,
  create,
  update,
  deliveryOrder,
  addProduct,
  updateProduct,
  deleteProduct,
};
