/* eslint-disable nonblock-statement-body-position */
const { NoteModel } = require('arroyo-erp-models');

const LogService = require('../log.service');

const TYPE = 'NoteService';
const logService = new LogService(TYPE);

/**
 * Create note
 * @param {number} date
 * @param {string} message
 * @return {Promise<string>}
 */
const create = async ({ date, message }) => {
  logService.logInfo('[create note] - Creando note');

  const noteData = await new NoteModel({
    date,
    message,
  });

  logService.logInfo('[create note] - Nota creada', noteData);
  noteData.save();
};

/**
 *Devuelve todas las notas
 * @returns {*}
 */
const notes = () => NoteModel.find({});

/**
 * Devuelve una nota
 * @returns {*}
 */
const note = ({ id }) => NoteModel.findOne({ _id: id });

/**
 * Elimina una nota
 * @param {String} id
 * @returns {Promise<void>}
 */
const deleteNote = ({ id }) => NoteModel.deleteOne({ _id: id });

/**
 * Edita un nota
 * @param {string} id
 * @param {number} date
 * @param {string} message
 * @return {Promise<string>}
 */
const edit = async ({ params: { id }, body: { date, message } }) => {
  logService.logInfo('[edit note] - Editando nota ', id);

  return NoteModel.findOneAndUpdate(
    { _id: id },
    {
      date,
      message,
    },
  );
};

module.exports = {
  create,
  edit,
  deleteNote,
  notes,
  note,
};
