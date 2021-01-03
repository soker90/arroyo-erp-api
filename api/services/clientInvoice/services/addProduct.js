const { ClientInvoiceModel } = require('arroyo-erp-models');

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
  },
}) => (
  ClientInvoiceModel.findOneAndUpdate({
    _id: id,
    'deliveryOrders._id': deliveryOrder,
  }, {
    $push: {
      'deliveryOrders.$.products': {
        name,
        weight,
        unit,
        price,
      },
    },
  }, {new: true})
);

module.exports = addProduct;
