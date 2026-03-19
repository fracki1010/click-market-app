export const formatPrice = (price: any): string => {
  const num = Number(price);
  const safePrice = isNaN(num) ? 0 : num;
  return new Intl.NumberFormat("es-AR").format(safePrice);
};
