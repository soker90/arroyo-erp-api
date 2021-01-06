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
const editDeliveryOrder = ({
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
  return ClientInvoiceModel.findOneAndUpdate({
    _id: id,
    'deliveryOrders._id': deliveryOrder,
    'deliveryOrders.products._id': product,
  }, {
    $set: {
      'deliveryOrders.$[i].products.$[j].name': name,
      'deliveryOrders.$[i].products.$[j].weight': weight,
      'deliveryOrders.$[i].products.$[j].unit': unit,
      'deliveryOrders.$[i].products.$[j].price': price,
      'deliveryOrders.$[i].products.$[j].total': total,
    },
  }, {
    new: true,
    arrayFilters: [{ 'i._id': deliveryOrder }, { 'j._id': product }],
  });
};

module.exports = editDeliveryOrder;
