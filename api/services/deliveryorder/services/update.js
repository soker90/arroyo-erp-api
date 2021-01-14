const { DeliveryOrderModel } = require('arroyo-erp-models');
const roundNumber = require('../../../../utils/roundNumber');

/**
 * Edit delivery order
 * @param {Object} params
 * @param {Object} body
 */
const update = ({ params, body: { date, note, totals } }) => {
  const set = {
    ...(date && { date }),
    ...(note !== undefined && { note }),
    ...(totals && {
      total: roundNumber(totals.total),
      iva: roundNumber(totals.iva),
      ...(totals.rate && { rate: roundNumber(totals.rate) }),
      re: roundNumber(totals.re),
      taxBase: roundNumber(totals.taxBase),
    }),
  };

  return DeliveryOrderModel.findOneAndUpdate(
    { _id: params.id },
    { $set: set },
    {
      new: true,
      fields: {
        ...(date && { date: 1 }),
        ...(note && { note: 1 }),
        ...(totals && {
          total: 1,
          iva: 1,
          rate: 1,
          re: 1,
          taxBase: 1,
        }),
      },
    },
  );
};

module.exports = update;
