const { ClientInvoiceModel } = require('arroyo-erp-models');
const roundNumber = require('../../../../utils/roundNumber');

/**
 * Edit product in delivery order invoice
 * @param {String} id
 * @param {String} deliveryOrder
 * @param {String} product
 * @param {String} name
 * @param {number} weight
 * @param {string} unit
 * @param {number} price
 */
const editDeliveryOrder = async ({
  params: {
    id,
    deliveryOrder,
    product,
  },
  body: {
    name,
    weight,
    unit,
    price,
  },
}) => {
  const total = roundNumber(weight * price);

  const clientInvoice = await ClientInvoiceModel.findOne({
    _id: id,
    'deliveryOrders._id': deliveryOrder,
    'deliveryOrders.products._id': product,
  });

  const productIndex = clientInvoice.deliveryOrders.id(deliveryOrder)
    .products
    .findIndex(productDO => productDO._id.toString() === product);

  clientInvoice.deliveryOrders.id(deliveryOrder).products[productIndex] = {
    name,
    weight,
    unit,
    price,
    total,
  };

  return clientInvoice.save();
};

module.exports = editDeliveryOrder;
