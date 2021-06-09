const { ProductModel } = require('arroyo-erp-models');

/**
 * Delete product
 * @param {string} id
 */
const deleteProduct = ({
  id,
}) => ProductModel.deleteOne({ _id: id });

module.exports = deleteProduct;
