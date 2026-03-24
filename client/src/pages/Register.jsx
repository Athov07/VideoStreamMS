import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import AuthInput from '../components/auth/AuthInput';
import { authService } from '../services/auth.service';
import { UserPlus, Save, Loader2, User } from 'lucide-react';

const Register = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [email] = useState(
    searchParams.get('email') || 
    location.state?.email || 
    localStorage.getItem('pendingEmail') || ""
  );

  const [isInitializing, setIsInitializing] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', username: '' });

  useEffect(() => {
    const urlToken = searchParams.get('token');
    if (urlToken) localStorage.setItem('accessToken', urlToken);

    const timer = setTimeout(() => {
      if (!email) navigate('/login');
      setIsInitializing(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [email, navigate, searchParams]);

  const handleFinish = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const currentEmail = email || localStorage.getItem('pendingEmail');

    if (!currentEmail) return navigate('/login');

    try {
      const response = await authService.register({ 
        email: currentEmail, 
        username: formData.username,
        firstName: formData.firstName,
        lastName: formData.lastName
      });
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.removeItem('pendingEmail');
      window.location.href = "/dashboard";
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (isInitializing) return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-primary" size={40} />
      <p className="text-surface-muted animate-pulse font-medium">Validating Secure Session...</p>
    </div>
  );

  return (
    <AuthLayout title="Complete Profile" subtitle="Just a few more details to get started">
      <div className="bg-surface border border-background-accent p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
        
        <div className="flex items-center gap-3 mb-8">
           <div className="bg-primary/20 p-2 rounded-lg text-primary">
              <UserPlus size={24} />
           </div>
           <h2 className="text-xl font-bold text-surface-text">Create Account</h2>
        </div>

        <form onSubmit={handleFinish} className="space-y-5">
          <div className="flex gap-4">
            <div className="flex-1 space-y-1">
              <label className="text-[10px] font-bold text-surface-muted uppercase tracking-wider">First Name</label>
              <AuthInput 
                placeholder="John"
                value={formData.firstName} 
                onChange={(e) => setFormData({...formData, firstName: e.target.value})} 
              />
            </div>
            <div className="flex-1 space-y-1">
              <label className="text-[10px] font-bold text-surface-muted uppercase tracking-wider">Last Name</label>
              <AuthInput 
                placeholder="Doe"
                value={formData.lastName} 
                onChange={(e) => setFormData({...formData, lastName: e.target.value})} 
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-surface-muted uppercase tracking-wider">Username</label>
            <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-bold">@</span>
                <input 
                  className="input-field pl-8" 
                  placeholder="unique_handle"
                  value={formData.username} 
                  onChange={(e) => setFormData({...formData, username: e.target.value})} 
                  required
                />
            </div>
          </div>

          <div className="bg-background-accent/20 p-4 rounded-xl border border-background-accent mt-4">
            <p className="text-[11px] text-surface-muted leading-relaxed">
              Email verified: <span className="text-white font-medium">{email}</span>
            </p>
          </div>

          <button 
            type="submit" 
            disabled={submitting || !formData.username} 
            className="btn-next w-full flex items-center justify-center gap-2 py-3 !rounded-xl mt-4"
          >
            {submitting ? <Loader2 className="animate-spin" size={20}/> : <Save size={20} />}
            {submitting ? "Creating Channel..." : "Finish Registration"}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Register;