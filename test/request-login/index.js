/* eslint-disable import/no-extraneous-dependencies */
const supertest = require('supertest');
const { AccountModel } = require('arroyo-erp-models');

const defaultCredentials = {
  username: 'test',
  password: 'AabbCcdD1234',
};

const defaultApp = require('../..');

const createUser = async user => await AccountModel.create(user);

const requestLogin = (app = defaultApp, credentials = defaultCredentials) => (
  createUser(credentials)
    .then(() => supertest(app)
      .post('/account/login')
      .send({
        username: credentials.username,
        password: credentials.password,
      }))
    .then(res => {
      console.log(res.body);
      return res.body.token;
    })
);

requestLogin.defaultCredentials = defaultCredentials;
module.exports = requestLogin;
