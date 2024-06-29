export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("ar-eg", {
    style: "currency",
    currency: "EGP",
  }).format(price);
};
