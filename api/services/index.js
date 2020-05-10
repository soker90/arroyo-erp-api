const axios = require('axios');

const config = require('../../config');
const RequestService = require('./request.service');
const AccountService = require('./account.service');
const ProductService = require('./product');
const ProviderService = require('./provider');

const axiosSpiderInstance = axios.create({
  baseURL: config.services.spider.baseURL,
});

const requestService = new RequestService(axiosSpiderInstance);

module.exports = {
  requestService,
  accountService: AccountService,
  productService: ProductService,
  providerService: ProviderService,
};
