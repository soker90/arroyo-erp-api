const { InvoiceModel, ProviderModel } = require('arroyo-erp-models');

const {
  roundNumber,
} = require('../../../../utils');

const generateOrderNumber = require('../../../../components/generate-num-order');

/**
 * Create invoice
 * @param {Object} data
 */
const create = async ({
  nInvoice, dateInvoice, dateRegister, taxBase, provider, concept, iva, re, type, paymentDate,
  bookColumn,
}) => {
  const ivaCalc = roundNumber(taxBase * iva);
  const reCalc = re ? roundNumber(taxBase * re) : 0;
  const total = taxBase + ivaCalc + reCalc;

  const { name } = await ProviderModel.findOne({ _id: provider });

  const nOrder = await generateOrderNumber(dateInvoice);

  const invoice = {
    nOrder,
    nameProvider: name,
    nInvoice,
    dateInvoice,
    dateRegister,
    taxBase,
    provider,
    concept,
    bookColumn,
    iva: ivaCalc,
    ...(re && { re: reCalc }),
    total,
    payment: {
      ...(paymentDate && { paymentDate }),
      type,
    },
  };

  return new InvoiceModel(invoice).save();
};

module.exports = create;
