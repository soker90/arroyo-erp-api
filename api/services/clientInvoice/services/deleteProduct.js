const {
  ClientInvoiceModel,
  PriceModel,
} = require('arroyo-erp-models');

/**
 * Delete product of delivery order in invoice
 * @param {Object} data
 */
const deleteProduct = async ({
  id,
  deliveryOrder,
  product,
}) => {
  const invoice = await ClientInvoiceModel.findOne({ _id: id });
  const { productId } = invoice.deliveryOrders.id(deliveryOrder)
    .products
    .id(product);

  await PriceModel.deleteOne({
    product: productId,
    deliveryOrder,
    invoice: id,
  });
  return ClientInvoiceModel.findOneAndUpdate(
    {
      _id: id,
      'deliveryOrders._id': deliveryOrder,
    },
    { $pull: { 'deliveryOrders.$.products': { _id: product } } },
    { new: true }
  );
};

module.exports = deleteProduct;
