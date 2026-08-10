import * as ordersService from '../services/orders.service.js';

export async function createOrder(req, res) {
  const { kirana_id, pickup_slot, total, payment_method, items } = req.body;

  const order = await ordersService.createOrder({
    userId: req.user?.id ?? null,
    kiranaId: kirana_id,
    pickupSlot: pickup_slot,
    total,
    paymentMethod: payment_method,
    items,
  });

  res.status(201).json(order);
}

export async function listMyOrders(req, res) {
  const orders = await ordersService.listOrdersForUser(req.user.id);
  res.json({ data: orders });
}

export async function getOrder(req, res) {
  const order = await ordersService.getOrderById(req.params.id);

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  res.json(order);
}

export async function updateStatus(req, res) {
  const existing = await ordersService.getOrderById(req.params.id);

  if (!existing) {
    return res.status(404).json({ error: 'Order not found' });
  }

  if (existing.user_id && existing.user_id !== req.user.id) {
    return res.status(403).json({ error: 'You do not have permission to update this order' });
  }

  const updated = await ordersService.updateOrderStatus(req.params.id, req.body.status);
  res.json(updated);
}
