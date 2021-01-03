const { ClientInvoiceModel, mongoose } = require('arroyo-erp-models');
const addDeliveryOrder = require('./addDeliveryOrder');
const testDB = require('../../../../test/test-db')(mongoose);

describe('addDeliveryOrder', () => {
  let invoice;

  beforeAll(() => testDB.connect());
  afterAll(() => testDB.disconnect());

  before(async () => {
    invoice = await ClientInvoiceModel.create({
      date: Date.now(),
    });
    await addDeliveryOrder({ id: invoice._id });
  });

  test('Se añade el albarán', async () => {
    const invoiceEdited = await ClientInvoiceModel.findOne({ _id: invoice._id });
    const { deliveryOrders } = invoiceEdited;
    expect(deliveryOrders[0].date)
      .toBeNull();
    expect(deliveryOrders[0].total)
      .toBe(0);
    expect(deliveryOrders[0].products.length)
      .toBe(0);
  });
});
