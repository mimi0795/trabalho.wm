import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { SITE_INITIALS, SITE_NAME } from '../lib/locale';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { dispatch } = useApp();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    dispatch({
      type: 'LOGIN',
      payload: { name: 'Alex Jordan', email, avatar: 'AJ' },
    });
    setLoading(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--background)' }}>
      <div
        className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden"
        style={{ background: '#111111' }}
      >
        <img
          src="https://images.unsplash.com/photo-1564864265033-8f50f3e0e3be?w=1000&q=80"
          alt="Tênis premium"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="relative">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center">
              <span style={{ color: '#111111', fontSize: '13px', fontWeight: 900, fontFamily: 'Satoshi, sans-serif', letterSpacing: '-0.05em' }}>{SITE_INITIALS}</span>
            </div>
            <span style={{ color: 'white', fontSize: '18px', fontWeight: 800, letterSpacing: '-0.04em', fontFamily: 'Satoshi, sans-serif' }}>{SITE_NAME}</span>
          </div>
        </div>
        <div className="relative">
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', letterSpacing: '0.08em', fontWeight: 600 }}>MARKETPLACE PREMIUM DE TÊNIS</p>
          <h2 className="text-white mt-2" style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.1, fontFamily: 'Satoshi, sans-serif' }}>
            Seu próximo par<br/>favorito espera<br/>por você.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: 12, fontSize: '15px', lineHeight: 1.6 }}>
            Mais de 20 mil tênis autenticados das melhores marcas do mundo.
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center px-6 py-10 lg:px-16 max-w-lg lg:max-w-none mx-auto w-full">
        <div className="w-full max-w-sm mx-auto">
          <div className="lg:hidden flex items-center gap-4 mb-10">
            <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'var(--secondary)' }}>
              <ArrowLeft size={18} />
            </button>
            <span style={{ fontSize: '17px', fontWeight: 700, letterSpacing: '-0.03em' }}>Entrar</span>
          </div>

          <div className="hidden lg:block mb-10">
            <h1 style={{ fontFamily: 'Satoshi, sans-serif', fontWeight: 800, letterSpacing: '-0.04em' }}>Boas-vindas de volta</h1>
            <p style={{ color: 'var(--foreground-muted)', fontSize: '15px', marginTop: 6 }}>Entre na sua conta {SITE_NAME}</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--foreground-secondary)' }}>E-mail</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="voce@exemplo.com"
                required
                className="w-full mt-1.5 h-12 px-4 rounded-2xl outline-none transition-all"
                style={{
                  background: 'var(--input-background)',
                  border: '1.5px solid transparent',
                  fontSize: '15px',
                }}
                onFocus={e => (e.target.style.borderColor = 'var(--brand-accent)')}
                onBlur={e => (e.target.style.borderColor = 'transparent')}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--foreground-secondary)' }}>Senha</label>
                <button type="button" style={{ fontSize: '12px', color: 'var(--brand-accent)', fontWeight: 600 }}>
                  Esqueceu?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full h-12 px-4 pr-12 rounded-2xl outline-none transition-all"
                  style={{
                    background: 'var(--input-background)',
                    border: '1.5px solid transparent',
                    fontSize: '15px',
                  }}
                  onFocus={e => (e.target.style.borderColor = 'var(--brand-accent)')}
                  onBlur={e => (e.target.style.borderColor = 'transparent')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--foreground-muted)' }}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.97 }}
              className="w-full h-13 rounded-2xl flex items-center justify-center text-white mt-2"
              style={{
                background: loading ? 'var(--foreground-muted)' : 'var(--foreground)',
                fontSize: '15px',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                height: '52px',
              }}
            >
              {loading ? (
                <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : 'Entrar'}
            </motion.button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
            <span style={{ fontSize: '12px', color: 'var(--foreground-muted)', fontWeight: 500 }}>ou continue com</span>
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {['Google', 'Apple'].map(provider => (
              <motion.button
                key={provider}
                whileTap={{ scale: 0.97 }}
                onClick={handleLogin}
                className="h-12 rounded-2xl flex items-center justify-center gap-2"
                style={{
                  background: 'var(--secondary)',
                  border: '1px solid var(--border)',
                  fontSize: '14px',
                  fontWeight: 600,
                }}
              >
                {provider}
              </motion.button>
            ))}
          </div>

          <p className="text-center mt-8" style={{ fontSize: '14px', color: 'var(--foreground-muted)' }}>
            Ainda não tem conta?{' '}
            <Link to="/auth/register" style={{ color: 'var(--brand-accent)', fontWeight: 700 }}>
              Cadastre-se grátis
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
