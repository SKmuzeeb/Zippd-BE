import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../lib/asyncHandler.js';
import { validate } from '../middleware/validate.js';
import * as kiranasController from '../controllers/kiranas.controller.js';

const router = Router();

const listQuerySchema = z.object({
  city: z.string().trim().min(1).optional(),
});

router.get('/', validate(listQuerySchema, 'query'), asyncHandler(kiranasController.listKiranas));
router.get('/:id', asyncHandler(kiranasController.getKirana));

export default router;
