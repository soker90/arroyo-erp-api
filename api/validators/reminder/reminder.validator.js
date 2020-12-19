/* eslint-disable camelcase */
const { ReminderModel } = require('arroyo-erp-models');
const {
  reminderErrors,
} = require('../../../errors');

/**
 * Check if exist id
 * @param {String} id
 * @returns {Promise<void>}
 */
const validateId = async ({ id }) => {
  const reminderExist = await ReminderModel.exists({ _id: id });
  if (!reminderExist) throw new reminderErrors.ReminderIdNotFound();
};

module.exports = {
  validateId,
};
