import { faker } from '@faker-js/faker';
import { rangeFill } from '../utils';

export const generateClientDOProduct = () => ({
  name: faker.commerce.productName(),
  weight: faker.datatype.number({ max: 999 }),
  unit: faker.helpers.arrayElement(['Kg', 'gr', 'ud', 'uds']),
  price: faker.datatype.number(),
  total: faker.datatype.number(),
});
export const generateClientDeliveryOrder = () => ({
  date: faker.date.past().getTime(),
  products: rangeFill(faker.datatype.number(), generateClientDOProduct),
});
