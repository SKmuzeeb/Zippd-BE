import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../lib/asyncHandler.js';
import { validate } from '../middleware/validate.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';
import * as ordersController from '../controllers/orders.controller.js';

const router = Router();

const orderItemSchema = z.object({
  productId: z.string().uuid().nullable().optional(),
  name: z.string().min(1),
  description: z.string().nullable().optional(),
  price_rupees: z.number().nonnegative(),
  unit: z.enum(['kg', 'g', 'pcs', 'l', 'pack']),
  quantity: z.number().positive(),
});

const createOrderSchema = z.object({
  kirana_id: z.string().uuid(),
  pickup_slot: z.string().min(1),
  total: z.number().nonnegative(),
  payment_method: z.string().min(1).default('pay_at_pickup'),
  items: z.array(orderItemSchema).min(1),
});

const updateStatusSchema = z.object({
  status: z.enum(['pending', 'ready', 'picked_up', 'cancelled']),
});

// sign-in optional: guest checkout is allowed, req.user is attached only if a valid token is sent
router.post('/', optionalAuth, validate(createOrderSchema), asyncHandler(ordersController.createOrder));
router.get('/', requireAuth, asyncHandler(ordersController.listMyOrders));
router.get('/:id', asyncHandler(ordersController.getOrder));
router.patch('/:id/status', requireAuth, validate(updateStatusSchema), asyncHandler(ordersController.updateStatus));

export default router;
