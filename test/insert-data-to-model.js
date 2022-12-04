import { faker } from '@faker-js/faker';
import {
  ClientInvoiceModel,
} from 'arroyo-erp-models';

import { generateClientDeliveryOrder } from './generate-values';
import { rangeFill } from '../utils';

export const insertClientInvoice = async (params = {}) => ClientInvoiceModel.create({
  taxBase: params.taxBase ?? faker.datatype.number({
    min: 100,
    max: 5000,
  }),
  iva: params.iva ?? faker.datatype.number({
    min: 1,
    max: 500,
  }),
  total: params.total ?? faker.datatype.number({
    min: 100,
    max: 5000,
  }),
  date: params.date ?? faker.date.past()
    .getTime(),
  nInvoice: params.nInvoice ?? `${faker.datatype.number({
    min: 20,
    max: 30,
  })}-${faker.datatype.number({
    min: 1,
    max: 80,
  })}`,
  deliveryOrders: params.deliveryOrders ?? rangeFill(faker.datatype.number({
    max: 10,
    min: 1,
  }), generateClientDeliveryOrder),
});
