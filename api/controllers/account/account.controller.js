const Promise = require('bluebird');

const LogService = require('../../services/log.service');

const TYPE = 'AccountController';

const logService = new LogService(TYPE);

class AccountController {
  constructor({
                accountService,
                errorHandler,
              }) {
    this.accountService = accountService;
    this.errorHandler = errorHandler;
  }

  _handleError(res, error) {
    switch (error.code) {
      case 401:
        this.errorHandler.sendUnauthorizedError(res)(error);
        break;
      case 406:
        this.errorHandler.sendNotAcceptable(res)(error);
        break;
      default:
        this.errorHandler.sendError(res)(error);
        break;
    }
  }

  auth(req, res) {
    logService.logInfo(`[login] - Login user ${req.body.username}`);
    Promise.resolve(req.body)
      .bind(this)
      .then(this.accountService.login)
      .then(data => res.status(200).send({data}))
      .catch(this._handleError.bind(this, res));
  }

  createAccount(req, res) {
    logService.logInfo(`[createAccount] - Create new account ${req.body.username}`);
    Promise.resolve(req.body)
      .bind(this)
      .then(this.accountService.createAccount)
      .then(() => res.status(201).send())
      .catch(this._handleError.bind(this, res));
  }

}

module.exports = AccountController;

