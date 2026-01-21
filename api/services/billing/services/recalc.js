const { BillingModel, InvoiceModel } = require('arroyo-erp-models');

const LogService = require('../../log.service');
const { roundNumber } = require('../../../../utils');

const TYPE = 'BillingService';
const logService = new LogService(TYPE);

/**
 * Calcula la facturación del trimestre dado
 * @param {Object} billing
 * @param {String} trimester
 * @returns {number}
 */
const _getSumByTrimesters = (billing, trimester) => billing?.[`invoicesTrimester${trimester}`]?.reduce((accumulator, currentValue) => roundNumber(accumulator + currentValue.total), 0);

/**
 * Realiza los sumatorios para calcular la facturación
 * @param {Object} billing
 * @return {{trimesters: number[], annual: number}}
 */
const calcNewBilling = billing => {
  const trimesters = [0, 0, 0, 0];
  let annual = 0;

  [0, 1, 2, 3].forEach(trimester => {
    const sumTrimester = _getSumByTrimesters(billing, trimester) || 0;
    trimesters[trimester] = sumTrimester;
    annual += sumTrimester;
  });

  return {
    trimesters,
    annual,
  };
};

/**
 * Recalcula todos los totales de facturación para un año dado
 * Busca las facturas reales por sus IDs y actualiza los totales en los billings
 * @param {Object} params
 * @param {number} params.year - Año para el cual recalcular
 * @return {Promise<number>} - Número de billings actualizados
 */
const recalc = async ({ year }) => {
  logService.logInfo(`[recalc] - Recalculando la facturación del año ${year}`);

  // Obtener todos los billings del año
  const billings = await BillingModel.find({ year });

  logService.logInfo(`[recalc] - Encontrados ${billings.length} billings para el año ${year}`);

  let updatedCount = 0;

  // Procesar cada billing
  for (const billing of billings) {
    let hasChanges = false;

    // Recorrer cada trimestre
    for (let trimester = 0; trimester < 4; trimester++) {
      const trimesterField = `invoicesTrimester${trimester}`;
      const invoicesInTrimester = billing[trimesterField] || [];

      if (invoicesInTrimester.length === 0) continue;

      // Obtener los IDs de las facturas
      const invoiceIds = invoicesInTrimester.map(inv => inv.invoice);

      // Buscar las facturas reales en la base de datos
      const realInvoices = await InvoiceModel.find({ _id: { $in: invoiceIds } });

      // Crear un mapa de facturas por ID para acceso rápido
      const invoiceMap = new Map();
      realInvoices.forEach(inv => {
        invoiceMap.set(inv._id.toString(), inv);
      });

      // Actualizar los totales si difieren
      const updatedInvoices = invoicesInTrimester.map(invTrimester => {
        const realInvoice = invoiceMap.get(invTrimester.invoice);

        if (realInvoice && invTrimester.total !== realInvoice.total) {
          logService.logInfo(`[recalc] - Actualizando factura ${invTrimester.invoice}: ${invTrimester.total} -> ${realInvoice.total}`);
          hasChanges = true;
          return {
            invoice: invTrimester.invoice,
            total: realInvoice.total,
            date: invTrimester.date,
          };
        }

        return invTrimester;
      });

      billing[trimesterField] = updatedInvoices;
    }

    // Si hubo cambios, recalcular los totales trimestrales y anuales
    if (hasChanges) {
      const newTotals = calcNewBilling(billing);

      // Verificar si los totales también han cambiado
      const totalsChanged =
        billing.trimesters.some((value, index) => value !== newTotals.trimesters[index]) ||
        billing.annual !== newTotals.annual;

      if (totalsChanged) {
        logService.logInfo(`[recalc] - Actualizando totales del proveedor ${billing.provider}`);
        logService.logInfo(`[recalc] - Trimestres: ${billing.trimesters} -> ${newTotals.trimesters}`);
        logService.logInfo(`[recalc] - Anual: ${billing.annual} -> ${newTotals.annual}`);
      }

      // Actualizar el billing completo
      await BillingModel.updateOne(
        { _id: billing._id },
        {
          invoicesTrimester0: billing.invoicesTrimester0,
          invoicesTrimester1: billing.invoicesTrimester1,
          invoicesTrimester2: billing.invoicesTrimester2,
          invoicesTrimester3: billing.invoicesTrimester3,
          trimesters: newTotals.trimesters,
          annual: newTotals.annual,
        }
      );

      updatedCount++;
    }
  }

  logService.logInfo(`[recalc] - Se actualizó la facturación ${updatedCount} 3 provedores`);

  return updatedCount;
};

module.exports = recalc;
