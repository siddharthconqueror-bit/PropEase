import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Phone, Lock, Building2, ShieldCheck, UserCheck, ArrowRight } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { showToast } = useToast();

  const [role, setRole] = useState('CUSTOMER'); // 'CUSTOMER' | 'AGENT'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password || !phone.trim()) {
      setError('Please fill in all mandatory fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!agreedToTerms) {
      setError('Please agree to the PropEase terms and TN RERA user declaration.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await register({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
        role: role === 'AGENT' ? 'AGENT' : 'CUSTOMER'
      });

      if (result.success) {
        showToast(`Welcome to PropEase, ${name}! Your account is now active.`, 'success');
        navigate('/user/dashboard');
      } else {
        setError(result.message || 'Registration failed.');
        showToast(result.message || 'Registration failed', 'error');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration error occurred.';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-[#0F1117] flex flex-col justify-between p-4 sm:p-6 max-w-lg mx-auto">
      {/* Top Brand Bar */}
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
          to="/login"
          className="text-xs font-semibold text-[#3B4FCD] dark:text-[#A5B4FC] hover:underline"
        >
          Sign In
        </Link>
      </div>

      {/* Registration Form */}
      <div className="my-auto py-6 flex flex-col gap-5 animate-fade-in">
        <div>
          <h2 className="text-2xl font-extrabold font-heading text-[#111827] dark:text-[#F1F5F9]">
            Create an Account
          </h2>
          <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-1">
            Join thousands of property seekers and verified builders across Tamil Nadu.
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-2 gap-2.5">
          <div
            onClick={() => setRole('CUSTOMER')}
            className={`p-3.5 rounded-16px border cursor-pointer transition-all ${
              role === 'CUSTOMER'
                ? 'bg-white dark:bg-[#1A1D27] border-[#3B4FCD] ring-2 ring-[#EEF2FF] dark:ring-[#23262F] shadow-sm'
                : 'bg-white/60 dark:bg-[#1A1D27]/60 border-[#E5E7EB] dark:border-[#2D3143] opacity-80'
            }`}
          >
            <div className="flex items-center gap-2 text-[#3B4FCD] dark:text-[#A5B4FC] mb-1">
              <UserCheck className="w-4 h-4" />
              <span className="text-xs font-bold">Buyer / Seeker</span>
            </div>
            <p className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF]">
              Browse, save, and inquire for personal properties
            </p>
          </div>

          <div
            onClick={() => setRole('AGENT')}
            className={`p-3.5 rounded-16px border cursor-pointer transition-all ${
              role === 'AGENT'
                ? 'bg-white dark:bg-[#1A1D27] border-[#3B4FCD] ring-2 ring-[#EEF2FF] dark:ring-[#23262F] shadow-sm'
                : 'bg-white/60 dark:bg-[#1A1D27]/60 border-[#E5E7EB] dark:border-[#2D3143] opacity-80'
            }`}
          >
            <div className="flex items-center gap-2 text-[#0EA5A0] mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-xs font-bold">Agent / Builder</span>
            </div>
            <p className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF]">
              List TN RERA verified projects & manage leads
            </p>
          </div>
        </div>

        {/* Inputs */}
        <form onSubmit={handleRegister} className="flex flex-col gap-3.5">
          <Input
            label="Full Name"
            type="text"
            icon={User}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError('');
            }}
            placeholder="e.g. Anand Sharma"
            required
            autoFocus
          />

          <Input
            label="Email Address"
            type="email"
            icon={Mail}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError('');
            }}
            placeholder="anand@example.com"
            required
          />

          <Input
            label="Phone Number (+91)"
            type="tel"
            icon={Phone}
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              setError('');
            }}
            placeholder="+91 98765 43210"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
            <Input
              label="Confirm Password"
              type="password"
              icon={Lock}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError('');
              }}
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <p className="text-xs text-[#EF4444] font-medium bg-[#FEE2E2] dark:bg-[#7F1D1D]/30 p-2.5 rounded-8px border border-[#FECACA] dark:border-[#991B1B]/40">
              {error}
            </p>
          )}

          <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#6B7280] dark:text-[#9CA3AF] pt-1">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-[#3B4FCD] focus:ring-[#3B4FCD]"
            />
            <span>
              I agree to the <span className="text-[#3B4FCD] dark:text-[#A5B4FC] underline">Terms of Service</span>, Privacy Policy, and TN RERA verified broker standards.
            </span>
          </label>

          <Button
            type="submit"
            size="lg"
            variant="primary"
            loading={loading}
            icon={ArrowRight}
            iconPosition="right"
            className="w-full mt-2 shadow-pop"
          >
            Create Free Account
          </Button>
        </form>
      </div>

      {/* Footer */}
      <div className="pb-safe text-center">
        <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-bold text-[#3B4FCD] dark:text-[#A5B4FC] hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};
