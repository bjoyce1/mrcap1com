export type VaultPayment = {
  status?: string;
  purchase_units?: { custom_id?: string; payments?: { captures?: { id?: string; custom_id?: string; status?: string; amount?: { currency_code?: string; value?: string } }[] } }[];
};

export function verifiedVaultCapture(order: VaultPayment, purchaseId: string, cents: number): string | null {
  const units = order.purchase_units;
  const unit = units?.[0];
  const captures = unit?.payments?.captures;
  const capture = captures?.[0];
  return order.status === "COMPLETED" && units?.length === 1 && captures?.length === 1 &&
    (unit?.custom_id ?? capture?.custom_id) === `vault:${purchaseId}` && capture?.status === "COMPLETED" &&
    capture.amount?.currency_code === "USD" && capture.amount.value === (cents / 100).toFixed(2) && capture.id
    ? capture.id : null;
}