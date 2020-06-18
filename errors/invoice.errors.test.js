const InvoiceErrors = require('./invoice.errors');

describe('InvoiceErrors', () => {
  test('should be an object', () => {
    expect(InvoiceErrors).toBeInstanceOf(Object);
  });

  describe('InvoiceMissingDeliveryOrders', () => {
    test('should exist and extend from Error', () => {
      expect(new InvoiceErrors.InvoiceMissingDeliveryOrders()).toBeInstanceOf(Error);
    });

    test('should define a default message', () => {
      const err = new InvoiceErrors.InvoiceMissingDeliveryOrders();
      expect(err.message).toEqual('No se han enviado albaranes');
    });

    test('should allow passing a custom message', () => {
      const err = new InvoiceErrors.InvoiceMissingDeliveryOrders('CustomMessage');
      expect(err.message).toEqual('CustomMessage');
    });
  });

  describe('InvoiceNotFoundDeliveryOrder', () => {
    test('should exist and extend from Error', () => {
      expect(new InvoiceErrors.InvoiceNotFoundDeliveryOrder()).toBeInstanceOf(Error);
    });

    test('should define a default message', () => {
      const err = new InvoiceErrors.InvoiceNotFoundDeliveryOrder();
      expect(err.message).toEqual('Alguno de los albaranes no existe');
    });

    test('should allow passing a custom message', () => {
      const err = new InvoiceErrors.InvoiceNotFoundDeliveryOrder('CustomMessage');
      expect(err.message).toEqual('CustomMessage');
    });
  });
});
