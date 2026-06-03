import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useApp } from '../store/AppContext';

export function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { dispatch } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    dispatch({ type: 'LOGIN', payload: { name: form.name, email: form.email, avatar: form.name.charAt(0) } });
    setLoading(false);
    navigate('/');
  };

  const field = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [key]: e.target.value })),
  });

  const inputStyle = {
    background: 'var(--input-background)',
    border: '1.5px solid transparent',
    fontSize: '15px',
  };

  return (
    <div className="min-h-screen flex flex-col px-6 py-10 max-w-sm mx-auto w-full justify-center">
      <div className="flex items-center gap-4 mb-10">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'var(--secondary)' }}>
          <ArrowLeft size={18} />
        </button>
        <span style={{ fontSize: '17px', fontWeight: 700, letterSpacing: '-0.03em' }}>Create Account</span>
      </div>

      <div className="mb-8">
        <h1 style={{ fontFamily: 'Satoshi, sans-serif', fontWeight: 800, letterSpacing: '-0.04em', fontSize: '2rem' }}>Join SNEAKRX</h1>
        <p style={{ color: 'var(--foreground-muted)', fontSize: '15px', marginTop: 6 }}>
          Access exclusive drops, save your grails, and checkout in seconds.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--foreground-secondary)' }}>Full Name</label>
          <input
            {...field('name')}
            placeholder="Your name"
            required
            className="w-full mt-1.5 h-12 px-4 rounded-2xl outline-none transition-all"
            style={inputStyle}
            onFocus={e => (e.target.style.borderColor = 'var(--brand-accent)')}
            onBlur={e => (e.target.style.borderColor = 'transparent')}
          />
        </div>
        <div>
          <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--foreground-secondary)' }}>Email</label>
          <input
            {...field('email')}
            type="email"
            placeholder="you@example.com"
            required
            className="w-full mt-1.5 h-12 px-4 rounded-2xl outline-none transition-all"
            style={inputStyle}
            onFocus={e => (e.target.style.borderColor = 'var(--brand-accent)')}
            onBlur={e => (e.target.style.borderColor = 'transparent')}
          />
        </div>
        <div>
          <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--foreground-secondary)' }}>Password</label>
          <div className="relative mt-1.5">
            <input
              {...field('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="Min. 8 characters"
              required
              minLength={8}
              className="w-full h-12 px-4 pr-12 rounded-2xl outline-none transition-all"
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = 'var(--brand-accent)')}
              onBlur={e => (e.target.style.borderColor = 'transparent')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(s => !s)}
              className="absolute right-4 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--foreground-muted)' }}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <p style={{ fontSize: '12px', color: 'var(--foreground-muted)', lineHeight: 1.5 }}>
          By creating an account you agree to our{' '}
          <span style={{ color: 'var(--brand-accent)' }}>Terms</span> and{' '}
          <span style={{ color: 'var(--brand-accent)' }}>Privacy Policy</span>.
        </p>

        <motion.button
          type="submit"
          disabled={loading}
          whileTap={{ scale: 0.97 }}
          className="w-full rounded-2xl flex items-center justify-center text-white"
          style={{
            background: loading ? 'var(--foreground-muted)' : 'var(--foreground)',
            fontSize: '15px',
            fontWeight: 700,
            height: '52px',
            letterSpacing: '-0.02em',
          }}
        >
          {loading ? <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : 'Create Account'}
        </motion.button>
      </form>

      <p className="text-center mt-8" style={{ fontSize: '14px', color: 'var(--foreground-muted)' }}>
        Already have an account?{' '}
        <Link to="/auth/login" style={{ color: 'var(--brand-accent)', fontWeight: 700 }}>Sign in</Link>
      </p>
    </div>
  );
}
