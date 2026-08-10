import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../lib/asyncHandler.js';
import { validate } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
import * as authController from '../controllers/auth.controller.js';

const router = Router();

const magicLinkSchema = z.object({
  email: z.string().email(),
});

router.post('/magic-link', validate(magicLinkSchema), asyncHandler(authController.requestMagicLink));
router.get('/verify', asyncHandler(authController.verifyMagicLink));
router.get('/me', requireAuth, asyncHandler(authController.getMe));

export default router;
