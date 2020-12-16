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

/**
 * Validate params
 * @param {number} code
 * @param {string} name
 * @param {string} provider
 * @param {number} fee
 * @param {number} iva
 * @param {number} re
 * @param {boolean} isUpdate
 * @return {Object}
 * @private
 */
const validateFields = ({
  name,
  iva,
  re,
}) => {
  if (!name || typeof iva !== 'number' || typeof re !== 'number') throw new productErrors.ProductMissingParams();
};

const validateFieldsBody = ({ body }) => validateFields(body);

const validateCodeDuplicate = async ({
  code,
  provider,
}) => {
  if (code) {
    const existInvoice = await ProductModel.exists({
      code,
      provider,
    });

    if (existInvoice)
      throw new productErrors.ProductCodeExists();
  }
};

const validateCodeDuplicateEdit = async ({
  params: { id },
  body: { code },
}) => {
  if (code) {
    const product = await ProductModel.findOne({ _id: id });
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
};
