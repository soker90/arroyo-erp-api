/* eslint-disable nonblock-statement-body-position */
const {
  ProductModel,
} = require('arroyo-erp-models');

/**
 * Create product
 * @return {Promise<string>}
 */
const createForClients = ({
  code,
  name,
  price,
}) => new ProductModel({
  code,
  name,
  price,
}).save();

module.exports = createForClients;
