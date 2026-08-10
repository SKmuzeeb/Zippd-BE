import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../lib/asyncHandler.js';
import { validate } from '../middleware/validate.js';
import * as productsController from '../controllers/products.controller.js';

const router = Router();

const listQuerySchema = z.object({
  kirana_id: z.string().uuid().optional(),
});

router.get('/', validate(listQuerySchema, 'query'), asyncHandler(productsController.listProducts));
router.get('/:id', asyncHandler(productsController.getProduct));

export default router;
