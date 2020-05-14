const models = require('arroyo-erp-models');

const {
  user,
  pass,
  host,
  port,
  dataBaseName,
  options: mongoOptions,
} = require('.').mongo;

const userPass = user && pass ? `${user}:${pass}@` : '';

const hostProperty = [].concat(host);
const portProperty = [].concat(port);
const hosts = hostProperty.reduce((s, h, i) => `${s}${i > 0 ? ',' : ''}${h}:${portProperty[i] || portProperty[0]}`, '');

const uri = process.env.MONGODB ||`mongodb://${userPass}${hosts}/${dataBaseName}`;

const options = mongoOptions || {};
options.useNewUrlParser = true;

module.exports = () => {
  if (process.env.NODE_ENV !== 'test') {
    models.connect(uri, options);
  }
};
