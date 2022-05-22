class LogService {
  constructor (type) {
    this.type = type;
  }

  logInfo (message, labels) {
    const params = {message: `${this.type} - ${message}`};
    if (labels) { params.labels = labels; }
    console.info(params);
  }

  logError (message, error) {
    const params = {message: `${this.type} - ${message}`};
    if (error) { params.error = error; }
  }
}

module.exports = LogService;
