/* eslint-disable */
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
 * @return {Promise<{updated: number, changes: Array}>}
 */
const recalc = async ({ year }) => {
  logService.logInfo(`[recalc] - Recalculando la facturación del año ${year}`);

  // Obtener todos los billings del año SIN popular provider (optimización)
  const billings = await BillingModel.find({ year });

  logService.logInfo(`[recalc] - Encontrados ${billings.length} billings para el año ${year}`);

  let updatedCount = 0;
  const changes = [];
  const providersToPopulate = new Set();

  // Procesar cada billing
  for (const billing of billings) {
    let hasChanges = false;
    const providerChanges = {
      providerId: billing.provider.toString(),
      invoices: [],
      trimesters: [],
      sumErrors: [],
    };

    // PASO 1: Verificar que las facturas correctas estén en cada trimestre
    // ...existing code...
    const startYear = new Date(year, 0, 1).getTime();
    const endYear = new Date(year, 11, 31, 23, 59, 59).getTime();
    const allProviderInvoices = await InvoiceModel.find({
      provider: billing.provider,
      dateInvoice: { $gte: startYear, $lte: endYear },
    });

    // Crear un mapa de facturas reales por trimestre
    const realInvoicesByTrimester = { 0: [], 1: [], 2: [], 3: [] };
    allProviderInvoices.forEach(invoice => {
      const invoiceDate = new Date(invoice.dateInvoice);
      const month = invoiceDate.getMonth();
      const trimester = Math.floor(month / 3);
      realInvoicesByTrimester[trimester].push(invoice);
    });

    // Recorrer cada trimestre y verificar
    for (let trimester = 0; trimester < 4; trimester++) {
      const trimesterField = `invoicesTrimester${trimester}`;
      const invoicesInBilling = billing[trimesterField] || [];
      const realInvoicesInTrimester = realInvoicesByTrimester[trimester];

      // Crear sets para comparación
      const billingInvoiceIds = new Set(invoicesInBilling.map(inv => inv.invoice.toString()));
      const realInvoiceIds = new Set(realInvoicesInTrimester.map(inv => inv._id.toString()));

      // Verificar si hay diferencias (facturas que sobran o faltan)
      const missingInvoices = realInvoicesInTrimester.filter(inv => !billingInvoiceIds.has(inv._id.toString()));
      const extraInvoices = invoicesInBilling.filter(inv => !realInvoiceIds.has(inv.invoice.toString()));

      // Si hay diferencias, reconstruir el trimestre completo
      if (missingInvoices.length > 0 || extraInvoices.length > 0) {
        hasChanges = true;
        logService.logInfo(`[recalc] - T${trimester + 1} del proveedor ${billing.provider}: ${missingInvoices.length} facturas faltantes, ${extraInvoices.length} facturas sobrantes`);

        // Marcar trimestre afectado
        if (!providerChanges.trimesters.includes(trimester + 1)) providerChanges.trimesters.push(trimester + 1);

        // Reconstruir con las facturas correctas
        billing[trimesterField] = realInvoicesInTrimester.map(invoice => ({
          invoice: invoice._id.toString(),
          total: invoice.total,
          date: invoice.dateInvoice,
        }));
      } else {
        // PASO 2: Si las facturas son las correctas, verificar totales individuales
        const updatedInvoices = invoicesInBilling.map(invInBilling => {
          const realInvoice = realInvoicesInTrimester.find(inv => inv._id.toString() === invInBilling.invoice.toString());

          if (realInvoice && invInBilling.total !== realInvoice.total) {
            logService.logInfo(`[recalc] - Actualizando factura ${invInBilling.invoice}: ${invInBilling.total} -> ${realInvoice.total}`);
            hasChanges = true;

            // Guardar detalle del cambio
            providerChanges.invoices.push({
              invoiceId: invInBilling.invoice,
              nInvoice: realInvoice.nInvoice,
              trimester: trimester + 1,
              oldTotal: invInBilling.total,
              newTotal: realInvoice.total,
            });

            // Marcar trimestre afectado
            if (!providerChanges.trimesters.includes(trimester + 1)) providerChanges.trimesters.push(trimester + 1);

            return {
              invoice: invInBilling.invoice,
              total: realInvoice.total,
              date: invInBilling.date,
            };
          }

          return invInBilling;
        });

        billing[trimesterField] = updatedInvoices;
      }
    }

    // PASO 3: Siempre recalcular los totales para verificar sumas trimestrales
    const newTotals = calcNewBilling(billing);

    // Verificar si los totales trimestrales o anuales difieren
    const totalsChanged = billing.trimesters.some((value, index) => value !== newTotals.trimesters[index])
      || billing.annual !== newTotals.annual;

    // PASO 4: Si hubo cambios en facturas o en totales
    if (hasChanges || totalsChanged) {
      if (totalsChanged) {
        logService.logInfo(`[recalc] - Actualizando totales del proveedor ${billing.provider}`);
        logService.logInfo(`[recalc] - Trimestres: ${billing.trimesters} -> ${newTotals.trimesters}`);
        logService.logInfo(`[recalc] - Anual: ${billing.annual} -> ${newTotals.annual}`);

        // Marcar trimestres afectados por error de suma y guardar detalles
        billing.trimesters.forEach((oldValue, index) => {
          if (oldValue !== newTotals.trimesters[index]) {
            const trimesterNum = index + 1;
            if (!providerChanges.trimesters.includes(trimesterNum)) {
              providerChanges.trimesters.push(trimesterNum);
            }

            // Agregar información del error de suma
            providerChanges.sumErrors.push({
              type: 'trimester',
              trimester: trimesterNum,
              oldTotal: oldValue,
              newTotal: newTotals.trimesters[index],
            });
          }
        });

        // Verificar error en total anual
        if (billing.annual !== newTotals.annual) {
          providerChanges.sumErrors.push({
            type: 'annual',
            oldTotal: billing.annual,
            newTotal: newTotals.annual,
          });
        }
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

      // Marcar provider para popular después
      providersToPopulate.add(billing.provider.toString());

      // Ordenar trimestres afectados
      providerChanges.trimesters.sort((a, b) => a - b);
      changes.push(providerChanges);
    }
  }

  // Solo popular los providers que tienen cambios
  if (providersToPopulate.size > 0) {
    const { ProviderModel } = require('arroyo-erp-models');
    const providers = await ProviderModel.find({
      _id: { $in: Array.from(providersToPopulate) },
    }).select('name businessName');

    const providerMap = new Map();
    providers.forEach(provider => {
      providerMap.set(provider._id.toString(), provider);
    });

    // Agregar nombres a los cambios
    changes.forEach(change => {
      const provider = providerMap.get(change.providerId);
      change.providerName = provider ? (provider.name || provider.businessName) : 'Proveedor';
    });
  }

  logService.logInfo(`[recalc] - Se actualizó la facturación de ${updatedCount} proveedores`);

  return {
    updated: updatedCount,
    changes,
  };
};

module.exports = recalc;
