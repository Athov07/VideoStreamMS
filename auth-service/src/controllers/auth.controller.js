import * as otpService from "../services/otp.service.js";
import * as tokenService from "../services/token.service.js";
import * as userService from "../services/user.service.js";
import User from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { CLIENT_URLS } from "../constants/index.js";
import { AuditLog } from "../models/auditLog.model.js";
import mongoose from "mongoose";
import { emitAuthEvent } from "../services/kafka.service.js";

// 1. Send OTP to Gmail
export const sendOtpController = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) throw new ApiError(400, "Email is required");

  await otpService.sendOtp(email);

  const normalizedEmail = email.toLowerCase().trim();

  const existingUser = await User.findOne({ email: normalizedEmail });

  // 3. AUDIT LOG: Initial OTP Request
  await AuditLog.create({
    userId: existingUser
      ? existingUser._id
      : new mongoose.Types.ObjectId("000000000000000000000000"),
    action: "AUTH_OTP_REQUEST_SEND",
    resourceId: existingUser
      ? existingUser._id
      : new mongoose.Types.ObjectId("000000000000000000000000"),
    resourceType: "User",
    details: {
      email: normalizedEmail,
      isExistingUser: !!existingUser,
      ip: req.ip,
      userAgent: req.get("User-Agent"),
    },
  });
  res.status(200).json({ success: true, message: "OTP sent to email" });
});

// 2. Verify OTP (Check if user exists or needs registration)
export const verifyOtpController = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const isValid = await otpService.verifyOtp(email, otp);

  if (!isValid) throw new ApiError(400, "Invalid or expired OTP");

  let user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    user = await User.create({
      email: email.toLowerCase(),
      isVerified: true,
    });

    // KAFKA EMIT
    await emitAuthEvent("USER_CREATED_PENDING", {
      userId: user._id,
      email: user.email,
    });

    // AUDIT LOG: Initial user creation
    await AuditLog.create({
      userId: user._id,
      action: "AUTH_OTP_INITIAL_CREATE",
      resourceId: user._id,
      resourceType: "User",
      details: { email: user.email },
    });

    return res.status(200).json({
      success: true,
      isNewUser: true,
      message: "OTP verified. Please complete your profile.",
    });
  }

  // 3. EXISTING USER LOGIC: Generate tokens and login
  const tokens = tokenService.generateTokens(user);
  await userService.updateRefreshToken(user._id, tokens.refreshToken);

  // AUDIT LOG: Existing user login via OTP
  await AuditLog.create({
    userId: user._id,
    action: "AUTH_LOGIN_OTP",
    resourceId: user._id,
    resourceType: "User",
  });

  res.status(200).json({
    success: true,
    user,
    ...tokens,
  });
});

// 3. Register New User (Saves names and username)
export const registerController = asyncHandler(async (req, res) => {
  const { email, username, firstName, lastName } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ message: "Email is required to complete session." });
  }

  const normalizedEmail = email.toLowerCase().trim();

  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    return res.status(404).json({
      message: `No active session found for ${normalizedEmail}. Please verify OTP again.`,
    });
  }

  user.username = username;
  user.firstName = firstName;
  user.lastName = lastName;
  user.isVerified = true;

  await user.save();

  // KAFKA EMIT
  await emitAuthEvent("USER_REGISTERED", {
    userId: user._id,
    email: user.email,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
  });

  const tokens = tokenService.generateTokens(user);

  // AUDIT LOG: Registration completed
  await AuditLog.create({
    userId: user._id,
    action: "AUTH_REGISTER_COMPLETE",
    resourceId: user._id,
    resourceType: "User",
    details: { username },
  });

  res.status(200).json({
    message: "Registration successful",
    ...tokens,
    user: {
      id: user._id,
      email: user.email,
      username: user.username,
    },
  });
});

// 4. Google OAuth Callback
export const googleCallbackController = asyncHandler(async (req, res) => {
  const { _id, email, username } = req.user;
  const { accessToken, refreshToken } = tokenService.generateTokens(req.user);

  await userService.updateRefreshToken(_id, refreshToken);

  // Audit Log
  await AuditLog.create({
    userId: _id,
    action: "AUTH_LOGIN_GOOGLE",
    resourceId: _id,
    resourceType: "User",
    details: {
      email,
      isNewUser: !username,
      timestamp: new Date(),
    },
  });

  if (!username) {
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

  // AUDIT LOG: Manual login
  await AuditLog.create({
    userId: user._id,
    action: "AUTH_LOGIN_MANUAL",
    resourceId: user._id,
    resourceType: "User",
  });

  res.status(200).json({ success: true, user, ...tokens });
});

// 6. Logout (Clears refresh token from DB)
export const logoutController = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  await userService.updateRefreshToken(userId, null);

  // AUDIT LOG: Logout
  await AuditLog.create({
    userId: userId,
    action: "AUTH_LOGOUT",
    resourceId: userId,
    resourceType: "User",
  });

  res.status(200).json({ success: true, message: "Logged out successfully" });
});

// 7. Resend OTP Controller
export const resendOtpController = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required to resend OTP");
  }

  await otpService.sendOtp(email);
  const user = await User.findOne({ email: email.toLowerCase() });

  //AUDIT LOG: Resend Request
  await AuditLog.create({
    userId: user ? user._id : new mongoose.Types.ObjectId(),
    action: "AUTH_OTP_RESEND",
    resourceId: user ? user._id : new mongoose.Types.ObjectId(),
    resourceType: "User",
    details: {
      email: email.toLowerCase(),
      reason: "User requested new OTP",
      ip: req.ip,
    },
  });

  res.status(200).json({
    success: true,
    message: "A new OTP has been sent to your email.",
  });
});
