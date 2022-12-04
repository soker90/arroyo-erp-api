export const rangeFill = (length, fillFn) => Array.from({ length }, fillFn);
export const range = length => rangeFill(length, (_, i) => i);
