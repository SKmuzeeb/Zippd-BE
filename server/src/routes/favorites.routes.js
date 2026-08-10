import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../lib/asyncHandler.js';
import { validate } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
import * as favoritesController from '../controllers/favorites.controller.js';

const router = Router();

const addFavoriteSchema = z.object({
  product_id: z.string().uuid(),
});

router.use(requireAuth);

router.get('/', asyncHandler(favoritesController.listFavorites));
router.post('/', validate(addFavoriteSchema), asyncHandler(favoritesController.addFavorite));
router.delete('/:productId', asyncHandler(favoritesController.removeFavorite));

export default router;
