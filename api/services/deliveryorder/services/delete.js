const { DeliveryOrderModel } = require('arroyo-erp-models');

/**
 * Elimina un albarán
 * @param {String} id
 * @return {Promise<void>}
 */
const deleteDeliveryOrder = ({
  id,
}) => (
  DeliveryOrderModel.deleteOne({ _id: id })
);

module.exports = deleteDeliveryOrder;
