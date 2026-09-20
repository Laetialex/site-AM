export function formatPrice(amountInEuros: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: amountInEuros % 1 === 0 ? 0 : 2,
  }).format(amountInEuros);
}
