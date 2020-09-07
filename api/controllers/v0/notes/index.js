const { authMiddleware } = require('../../../../components/auth');
const errorHandler = require('../../../../components/error-handlers');

const NoteController = require('./notes.controller');

module.exports = ({ noteService }, { noteValidator }) => {
  const notesController = new NoteController({
    noteService,
    errorHandler,
    noteValidator,
  });

  return [{
    method: 'get',
    domain: 'notes',
    path: '/',
    handler: notesController.notes,
    bindTo: notesController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  },
  {
    method: 'get',
    domain: 'notes',
    path: '/:id',
    handler: notesController.note,
    bindTo: notesController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  },
  {
    method: 'post',
    domain: 'notes',
    path: '/',
    handler: notesController.create,
    bindTo: notesController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  },
  {
    method: 'put',
    domain: 'notes',
    path: '/:id',
    handler: notesController.edit,
    bindTo: notesController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  },
  {
    method: 'delete',
    domain: 'notes',
    path: '/:id',
    handler: notesController.delete,
    bindTo: notesController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  },
  ];
};
