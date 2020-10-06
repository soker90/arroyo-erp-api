const { InvoiceModel } = require('arroyo-erp-models');

const {
  roundNumber,
} = require('../../../../utils');

/**
 * Create invoice
 * @param {Object} data
 */
const create = ({
  nInvoice, dateInvoice, dateRegister, taxBase, provider, concept, iva, re,
}) => {
  const ivaCalc = roundNumber(taxBase * iva);
  const reCalc = re ? roundNumber(taxBase * re) : 0;
  const total = taxBase + ivaCalc + reCalc;

  const invoice = {
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
