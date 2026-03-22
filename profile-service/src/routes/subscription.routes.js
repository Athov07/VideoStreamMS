import express from 'express';
import { toggleSubscription, getChannelSubscribers } from '../controllers/subscription.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/subscribe/:channelId', verifyJWT, toggleSubscription);
router.get('/subscribers/:channelId', getChannelSubscribers);

export default router;