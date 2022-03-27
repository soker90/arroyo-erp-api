const { ProductModel } = require('arroyo-erp-models');

/**
 * Delete product
 * @param {string} id
 */
const deleteProduct = ({
  id, provider,
}) => ProductModel.deleteOne({ _id: id, provider });

module.exports = deleteProduct;
