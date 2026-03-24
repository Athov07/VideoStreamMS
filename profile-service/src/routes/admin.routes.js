import express from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { isAdmin } from '../middlewares/admin.middleware.js';
import { 
    getAllProfiles, 
    updateProfileByAdmin, 
    getSubscriptionStats,
    removeSubscriberByAdmin 
} from '../controllers/admin.controller.js';

const router = express.Router();

// Apply protection to all routes below
router.use(verifyJWT, isAdmin);

// Profile Admin Endpoints
router.get('/profiles/all', getAllProfiles);
router.patch('/profiles/:profileId', updateProfileByAdmin);

// Subscription Admin Endpoints
router.get('/subscriptions/stats', getSubscriptionStats);
router.delete('/subscriptions/:subscriptionId', removeSubscriberByAdmin);

export default router;