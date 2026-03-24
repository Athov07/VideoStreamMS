import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/auth/AuthLayout";
import AuthInput from "../components/auth/AuthInput";
import { authService } from "../services/auth.service";
import { Mail, ShieldCheck, ArrowRight, Loader2, RotateCcw } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); 
  const [loading, setLoading] = useState(false);
  
  // Resend OTP States
  const [resendCountdown, setResendCountdown] = useState(0);
  const [isResending, setIsResending] = useState(false);

  // Handle Countdown Timer
  useEffect(() => {
    let timer;
    if (resendCountdown > 0) {
      timer = setInterval(() => {
        setResendCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCountdown]);

  const handleNext = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await authService.sendOtp(email);
      setStep(2);
      setResendCountdown(60); // Start 60s cooldown after first send
    } catch (err) {
      alert(err.response?.data?.message || "Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCountdown > 0 || isResending) return;
    
    setIsResending(true);
    try {
      await authService.resendOtp(email);
      setResendCountdown(60); // Reset timer
      alert("New code sent to " + email);
    } catch (err) {
      alert("Failed to resend code.");
    } finally {
      setIsResending(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await authService.verifyOtp(email, otp);
      if (data.isNewUser) {
        localStorage.setItem("pendingEmail", email);
        navigate("/register");
      } else {
        localStorage.setItem("accessToken", data.accessToken);
        if (data.user){localStorage.setItem("user", JSON.stringify(data.user));
        if (data.user.role === "admin") {
            navigate("/admin/dashboard");
          } else {
            navigate("/dashboard");
          }
          } 
      }
    } catch (err) {
      alert("Invalid OTP or Session Expired");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title={step === 1 ? "Welcome Back" : "Verify OTP"}
      subtitle={step === 1 ? "Sign in to your VideoStream account" : `Sent to ${email}`}
    >
      <div className="bg-surface border border-background-accent p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>

        <form onSubmit={step === 1 ? handleNext : handleVerify} className="space-y-6">
          <div className="flex items-center gap-3 mb-2">
             <div className="bg-primary/20 p-2 rounded-lg text-primary">
                {step === 1 ? <Mail size={20}/> : <ShieldCheck size={20}/>}
             </div>
             <p className="text-sm font-bold text-surface-text uppercase tracking-widest">
                {step === 1 ? "Email Access" : "Security Code"}
             </p>
          </div>

          {step === 1 ? (
            <AuthInput
              label="Email Address"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
            />
          ) : (
            <div className="space-y-4">
              <AuthInput
                label="6-Digit Code"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="input-field text-center tracking-[1em] font-bold"
              />
              
              {/* Resend OTP Button */}
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendCountdown > 0 || isResending}
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-tighter transition-all
                  disabled:text-surface-muted text-primary hover:text-primary-dark"
                >
                  {isResending ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <RotateCcw size={14} />
                  )}
                  {resendCountdown > 0 
                    ? `Resend Code in ${resendCountdown}s` 
                    : "I didn't get a code"}
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-4 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="btn-next w-full flex justify-center items-center gap-2 py-3 !rounded-xl"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  {step === 1 ? "Get Secure Code" : "Verify & Access"}
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => (step === 2 ? setStep(1) : navigate("/register"))}
              className="text-surface-muted text-sm font-medium hover:text-white transition-colors"
            >
              {step === 2 ? "Use different email" : "Don't have an account? Sign up"}
            </button>
          </div>
        </form>

        {step === 1 && (
          <div className="mt-8">
            <div className="relative flex items-center mb-6">
              <div className="flex-grow border-t border-background-accent"></div>
              <span className="mx-4 text-surface-muted text-[10px] uppercase tracking-tighter">Secure Social Login</span>
              <div className="flex-grow border-t border-background-accent"></div>
            </div>

            <button
              onClick={() => authService.googleLogin()}
              className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 font-bold py-3 rounded-xl hover:bg-gray-100 transition-all shadow-lg active:scale-95"
            >
              <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-5 h-5" alt="Google" />
              Continue with Google
            </button>
          </div>
        )}
      </div>
    </AuthLayout>
  );
};

export default Login;