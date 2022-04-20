const {
  ProductModel,
  PriceModel,
  ClientInvoiceModel,
} = require('arroyo-erp-models');

/**
 * Update price for client products
 * @param {Object} params
 * @param {Object} body
 */
const updatePrice = async ({
  body: {
    name,
    price,
    product,
  },
  params: {
    id,
    deliveryOrder,
  },
}) => {
  const oldProduct = await ProductModel.findOne({
    name,
    provider: undefined,
  }, {
    price,
  });

  const productData = await ProductModel.findOneAndUpdate({
    name,
    provider: undefined,
  }, {
    price,
  }, {
    new: true,
    upsert: true,
  });

  const invoice = await ClientInvoiceModel.findOne({ _id: id });
  const doDocument = invoice.deliveryOrders.id(deliveryOrder);

  // Si esta editando el producto se borra el precio anterior
  if (product) {
    await PriceModel.deleteOne({
      product: productData._id,
      deliveryOrder,
      invoice: id,
    });
  }

  if (oldProduct !== price) {
    await PriceModel.updateOne({
      product: productData._id,
      deliveryOrder,
      invoice: id,
    }, {
      date: doDocument.date,
      price,
    }, { upsert: true });
  }

  return productData;
};
module.exports = updatePrice;
