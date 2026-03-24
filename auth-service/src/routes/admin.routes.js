import express from 'express';
import * as admin from '../controllers/admin.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import { isAdmin } from '../middlewares/admin.middleware.js';

const router = express.Router();

router.use(authMiddleware);
router.use(isAdmin);

router.get('/users', admin.getAllUsers);
router.patch('/users/role', admin.toggleUserRole);

export default router;