const Promise = require('bluebird');

const LogService = require('../../../services/log.service');

const TYPE = 'DashboardController';

const logService = new LogService(TYPE);

class DashboardController {
  constructor({
    reminderService,
    errorHandler,
    reminderValidator,
    dashboardService,
  }) {
    this.reminderService = reminderService;
    this.errorHandler = errorHandler;
    this.reminderValidator = reminderValidator;
    this.dashboardService = dashboardService;
  }

  _handleError(res, error) {
    switch (error.name) {
    case 'ReminderIdNotFound':
      this.errorHandler.sendNotFound(res)(error);
      break;
      /* istanbul ignore next */
    default:
      this.errorHandler.sendError(res)(error);
      break;
    }
  }

  /**
   * Return dashboard data
   */
  dashboard(req, res) {
    logService.logInfo('[inicio] - Datos del panel de inicio');
    Promise.resolve(req.query)
      .then(this.dashboardService.dashboard)
      .then(data => res.send(data))
      .catch(this._handleError.bind(this, res));
  }

  /**
   * Delete reminder
   */
  createReminder(req, res) {
    logService.logInfo('[create reminder] - Crea un recordatorio');
    Promise.resolve(req.body)
      .then(this.reminderService.create)
      .then(this.reminderService.reminders)
      .then(data => res.send({ reminders: data }))
      .catch(this._handleError.bind(this, res));
  }

  /**
   * Delete reminder
   */
  deleteReminder(req, res) {
    logService.logInfo('[create reminder] - Elimina un recordatorio');
    Promise.resolve(req.params)
      .tap(this.reminderValidator.validateId)
      .then(this.reminderService.deleteReminder)
      .then(this.reminderService.reminders)
      .then(data => res.send({ reminders: data }))
      .catch(this._handleError.bind(this, res));
  }
}

module.exports = DashboardController;
