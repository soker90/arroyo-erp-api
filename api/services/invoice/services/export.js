const carbone = require('carbone');
const { InvoiceModel, ProviderModel } = require('arroyo-erp-models');
const { formatDate } = require('../../../../utils');
const { COLUMNS_INVOICES } = require('../../../../constants/invoices');
const { waitFor } = require('../../../../utils');

const getCategoryTotal = (invoice, column) => (invoice.bookColumn === column ? invoice.total : '');

const exportOds = async ({ year }) => {
  const start = new Date(year);
  const nextYear = Number(year) + 1;
  const end = new Date(nextYear.toString());

  const invoices = await InvoiceModel.find({
    dateRegister: {
      $gte: start,
      $lt: end,
    },
  })
    .sort({ nOrder: 1 })
    .lean();

  const providers = await ProviderModel.find({});

  const invoiceCells = invoices.map(invoice => {
    const provider = providers.find(p => p._id.toString() === invoice.provider) || {};
    return {
      nOrder: invoice.nOrder,
      dateRegister: formatDate(invoice.dateRegister),
      dateInvoice: formatDate(invoice.dateInvoice),
      nInvoice: invoice.nInvoice,
      nameProvider: provider.businessName,
      cif: provider.cif,
      concept: invoice.concept,
      compras: getCategoryTotal(invoice, COLUMNS_INVOICES.COMPRAS),
      autonomos: getCategoryTotal(invoice, COLUMNS_INVOICES.AUTONOMOS),
      salario: getCategoryTotal(invoice, COLUMNS_INVOICES.SALARIO),
      alquiler: getCategoryTotal(invoice, COLUMNS_INVOICES.ALQUILER),
      suministros: getCategoryTotal(invoice, COLUMNS_INVOICES.SUMINISTROS),
      comisiones: getCategoryTotal(invoice, COLUMNS_INVOICES.COMISIONES),
      tributos: getCategoryTotal(invoice, COLUMNS_INVOICES.TRIBUTOS),
      reparacion: getCategoryTotal(invoice, COLUMNS_INVOICES.REPARACION),
      seguros: getCategoryTotal(invoice, COLUMNS_INVOICES.SEGUROS),
      retencion: '',
      total: invoice.total,
    };
  });

  let bookFile = null;
  let error = null;

  carbone.render('./templates/book.ods', invoiceCells, {}, (err, result) => {
    if (err) {
      error = err;
      return;
    }
    bookFile = result;
  });

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (error) reject(error);
      if (bookFile) resolve(bookFile);
    }, 1000);
  });
};

module.exports = exportOds;
