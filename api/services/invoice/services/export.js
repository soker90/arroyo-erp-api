const carbone = require('carbone');
const { InvoiceModel, ProviderModel } = require('arroyo-erp-models');
const { COLUMNS_INVOICES } = require('../../../../constants/invoices');
const { formatDate } = require('../../../../utils');

const getCategoryTotal = (invoice, column) => (invoice.bookColumn === column ? invoice.total : null);

const _invoicesAdapter = (invoices, providers) => invoices.map(invoice => {
  const provider = providers.find(p => p._id.toString() === invoice.provider) || {};
  return {
    nOrden: invoice.nOrder,
    fechaRegistro: formatDate(invoice.dateRegister),
    fechaFactura: formatDate(invoice.dateInvoice),
    nFactura: invoice.nInvoice,
    nombreProveedor: provider.businessName,
    cif: provider.cif,
    concepto: invoice.concept,
    compras: getCategoryTotal(invoice, COLUMNS_INVOICES.COMPRAS),
    autonomos: getCategoryTotal(invoice, COLUMNS_INVOICES.AUTONOMOS),
    salario: getCategoryTotal(invoice, COLUMNS_INVOICES.SALARIO),
    alquiler: getCategoryTotal(invoice, COLUMNS_INVOICES.ALQUILER),
    suministros: getCategoryTotal(invoice, COLUMNS_INVOICES.SUMINISTROS),
    comisiones: getCategoryTotal(invoice, COLUMNS_INVOICES.COMISIONES),
    tributos: getCategoryTotal(invoice, COLUMNS_INVOICES.TRIBUTOS),
    reparacion: getCategoryTotal(invoice, COLUMNS_INVOICES.REPARACION),
    seguros: getCategoryTotal(invoice, COLUMNS_INVOICES.SEGUROS),
    otros: getCategoryTotal(invoice, COLUMNS_INVOICES.OTROS),
    retencion: '',
    total: invoice.total,
  };
});

const _getInvoices = async year => {
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

  return _invoicesAdapter(invoices, providers);
};

const exportOds = async ({ year }) => {
  const invoices = await _getInvoices(year);

  let bookFile = null;
  let error = null;

  carbone.render('./templates/book.ods', invoices, {
    lang: 'es-es',
  }, (err, result) => {
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
