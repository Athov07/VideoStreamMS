import * as otpService from '../services/otp.service.js';
import * as tokenService from '../services/token.service.js';
import * as userService from '../services/user.service.js';
import User from '../models/user.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import { CLIENT_URLS } from '../constants/index.js';

// 1. Send OTP to Gmail
export const sendOtpController = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) throw new ApiError(400, "Email is required");

    await otpService.sendOtp(email);
    res.status(200).json({ success: true, message: 'OTP sent to email' });
});

// 2. Verify OTP (Check if user exists or needs registration)
export const verifyOtpController = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;
    const isValid = await otpService.verifyOtp(email, otp);

    if (!isValid) throw new ApiError(400, "Invalid or expired OTP");

    // 1. Check if user already exists
    let user = await User.findOne({ email: email.toLowerCase() });

    // 2. NEW USER LOGIC: Create the record now!
    if (!user) {
        // We create the user with just the email and mark them verified.
        // This is the "Active Session" the register controller is looking for.
        user = await User.create({
            email: email.toLowerCase(),
            isVerified: true, // They passed OTP, so they are verified
        });

        return res.status(200).json({ 
            success: true, 
            isNewUser: true, 
            message: "OTP verified. Please complete your profile.",
            // Optional: You can send a temp token here if your register route is protected
        });
    }

    // 3. EXISTING USER LOGIC: Generate tokens and login
    const tokens = tokenService.generateTokens(user);
    await userService.updateRefreshToken(user._id, tokens.refreshToken);

    res.status(200).json({ 
        success: true, 
        user, 
        ...tokens 
    });
});

// 3. Register New User (Saves names and username)
export const registerController = asyncHandler(async (req, res) => {
    // 1. Destructure and Normalize
    const { email, username, firstName, lastName } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required to complete session." });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 2. Find the user
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
        // If we hit this, the email sent by the frontend 
        // does not exist in your MongoDB 'users' collection.
        return res.status(404).json({ 
            message: `No active session found for ${normalizedEmail}. Please verify OTP again.` 
        });
    }

    // 3. Update and Save
    user.username = username;
    user.firstName = firstName;
    user.lastName = lastName;
    user.isVerified = true; 
    
    await user.save();

    const tokens = tokenService.generateTokens(user);
    
    // 4. Return user without sensitive data if necessary
    res.status(200).json({ 
        message: "Registration successful",
        ...tokens, 
        user: {
            id: user._id,
            email: user.email,
            username: user.username
        }
    });
});

// 4. Google OAuth Callback
export const googleCallbackController = asyncHandler(async (req, res) => {
    const { _id, email, username } = req.user;

    // Generate session tokens
    const { accessToken, refreshToken } = tokenService.generateTokens(req.user);
    
    // Persist refresh token for session management
    await userService.updateRefreshToken(_id, refreshToken);
    
    // Professional Redirect Handling
    if (!username) {
        // Construct URL using URLSearchParams for safety (handles encoding)
        const redirectUrl = new URL(CLIENT_URLS.COMPLETE_PROFILE);
        redirectUrl.searchParams.append("token", accessToken);
        redirectUrl.searchParams.append("email", email);
        
        return res.redirect(redirectUrl.toString());
    }

    const dashboardUrl = new URL(CLIENT_URLS.DASHBOARD);
    dashboardUrl.searchParams.append("token", accessToken);
    
    res.redirect(dashboardUrl.toString());
});

// 5. Login Controller (Requires email only if OTP already verified)
export const loginController = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) throw new ApiError(404, "User not found. Please register.");

    const tokens = tokenService.generateTokens(user);
    await userService.updateRefreshToken(user._id, tokens.refreshToken);

    res.status(200).json({ success: true, user, ...tokens });
});

// 6. Logout (Clears refresh token from DB)
export const logoutController = asyncHandler(async (req, res) => {
    const userId = req.user._id; // Injected by authMiddleware
    await userService.updateRefreshToken(userId, null);
    
    res.status(200).json({ success: true, message: 'Logged out successfully' });
});


// 7. Resend OTP Controller
export const resendOtpController = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        throw new ApiError(400, "Email is required to resend OTP");
    }

    // Logic: Simply trigger the sendOtp again. 
    // The service handles overwriting the old OTP in the Map/Redis.
    await otpService.sendOtp(email);

    res.status(200).json({
        success: true,
        message: "A new OTP has been sent to your email."
    });
});