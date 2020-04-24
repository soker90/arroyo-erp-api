const {AccountModel} = require('arroyo-erp-models');
const errorHandlers = require('../error-handlers');
const {verifyToken, signToken} = require('./auth.service');

/**
 * Returns the token in the response
 * @param {Object} res
 * @param {String} username
 */
const refreshToken = (res, {username}) => {
  res.set(
    'Token', signToken(username),
  );
  res.set('Access-Control-Expose-Headers', '*, Token');
}

const handleVerifyTokenError = res => {
  return (error) => {
    switch (error.name) {
      case 'TokenExpiredError':
      // throw token expirado
      default:
        errorHandlers.sendUnauthorizedError(res)(error);
    }

  };
}

/**
 * checkAuthorization
 *
 * req.headers.authorization - The value from the header Authorization: Bearer <token>
 *
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
const checkAuthorization = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split('Bearer ')[1];
    const dataToken = await verifyToken(token);
    console.log(dataToken);
    const user = await AccountModel.findOne({username: dataToken.user});
    console.log(user)
    if (!user)
      console.log('no exist throw')
    refreshToken(res, user)

    next();
  } catch (error) {
    handleVerifyTokenError(res)(error);
  }
}

// Authentication middleware
module.exports = checkAuthorization;
