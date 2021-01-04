const { ClientInvoiceModel } = require('arroyo-erp-models');

/**
 * Delete product of delivery order in invoice
 * @param {Object} data
 */
const deleteProduct = async ({
  id,
  deliveryOrder,
  product,
}) => ClientInvoiceModel.findOneAndUpdate({
  _id: id,
  'deliveryOrders._id': deliveryOrder,
}, { $pull: { 'deliveryOrders.$.products': { _id: product } } },
{ new: true });

module.exports = deleteProduct;
