const XLSX = require('xlsx');
const { InvoiceModel, ProviderModel } = require('arroyo-erp-models');
const { formatDate } = require('../../../../utils');
const { COLUMNS_INVOICES } = require('../../../../constants/invoices');

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
    return [
      invoice.nOrder, formatDate(invoice.dateRegister), formatDate(invoice.dateInvoice),
      invoice.nInvoice, provider.businessName, provider.cif, invoice.concept,
      getCategoryTotal(invoice, COLUMNS_INVOICES.COMPRAS),
      getCategoryTotal(invoice, COLUMNS_INVOICES.AUTONOMOS),
      getCategoryTotal(invoice, COLUMNS_INVOICES.SALARIO),
      getCategoryTotal(invoice, COLUMNS_INVOICES.ALQUILER),
      getCategoryTotal(invoice, COLUMNS_INVOICES.SUMINISTROS),
      getCategoryTotal(invoice, COLUMNS_INVOICES.COMISIONES),
      getCategoryTotal(invoice, COLUMNS_INVOICES.TRIBUTOS),
      getCategoryTotal(invoice, COLUMNS_INVOICES.REPARACION),
      getCategoryTotal(invoice, COLUMNS_INVOICES.SEGUROS),
      '', invoice.total,
    ];
  });

  const ws = XLSX.utils.aoa_to_sheet([
    ['Nº Orden', 'Fecha registro', 'Fecha Factura', 'Nº Factura', 'Razón social', 'Cif', 'Concepto',
      'Compras mercaderías', 'S. S. AUTÓNOMOS', 'SUELDOS Y SALARIOS', 'ALQUILER',
      'SUMINISTROS agua, luz, tel. Basura, gasoil', 'COMISIONES Al año',
      'TRIBUTOS NO ESTAT Ibi, circulac', 'REPARACIÓN Y CONSEVACIÓN',
      'SEGUROS', 'OTROS G.', 'RETENC 19%', 'Importe total'],
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
