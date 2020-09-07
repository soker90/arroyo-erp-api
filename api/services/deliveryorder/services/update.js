const { DeliveryOrderModel } = require('arroyo-erp-models');

/**
 * Edit delivery order
 * @param {Object} params
 * @param {Object} body
 */
const update = ({ params, body: { date, note } }) => {
  const set = {
    ...(date && { date }),
    ...(note && { note }),
  };

  return DeliveryOrderModel.findOneAndUpdate(
    { _id: params.id },
    { $set: set },
    {
      new: true,
      fields: {
        ...(date && { date: 1 }),
        ...(note && { note: 1 }),
      },
    },
  );
};

module.exports = update;
