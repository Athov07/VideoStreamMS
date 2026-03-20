import nodemailer from 'nodemailer';

// Temporary in-memory storage (Resets if server restarts)
const otpStore = new Map(); 

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOtp = async (email) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Store OTP with an expiry timestamp (5 minutes from now)
  const expiresAt = Date.now() + 5 * 60 * 1000;
  otpStore.set(email, { otp, expiresAt });

  console.log(`OTP for ${email} is ${otp}`); // For debugging

  const mailOptions = {
    from: `"YouTube Clone" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your Verification Code',
    text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
  };

  return await transporter.sendMail(mailOptions);
};

export const verifyOtp = async (email, otp) => {
  const data = otpStore.get(email);
  
  if (!data) return false;
  if (Date.now() > data.expiresAt) {
    otpStore.delete(email);
    return false;
  }
  if (data.otp === otp) {
    otpStore.delete(email);
    return true;
  }
  return false;
};