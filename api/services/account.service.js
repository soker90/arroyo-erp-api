const { AccountModel } = require('arroyo-erp-models');
const { compare } = require('bcrypt');
const { InvalidLogin, UserNotFound, UserExist } = require('../../errors/user.errors');
const { signToken, verifyToken } = require('../../components/auth/auth.service');

/**
 * Check user and password and return token
 * @param {String} username
 * @param {String} password
 * @returns {Promise<{token: (string)}>}
 */
const login = async ({ username, password }) => {
  const user = await AccountModel.findOne({ username });

  if (!user) throw new UserNotFound();

  if (!password) throw new InvalidLogin();

  const isCorrect = await compare(password, user.password);

  if (!isCorrect) throw new InvalidLogin();


  return { token: signToken(user.username) };
};

/**
 * Check token and return a new token
 * @param token
 * @return {Promise<{token: (undefined|*)}>}
 */
const refreshToken = async ({ token }) => {
  const dataToken = await verifyToken(token);
  return { token: signToken(dataToken.user) };
};

/**
 * Create account
 * @param {String} username
 * @param {String} password
 * @returns {String}
 */
const createAccount = async ({ username, password }) => {
  const userExist = await AccountModel.findOne({ username });

  if (userExist) throw new UserExist();


  await new AccountModel({
    username,
    password,
  }).save();
};

module.exports = {
  login,
  createAccount,
  refreshToken,
};
