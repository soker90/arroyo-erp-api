/* eslint-disable camelcase, nonblock-statement-body-position */
const {
  PriceChangeModel,
} = require('arroyo-erp-models');
const { priceChangeErrors } = require('../../../errors');

/**
 * Check if exist id
 * @param {String} id
 * @returns {Promise<void>}
 */
const validateIds = async ({ ids }) => {
  for await (const id of ids) {
    const priceExist = await PriceChangeModel.exists({ _id: id });
    if (!priceExist) throw new priceChangeErrors.ElementsNotFound();
  }
};

/**
 * Check if exist id
 * @param {String} id
 * @returns {Promise<void>}
 */
const validateId = async ({ id }) => {
  const priceExist = await PriceChangeModel.exists({ _id: id });
  if (!priceExist) throw new priceChangeErrors.PriceChangeNotFound();
};

/**
 * Check if exist id
 * @param {String} id
 * @returns {Promise<void>}
 */
const validateIdParam = ({ params }) => validateId(params);

module.exports = { validateIds, validateIdParam, validateId };
