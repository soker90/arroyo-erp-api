const { DeliveryOrderModel } = require('arroyo-erp-models');
const DeliveryOrderAdapter = require('./deliveryorder.adapter');
const {
  calcData, calcProduct,
} = require('./utils');

const {
  refreshInvoice,
} = require('../invoice/utils');

const orders = require('./services/orders');
const create = require('./services/create');
const update = require('./services/update');

/**
 * Get data from id
 * @param {string} id
 * @return {Promise<{data: *}>}
 */
const deliveryOrder = async ({ id }) => DeliveryOrderModel.findOne({ _id: id });

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
