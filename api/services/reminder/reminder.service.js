const { ReminderModel } = require('arroyo-erp-models');

const LogService = require('../log.service');

const TYPE = 'ReminderModel';
const logService = new LogService(TYPE);

/**
 * Create note
 * @param {string} message
 * @return {Promise<string>}
 */
const create = async ({
  message,
}) => {
  logService.logInfo('[create reminder] - Creando recordatorio');

  await new ReminderModel({
    message,
  }).save();
};

/**
 *Devuelve todas las notas
 * @returns {*}
 */
const reminders = () => ReminderModel.find({});

/**
 * Elimina una nota
 * @param {String} id
 * @returns {Promise<void>}
 */
const deleteReminder = ({ id }) => ReminderModel.deleteOne({ _id: id });

module.exports = {
  create,
  reminders,
  deleteReminder,
};
