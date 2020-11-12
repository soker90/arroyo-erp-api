const { InvoiceModel, ProviderModel } = require('arroyo-erp-models');

const generateOrderNumber = require('../../../../components/generate-num-order');
const { isTypeCash } = require('../../../../utils');

/**
 * Create invoice
 * @param {Object} data
 */
const create = async ({
  nInvoice, dateInvoice, dateRegister, total, provider, concept, re, type, paymentDate,
  bookColumn,
}) => {
  const { name, businessName, cif } = await ProviderModel.findOne({ _id: provider });

  const nOrder = await generateOrderNumber(dateInvoice);

  const invoice = {
    nOrder,
    nameProvider: name,
    businessName,
    cif,
    nInvoice,
    dateInvoice,
    dateRegister,
    provider,
    concept,
    bookColumn,
    ...(re && { re }),
    total,
    payment: {
      ...(paymentDate && { paymentDate }),
      type,
      ...(isTypeCash(type) && { paid: true }),
    },
  };

  return new InvoiceModel(invoice).save();
};

module.exports = create;
