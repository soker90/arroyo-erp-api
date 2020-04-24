const axios = require('axios');

const config = require('../../config');
const RequestService = require('./request.service');
const AccountService = require('./account.service');

const axiosSpiderInstance = axios.create({
  baseURL: config.services.spider.baseURL,
});

const requestService = new RequestService(axiosSpiderInstance);
const accountService = AccountService;

module.exports = {
  requestService,
  accountService,
};
