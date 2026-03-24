import express from 'express';
import * as admin from '../controllers/admin.controller.js';
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isAdmin } from '../middlewares/admin.middleware.js';

const router = express.Router();

router.use(verifyJWT, isAdmin);

router.get('/all', admin.getAllVideosForAdmin);
router.delete('/:videoId', admin.deleteVideoAdmin);
router.patch('/:videoId/premium', admin.togglePremiumStatus);

export default router;