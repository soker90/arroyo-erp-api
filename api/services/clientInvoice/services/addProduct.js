const { ClientInvoiceModel } = require('arroyo-erp-models');
const roundNumber = require('../../../../utils/roundNumber');

/**
 * Add product to delivery order
 * @param {String} id
 * @param {String} deliveryOrder
 * @param {String} name
 * @param {Number} weight
 * @param {Number} unit
 * @param {String} price
 * @return {Promise<void>}
 */
const addProduct = ({
  params: {
    id,
    deliveryOrder,
  },
  body: {
    name,
    weight,
    unit,
    price,
    productId,
  },
}) => {
  const total = roundNumber(weight * price);
  return ClientInvoiceModel.findOneAndUpdate({
    _id: id,
    'deliveryOrders._id': deliveryOrder,
  }, {
    $push: {
      'deliveryOrders.$.products': {
        name,
        weight,
        unit,
        price,
        total,
        productId,
      },
    },
  }, { new: true });
};

module.exports = addProduct;
