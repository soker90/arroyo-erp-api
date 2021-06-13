const { authMiddleware } = require('../../../../components/auth');
const errorHandler = require('../../../../components/error-handlers');

const DashboardController = require('./dashboard.controller');

module.exports = ({
  reminderService,
  dashboardService,
}, { reminderValidator }) => {
  const dashboardController = new DashboardController({
    reminderService,
    errorHandler,
    reminderValidator,
    dashboardService,
  });

  return [{
    method: 'get',
    domain: 'dashboard',
    path: '/',
    handler: dashboardController.dashboard,
    bindTo: dashboardController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  }, {
    method: 'post',
    domain: 'dashboard',
    path: '/createReminder',
    handler: dashboardController.createReminder,
    bindTo: dashboardController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  }, {
    method: 'delete',
    domain: 'dashboard',
    path: '/deleteReminder/:id',
    handler: dashboardController.deleteReminder,
    bindTo: dashboardController,
    skipVersion: true,
    middlewares: [
      authMiddleware,
    ],
  }];
};
