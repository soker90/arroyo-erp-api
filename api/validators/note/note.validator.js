/* eslint-disable camelcase */
const { NoteModel } = require('arroyo-erp-models');
const { noteErrors, commonErrors } = require('../../../errors');

/**
 * Check if exist id
 * @param {String} id
 * @returns {Promise<void>}
 */
const _checkId = async id => {
  const noteExist = await NoteModel.exists({ _id: id });
  if (!noteExist) throw new noteErrors.NoteIdNotFound();
};
/**
 * Check if exist id
 * @param {String} id
 * @returns {Promise<void>}
 */
const validateId = ({ id }) => _checkId(id);
const validateIdParam = ({ params }) => validateId(params);

/**
 * Check if invalid date
 * @param {number} date
 * @returns {boolean}
 * @private
 */
const _isInvalidDate = date => !date || typeof date !== 'number';

/**
 * Validate params for confirm invoice
 * @param {String} type
 * @param {String} id
 * @returns {Promise<void>}
 */
const validateNote = async ({ concept, date }) => {
  if (!concept) throw new commonErrors.MissingParamsError();
  if (_isInvalidDate(date)) throw new commonErrors.DateNotValid();
};
const validateNoteBody = ({ body }) => validateNote(body);

module.exports = {
  validateNote,
  validateId,
  validateIdParam,
  validateNoteBody,
};
