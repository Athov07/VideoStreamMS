import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import AuthInput from '../components/auth/AuthInput';
import { authService } from '../services/auth.service';

const Register = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  // ONLY allow email from secure sources
  const [email] = useState(
    searchParams.get('email') || 
    location.state?.email || 
    localStorage.getItem('pendingEmail') || 
    ""
  );

  const [isInitializing, setIsInitializing] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', username: '' });

  useEffect(() => {
    // If a Google token is in URL, save it
    const urlToken = searchParams.get('token');
    if (urlToken) localStorage.setItem('accessToken', urlToken);

    // Security Gate: If no email found after 500ms, kick to login
    const timer = setTimeout(() => {
      if (!email) navigate('/login');
      setIsInitializing(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [email, navigate, searchParams]);

const handleFinish = async (e) => {
  e.preventDefault();
  setSubmitting(true);

  // 1. Get the email (ensure it's not empty)
  const currentEmail = email || localStorage.getItem('pendingEmail');

  if (!currentEmail) {
    alert("Session lost. Please go back to login.");
    return navigate('/login');
  }

  try {
    // 2. Pass the email EXPLICITLY in the object
    const response = await authService.register({ 
      email: currentEmail, // This is what the backend is looking for!
      username: formData.username,
      firstName: formData.firstName,
      lastName: formData.lastName
    });

    localStorage.setItem('accessToken', response.accessToken);
    localStorage.removeItem('pendingEmail'); // Cleanup success
    window.location.href = "/dashboard";
  } catch (err) {
    // If you hit "No active session", it means 'currentEmail' 
    // was sent but the Backend couldn't find it in MongoDB.
    alert(err.response?.data?.message || "Registration failed");
  } finally {
    setSubmitting(false);
  }
};

  if (isInitializing) return <div className="min-h-screen bg-background flex items-center justify-center text-white">Verifying session...</div>;

  return (
    <AuthLayout title="Complete Profile" subtitle={`Signing up as ${email}`}>
      <form onSubmit={handleFinish} className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <AuthInput label="First Name" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
          </div>
          <div className="flex-1">
            <AuthInput label="Last Name" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
          </div>
        </div>
        <AuthInput label="Username" placeholder="@unique_handle" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} />
        <button type="submit" disabled={submitting || !formData.username} className="btn-next w-full mt-6">
          {submitting ? "Saving..." : "Finish"}
        </button>
      </form>
    </AuthLayout>
  );
};

export default Register;