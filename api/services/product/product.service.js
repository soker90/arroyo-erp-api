/* eslint-disable nonblock-statement-body-position */

const products = require('./services/products');
const create = require('./services/create');
const update = require('./services/update');
const product = require('./services/product');
const createForClients = require('./services/createForClients');
const updatePrice = require('./services/updatePrice');
const deleteProduct = require('./services/delete');
const getLastDeliveryOrder = require('./services/getLastDeliveryOrder');

module.exports = {
  products,
  create,
  update,
  product,
  createForClients,
  updatePrice,
  delete: deleteProduct,
  getLastDeliveryOrder,
};
