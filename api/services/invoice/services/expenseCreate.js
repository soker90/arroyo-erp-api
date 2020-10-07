const { InvoiceModel, ProviderModel } = require('arroyo-erp-models');

const {
  roundNumber,
} = require('../../../../utils');

/**
 * Create invoice
 * @param {Object} data
 */
const create = async ({
  nInvoice, dateInvoice, dateRegister, taxBase, provider, concept, iva, re,
}) => {
  const ivaCalc = roundNumber(taxBase * iva);
  const reCalc = re ? roundNumber(taxBase * re) : 0;
  const total = taxBase + ivaCalc + reCalc;

  const { name } = await ProviderModel.findOne({ _id: provider });

  const invoice = {
    nameProvider: name,
    nInvoice,
    dateInvoice,
    dateRegister,
    taxBase,
    provider,
    concept,
    iva: ivaCalc,
    ...(re && { re: reCalc }),
    total,
  };

  return new InvoiceModel(invoice).save();
};

module.exports = create;
