export function generateOrderId() {
  return `ORD-${Date.now().toString(36).toUpperCase()}`;
}
