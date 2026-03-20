import express from 'express';
import passport from 'passport';
import * as auth from '../controllers/auth.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/send-otp', auth.sendOtpController);
router.post('/resend-otp', auth.resendOtpController);
router.post('/verify-otp', auth.verifyOtpController);
router.post('/register', auth.registerController);
router.post('/login', auth.loginController);
router.post('/logout', authMiddleware, auth.logoutController);

// 1. Trigger Google Login
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// 2. Google Callback (Handles the redirect from Google)
router.get('/google/callback', 
    passport.authenticate('google', { session: false, failureRedirect: '/login' }),
    auth.googleCallbackController
);

export default router;
