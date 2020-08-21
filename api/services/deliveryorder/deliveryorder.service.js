const { DeliveryOrderModel } = require('arroyo-erp-models');

const orders = require('./services/orders');
const create = require('./services/create');
const update = require('./services/update');
const addProduct = require('./services/addProduct');
const updateProduct = require('./services/updateProduct');
const deleteProduct = require('./services/deleteProduct');

/**
 * Get data from id
 * @param {string} id
 * @return {Promise<{data: *}>}
 */
const deliveryOrder = ({ id }) => DeliveryOrderModel.findOne({ _id: id });

module.exports = {
  orders,
  create,
  update,
  deliveryOrder,
  addProduct,
  updateProduct,
  deleteProduct,
};
