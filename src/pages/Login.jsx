import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Building2, ArrowRight } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await login(email.trim(), password);
      if (result.success) {
        showToast(`Welcome back, ${result.user?.name || 'User'}!`, 'success');
        navigate('/user/dashboard');
      } else {
        setError(result.message || 'Invalid email or password.');
        showToast(result.message || 'Login failed', 'error');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please verify your credentials.';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-[#0F1117] flex flex-col justify-between p-4 sm:p-6 max-w-lg mx-auto">
      {/* Top Header */}
      <div className="pt-4 flex items-center justify-between">
        <div
          onClick={() => navigate('/')}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="w-9 h-9 rounded-12px bg-white dark:bg-[#1A1D27] p-0.5 border border-[#E5E7EB] dark:border-[#2D3143] shadow-sm flex items-center justify-center overflow-hidden">
            <img src="/propease-logo.png" alt="PropEase" className="w-full h-full object-contain" />
          </div>
          <span className="text-lg font-bold font-heading text-[#111827] dark:text-[#F1F5F9]">
            Prop<span className="text-[#3B4FCD] dark:text-[#A5B4FC]">Ease</span>
          </span>
        </div>

        <Link
          to="/register"
          className="text-xs font-semibold text-[#3B4FCD] dark:text-[#A5B4FC] hover:underline"
        >
          Create Account
        </Link>
      </div>

      {/* Main Login Form Container */}
      <div className="my-auto py-6 flex flex-col gap-6 animate-fade-in">
        <div>
          <h2 className="text-2xl font-extrabold font-heading text-[#111827] dark:text-[#F1F5F9]">
            Welcome Back
          </h2>
          <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-1">
            Sign in with your registered account to manage properties, schedule visits, and access inquiries.
          </p>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Email Address"
            type="email"
            icon={Mail}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError('');
            }}
            placeholder="you@example.com"
            required
            autoFocus
          />

          <Input
            label="Password"
            type="password"
            icon={Lock}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError('');
            }}
            placeholder="••••••••"
            required
          />

          {error && (
            <p className="text-xs text-[#EF4444] font-medium bg-[#FEE2E2] dark:bg-[#7F1D1D]/30 p-2.5 rounded-8px border border-[#FECACA] dark:border-[#991B1B]/40">
              {error}
            </p>
          )}

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-[#6B7280] dark:text-[#9CA3AF]">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 rounded text-[#3B4FCD] focus:ring-[#3B4FCD]"
              />
              Remember me
            </label>
            <span className="text-[#3B4FCD] dark:text-[#A5B4FC] hover:underline cursor-pointer">
              Forgot password?
            </span>
          </div>

          <Button
            type="submit"
            size="lg"
            variant="primary"
            loading={loading}
            icon={ArrowRight}
            iconPosition="right"
            className="w-full mt-2 shadow-pop"
          >
            Sign In
          </Button>
        </form>
      </div>

      {/* Footer Link */}
      <div className="pb-safe text-center">
        <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-bold text-[#3B4FCD] dark:text-[#A5B4FC] hover:underline"
          >
            Register for Free
          </Link>
        </p>
      </div>
    </div>
  );
};
