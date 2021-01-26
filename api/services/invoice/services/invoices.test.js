const {
  mongoose,
  InvoiceModel,
} = require('arroyo-erp-models');
const testDB = require('../../../../test/test-db')(mongoose);
const invoiceService = require('../invoice.service');

const dateInvoice = {
  dateInvoice: 1596632570000.0,
  total: 75.48,
  iva: 6.8,
  rate: 0.5,
  re: 0.68,
  taxBase: 68,
  dateRegister: 1608748042237,
};
const totalInvoice = {
  dateInvoice: 1596632580000.0,
  total: 7.5,
  iva: 6.8,
  rate: 0.5,
  re: 0.68,
  taxBase: 68,
  dateRegister: 1608748042237,
};

const nInvoice = {
  dateInvoice: 1596632580000.0,
  total: 75.48,
  iva: 2.2,
  rate: 0.5,
  re: 0.68,
  taxBase: 68,
  nInvoice: '220',
  dateRegister: 1608748042237,
};

const numChequeInvoice = {
  dateInvoice: 1596632590000.0,
  total: 99.2,
  iva: 6.8,
  rate: 0.5,
  re: 0.68,
  dateRegister: 1608748042237,
  payment: {
    numCheque: 'dduud',
  },
};

const _checkData = ({ invoices, count }, invoice) => {
  expect(invoices.length)
    .toBe(1);
  expect(count).toBe(1);
  expect(invoice.dateInvoice)
    .toBe(invoices[0].dateInvoice);
  expect(invoice.total)
    .toBe(invoices[0].total);
  expect(invoice.nInvoice)
    .toBe(invoices[0].nInvoice);
};

describe('InvoicesService - Invoices', () => {
  beforeAll(() => testDB.connect());
  afterAll(() => testDB.disconnect());

  beforeAll(async () => {
    await InvoiceModel.create(dateInvoice);
    await InvoiceModel.create(totalInvoice);
    await InvoiceModel.create(nInvoice);
    await InvoiceModel.create(numChequeInvoice);
  });

  test('Busqueda por fecha', async () => {
    const invoices = await invoiceService.invoices({
      year: '2020',
      dateInvoice: dateInvoice.dateInvoice,
    });
    _checkData(invoices, dateInvoice);
  });

  test('Busqueda por total', async () => {
    const invoices = await invoiceService.invoices({
      year: '2020',
      total: totalInvoice.total,
    });
    _checkData(invoices, totalInvoice);
  });

  test('Busqueda por nInvoice', async () => {
    const invoices = await invoiceService.invoices({
      year: '2020',
      nInvoice: nInvoice.nInvoice,
    });
    _checkData(invoices, nInvoice);
  });

  test('Busqueda por numCheque', async () => {
    const invoices = await invoiceService.invoices({
      year: '2020',
      numCheque: numChequeInvoice.payment.numCheque,
    });
    _checkData(invoices, numChequeInvoice);
  });
});
