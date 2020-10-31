const XLSX = require('xlsx');
const { InvoiceModel } = require('arroyo-erp-models');

const exportOds = async ({ year }) => {
  const start = new Date(year);
  const nextYear = Number(year) + 1;
  const end = new Date(nextYear.toString());

  const invoices = await InvoiceModel.find({
    dateRegister: {
      $gte: start,
      $lt: end,
    },
  }, '_id nameProvider nOrder dateInvoice total dateRegister nInvoice concept')
    .sort({ nOrder: 1 })
    .lean();

  const invoiceCells = invoices.map(invoice => ([
    invoice.nOrder, invoice.dateRegister, invoice.dateInvoice, invoice.nInvoice, '', '',
    invoice.convept, invoice.total,
  ]));

  const ws = XLSX.utils.aoa_to_sheet([
    ['Nº Orden', 'Fecha registro', 'Fecha Factura', 'Nº Factura', 'Razón social', 'Cif', 'Concept', 'Importe'],
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
