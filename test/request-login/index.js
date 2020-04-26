/* eslint-disable import/no-extraneous-dependencies */
const supertest = require('supertest');
const { SystemUser } = require('insurances-models');
const moment = require('fintonic-moment-lib');
const systemUserConstants = require('../../constants/system-user');
const rolesTypes = require('../../constants/roles-types');
const { createHash } = require('../../utils/hash/encrypt');

const defaultCredentials = {
  username: 'test',
  email: 'test@example.com',
  password: 'AabbCcdD1234',
};

const defaultApp = require('../../');

async function createUser(user) {
  const newUser = { ...user };
  const passwordHash = await createHash(user.password);
  newUser.password = passwordHash;
  newUser.passwordHistory = [passwordHash];
  newUser.loginRetryLeft = systemUserConstants.DEFAULT_LOGIN_RETRY_TRY;
  newUser.passwordExpiryDate = moment().add(systemUserConstants.DEFAULT_PASSWORD_EXPIRE_MONTHS, 'month');
  newUser.role = user.role || rolesTypes.ADMIN;
  return SystemUser.create(newUser);
}

function requestLogin(app = defaultApp, credentials = defaultCredentials) {
  return createUser(credentials)
    .then(() => supertest(app)
      .post('/login/v0/')
      .send({ username: credentials.username, password: credentials.password }))
    .then((res) => {
      const session = {
        token: res.body.data.token,
        user: res.body.data.user,
        cookies: res.headers['set-cookie'].pop().split(';')[0],
      };
      return session;
    });
}

requestLogin.defaultCredentials = defaultCredentials;
module.exports = requestLogin;
