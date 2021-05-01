const { orderByProvider } = require('../../services/billing/utils');
/**
 * Return adapted object with invoice data
 * @param billings
 * @returns {[{cif: string, province: string, trimester4: number, city: string, trimester3: number,
 * trimester2: number, postalCode: string, trimester1: number, name: string, annual:  number}]}
 */
const billingsResponse = billings => billings.map(({
  provider,
  trimesters,
  annual,
  invoicesTrimester0,
  invoicesTrimester1,
  invoicesTrimester2,
  invoicesTrimester3,
}) => {
  const invoices1 = invoicesTrimester0?.length ?? 0;
  const invoices2 = invoicesTrimester1?.length ?? 0;
  const invoices3 = invoicesTrimester2?.length ?? 0;
  const invoices4 = invoicesTrimester3?.length ?? 0;

  return {
    name: provider?.name,
    businessName: provider?.businessName,
    trimester1: trimesters[0],
    invoices1,
    trimester2: trimesters[1],
    invoices2,
    trimester3: trimesters[2],
    invoices3,
    trimester4: trimesters[3],
    invoices4,
    annual,
    annualInvoices: invoices1 + invoices2 + invoices3 + invoices4,
  };
})
  .sort(orderByProvider);

module.exports = {
  billingsResponse,
};
