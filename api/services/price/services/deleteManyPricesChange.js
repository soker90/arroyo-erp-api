/* eslint-disable nonblock-statement-body-position */
const {
  PriceChangeModel,
} = require('arroyo-erp-models');

const deleteManyPricesChange = ({
  ids,
}) => PriceChangeModel.deleteMany({ _id: { $in: ids } });

module.exports = deleteManyPricesChange;
