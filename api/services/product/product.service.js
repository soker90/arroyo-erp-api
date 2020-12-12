/* eslint-disable nonblock-statement-body-position */

const products = require('./services/products');
const create = require('./services/create');
const update = require('./services/update');
const product = require('./services/product');

module.exports = {
  products,
  create,
  update,
  product,
};
