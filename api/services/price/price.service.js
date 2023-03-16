const {
  PriceChangeModel,
} = require('arroyo-erp-models');

const updatePrice = require('./services/updatePrice');
const deletePrice = require('./services/deletePrice');
const deleteManyPricesChange = require('./services/deleteManyPricesChange');
const deletePriceById = require('./services/deletePriceById');

const priceChangeRead = ({
  params: { id },
  body: {
    read,
  },
}) => PriceChangeModel.updateOne({ _id: id }, { read });

const priceChangeDelete = ({ id }) => PriceChangeModel.deleteOne({ _id: id });

const priceChangesUnreadCount = async () => {
  const count = await PriceChangeModel.countDocuments({
    $or: [{ read: { $exists: false } }, { read: false }],
  });
  return { count };
};

/**
 * Get changes of prices
 * @return {Promise<{count: {count: *}, priceChanges: *}>}
 */
const priceChanges = async () => ({
  priceChanges: await PriceChangeModel.find({}),
  ...await priceChangesUnreadCount(),
});

module.exports = {
  updatePrice,
  deletePrice,
  priceChanges,
  priceChangeRead,
  priceChangeDelete,
  priceChangesUnreadCount,
  deleteManyPricesChange,
  deletePriceById,
};
