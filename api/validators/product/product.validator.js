/* eslint-disable nonblock-statement-body-position  */
const { ProductModel } = require('arroyo-erp-models');
const { productErrors } = require('../../../errors');

/**
 * Check if exist id
 * @param {String} id
 * @returns {Promise<void>}
 */
const _checkId = async id => {
  const productExist = await ProductModel.exists({ _id: id });
  if (!productExist) throw new productErrors.ProductNotFound();
};

/**
 * Check if exist id
 * @param {String} id
 * @returns {Promise<void>}
 */
const validateId = ({ id }) => _checkId(id);
const validateIdParam = ({ params }) => validateId(params);
const validateProductBody = ({ body: { product } }) => _checkId(product);

const validateFieldsCreateByClients = ({
  name,
  price,
}) => {
  if (!name || typeof price !== 'number') throw new productErrors.ProductMissingParams();
};

/**
 * Validate params
 * @param {number} code
 * @param {string} name
 * @param {number} iva
 * @param {number} re
 * @return {Object}
 * @private
 */
const validateFields = ({
  name,
  iva,
  re,
  price,
}) => {
  if (price) {
    validateFieldsCreateByClients({
      name,
      price,
    });
    return;
  }
  if (!name || typeof iva !== 'number' || typeof re !== 'number') throw new productErrors.ProductMissingParams();
};

const validateFieldsBody = ({ body }) => validateFields(body);

const validateCodeDuplicate = async ({
  code,
  provider,
}) => {
  /* istanbul ignore else */

  if (code) {
    const existInvoice = await ProductModel.exists({
      code,
      provider,
    });

    /* istanbul ignore else */
    if (existInvoice)
      throw new productErrors.ProductCodeExists();
  }
};

const validateCodeDuplicateEdit = async ({
  params: { id },
  body: { code },
}) => {
  /* istanbul ignore else */
  if (code) {
    const product = await ProductModel.findOne({ _id: id });
    /* istanbul ignore else */
    if (code !== product.code) {
      await validateCodeDuplicate({
        code,
        provider: product.provider,
      });
    }
  }
};

module.exports = {
  validateProductBody,
  validateFields,
  validateIdParam,
  validateId,
  validateFieldsBody,
  validateCodeDuplicate,
  validateCodeDuplicateEdit,
  validateFieldsCreateByClients,
};
