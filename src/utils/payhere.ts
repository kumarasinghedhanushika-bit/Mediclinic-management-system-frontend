import type { PayHereCheckout } from "../types";

/**
 * Redirect user to PayHere gateway using POST form securely
 */
export function redirectToPayHere(checkout: PayHereCheckout) {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = checkout.checkoutUrl;

  const fields: Record<string, string> = {
    merchant_id: checkout.merchantId,
    return_url: checkout.returnUrl,
    cancel_url: checkout.cancelUrl,
    notify_url: checkout.notifyUrl,

    order_id: checkout.orderId,
    items: checkout.items || "Consultation",
    currency: checkout.currency,
    amount: Number(checkout.amount).toFixed(2), // Force double decimal pricing matching the backend hash

    first_name: checkout.firstName || "Patient",
    last_name: checkout.lastName || "User",
    email: checkout.email || "",
    phone: checkout.phone || "",
    address: checkout.address || "Colombo",
    city: checkout.city || "Colombo",
    country: checkout.country || "Sri Lanka",

    hash: checkout.hash,
  };

  Object.entries(fields).forEach(([name, value]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
}