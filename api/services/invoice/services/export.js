const XLSX = require('xlsx');
const { InvoiceModel, ProviderModel } = require('arroyo-erp-models');
const { formatDate } = require('../../../../utils');
const { CONCEPT } = require('../../../../constants/invoices');

const getCategoryTotal = (invoice, concept) => (invoice.concept === concept ? invoice.total : '');

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
    return [
      invoice.nOrder, formatDate(invoice.dateRegister), formatDate(invoice.dateInvoice),
      invoice.nInvoice, provider.businessName, provider.cif, invoice.concept,
      getCategoryTotal(invoice, CONCEPT.COMPRAS), invoice.total,
    ];
  });

  const ws = XLSX.utils.aoa_to_sheet([
    ['Nº Orden', 'Fecha registro', 'Fecha Factura', 'Nº Factura', 'Razón social', 'Cif', 'Concepto',
      'Compras mercaderías', 'Importe total'],
    ...invoiceCells,
  ]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, `Libro ${year}`);

  /* generate buffer */
  const buf = XLSX.write(wb, {
    type: 'buffer',
    bookType: 'ods',
  });
  return buf;
};

module.exports = exportOds;
