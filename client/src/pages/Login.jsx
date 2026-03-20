import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/auth/AuthLayout";
import AuthInput from "../components/auth/AuthInput";
import { authService } from "../services/auth.service";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1: Email, 2: OTP
  const [loading, setLoading] = useState(false);

  // STEP 1: Request OTP
  const handleNext = async (e) => {
    e.preventDefault();
    if (!email) return alert("Please enter your email");

    setLoading(true);
    try {
      await authService.sendOtp(email);
      setStep(2);
    } catch (err) {
      alert(err.response?.data?.message || "Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Verify OTP & Handle Redirection
  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await authService.verifyOtp(email, otp);

      if (data.isNewUser) {
        // 1. Save email to storage so Register.jsx can ALWAYS find it
        localStorage.setItem("pendingEmail", email);

        // 2. Navigate to register
        navigate("/register");
      } else {
        localStorage.setItem("accessToken", data.accessToken);
        navigate("/dashboard");
      }
    } catch (err) {
      alert("Invalid OTP or Session Expired");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    authService.googleLogin();
  };

  return (
    <AuthLayout
      title={step === 1 ? "Sign in" : "Verify it's you"}
      subtitle={
        step === 1
          ? "Continue to VideoStream"
          : `A 6-digit code was sent to ${email}`
      }
    >
      <form onSubmit={step === 1 ? handleNext : handleVerify}>
        {step === 1 ? (
          <AuthInput
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        ) : (
          <AuthInput
            label="Enter Verification Code"
            placeholder="G-XXXXXX"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        )}

        <div className="flex justify-between items-center mt-10">
          <button
            type="button"
            onClick={() => (step === 2 ? setStep(1) : navigate("/register"))}
            className="text-blue-500 font-semibold text-sm hover:underline"
          >
            {step === 2 ? "Try another way" : "Create account"}
          </button>

          <button
            type="submit"
            disabled={loading}
            className="btn-next min-w-[100px] flex justify-center items-center"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : step === 1 ? (
              "Next"
            ) : (
              "Verify"
            )}
          </button>
        </div>
      </form>

      {/* Google Login Section - Only shows on Step 1 */}
      {step === 1 && (
        <>
          <div className="relative flex py-8 items-center">
            <div className="flex-grow border-t border-background-accent"></div>
            <span className="flex-shrink mx-4 text-surface-muted text-xs uppercase tracking-widest">
              or
            </span>
            <div className="flex-grow border-t border-background-accent"></div>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 font-semibold py-2.5 rounded-full border border-gray-300 hover:bg-gray-50 transition-all shadow-sm"
          >
            <img
              src="https://www.svgrepo.com/show/355037/google.svg"
              className="w-5 h-5"
              alt="Google Icon"
            />
            Sign in with Google
          </button>
        </>
      )}
    </AuthLayout>
  );
};

export default Login;
