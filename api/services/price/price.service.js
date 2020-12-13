const {
  PriceChangeModel,
} = require('arroyo-erp-models');

const updatePrice = require('./services/updatePrice');
const deletePrice = require('./services/deletePrice');

/**
 * Get changes of prices
 * @return {Promise<void>}
 */
const priceChanges = () => PriceChangeModel.find({});

const priceChangeRead = ({
  params: { id },
  body: {
    read,
  },
}) => PriceChangeModel.updateOne({ _id: id }, { read });

const priceChangeDelete = ({ id }) => PriceChangeModel.deleteOne({ _id: id });

const priceChangesCount = () => PriceChangeModel.count();

module.exports = {
  updatePrice,
  deletePrice,
  priceChanges,
  priceChangeRead,
  priceChangeDelete,
  priceChangesCount,
};
