import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    if (token) {
      localStorage.setItem("accessToken", token);
      
      if (email) {
        // New User: Send to Register and pass the email
        navigate("/register", { state: { email }, replace: true });
      } else {
        // Existing User: Send to Dashboard
        navigate("/dashboard", { replace: true });
      }
    } else {
      navigate("/login", { replace: true });
    }
  }, [navigate, searchParams]);

  return <div className="text-white p-10">Finalizing sign-in...</div>;
};

export default AuthCallback;