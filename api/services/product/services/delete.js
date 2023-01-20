const {
  ProductModel,
  PriceModel,
} = require('arroyo-erp-models');

/**
 * Delete product
 * @param {string} id
 */
const deleteProduct = async ({
  id,
}) => {
  const productDeleted = await ProductModel.findOneAndDelete({ _id: id });

  if (productDeleted?._id) await PriceModel.deleteMany({ product: productDeleted._id });

  return { provider: productDeleted?.provider };
};

module.exports = deleteProduct;
