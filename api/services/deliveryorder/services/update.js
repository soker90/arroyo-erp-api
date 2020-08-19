const { DeliveryOrderModel } = require('arroyo-erp-models');

/**
 * Edit delivery order
 * @param {Object} params
 * @param {Object} body
 */
const update = ({ params, body: { date } }) => {
  const set = {
    ...(date && { date }),
  };

  return DeliveryOrderModel.findOneAndUpdate(
    { _id: params.id },
    { $set: set },
    {
      new: true,
      fields: {
        ...(date && { date: 1 }),
      },
    },
  );
};

module.exports = update;
