/* eslint-disable camelcase, nonblock-statement-body-position */
const {
  PriceChangeModel,
} = require('arroyo-erp-models');

/**
 * Check if exist id
 * @param {String} id
 * @returns {Promise<void>}
 */
const validateIds = async ({ ids }) => {
  for await (const id of ids) {
    const priceExist = await PriceChangeModel.exists({ _id: id });
    if (!priceExist) throw new Error('Alguno de los elementos seleccionados no existe');
  }
};

module.exports = {
  validateIds,
};
