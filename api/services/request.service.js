/**
 * @Unused
 */
const config = require('../../config');
const LogService = require('./log.service');

const TYPE = 'RequestService';

const {
  url: TRACK_ELEMENT_URL,
  method: TRACK_ELEMENT_METHOD,
} = config.services.spider.trackElement;

const logService = new LogService(TYPE);

class RequestService {
  constructor(axiosSpiderInstance) {
    this.axiosSpiderInstance = axiosSpiderInstance;
  }

  /**
   * Generic method to request to URL
   *
   * @memberof RequestService
   * @param {String} url HTTP url to send the request
   * @param {String} method HTTP request method
   * @param {Object} data Param included in POST/PUT requests
   */
  async _request({ url, method, data }) {
    const request = {
      url,
      method,
    };

    if (data && ['POST', 'PUT'].includes(method)) {
      request.data = data;
    }

    await this.axiosSpiderInstance(request);
  }

  /**
   * Request to include a new element to track in our database
   *
   * @memberof RequestService
   * @param {String} url The location of an element
   */
  async trackElement(elementURL) {
    logService.logInfo('[trackElement] - Requesting the service to track a new element');

    await this._request({
      data: { elementURL },
      url: TRACK_ELEMENT_URL,
      method: TRACK_ELEMENT_METHOD,
    });
  }
}

module.exports = RequestService;
