<<<<<<< HEAD:frontend/src/app/components/layout/Header.tsx
import { Link, useNavigate, useLocation } from 'react-router';
import { useEffect, useState } from 'react';
=======
import { Link, useNavigate, useLocation } from 'react-router-dom';
>>>>>>> 982fe67d6c94eaef1d0f69e08f64196bd4e8d1f4:src/app/components/layout/Header.tsx
import { ShoppingBag, Search, Sun, Moon, ArrowLeft, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../../store/AppContext';
import { api } from '../../lib/api';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
}

export function Header({ title, showBack }: HeaderProps) {
  const { cartCount, state, toggleTheme } = useApp();
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    let active = true;

    api.health()
      .then(() => active && setApiOnline(true))
      .catch(() => active && setApiOnline(false));

    return () => {
      active = false;
    };
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: 'var(--nav-bg)',
        borderBottom: '1px solid var(--nav-border)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        paddingTop: 'env(safe-area-inset-top, 0px)',
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between h-14 px-4 lg:h-16 lg:px-6">
        {/* Left */}
        <div className="flex items-center gap-3">
          {showBack ? (
            <motion.button
              onClick={() => navigate(-1)}
              whileTap={{ scale: 0.9 }}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
              style={{ background: 'var(--secondary)' }}
            >
              <ArrowLeft size={18} strokeWidth={2} />
            </motion.button>
          ) : null}

          {isHome || !title ? (
            <Link to="/" className="flex items-center gap-1.5">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: 'var(--foreground)' }}
              >
                <span
                  style={{
                    color: 'var(--background)',
                    fontSize: '12px',
                    fontWeight: 900,
                    fontFamily: 'Satoshi, sans-serif',
                    letterSpacing: '-0.05em',
                  }}
                >
                  SX
                </span>
              </div>

              <span
                style={{
                  fontSize: '17px',
                  fontWeight: 800,
                  letterSpacing: '-0.04em',
                  fontFamily: 'Satoshi, sans-serif',
                }}
              >
                SNEAKRX
              </span>
            </Link>
          ) : (
            <h1
              style={{
                fontSize: '17px',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                fontFamily: 'Satoshi, sans-serif',
              }}
            >
              {title}
            </h1>
          )}
        </div>

        {/* Desktop navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {[
            { to: '/', label: 'Home' },
            { to: '/catalog', label: 'Browse' },
            { to: '/catalog?category=Running', label: 'Running' },
            { to: '/catalog?brand=Jordan', label: 'Jordan' },
            { to: '/catalog?isNew=true', label: 'New' },
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              style={{
                fontSize: '14px',
                fontWeight: 500,
                letterSpacing: '-0.01em',
              }}
              className="transition-opacity hover:opacity-60"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-1">
          <span
            className="hidden lg:inline-flex items-center gap-1.5 px-2.5 h-7 rounded-full"
            title={apiOnline ? 'Backend online' : apiOnline === false ? 'Backend offline' : 'Checking backend'}
            style={{
              background: apiOnline ? 'rgba(0,200,83,0.1)' : apiOnline === false ? 'rgba(255,45,85,0.1)' : 'var(--secondary)',
              color: apiOnline ? 'var(--brand-success)' : apiOnline === false ? 'var(--brand-error)' : 'var(--foreground-muted)',
              fontSize: '11px',
              fontWeight: 700,
              border: '1px solid var(--border)',
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: apiOnline ? 'var(--brand-success)' : apiOnline === false ? 'var(--brand-error)' : 'var(--foreground-muted)' }}
            />
            API
          </span>

          <motion.button
            onClick={() => navigate('/search')}
            whileTap={{ scale: 0.9 }}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
            style={{ color: 'var(--foreground-muted)' }}
          >
            <Search size={18} strokeWidth={1.75} />
          </motion.button>

          <motion.button
            onClick={toggleTheme}
            whileTap={{ scale: 0.9 }}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hidden lg:flex"
            style={{ color: 'var(--foreground-muted)' }}
          >
            {state.theme === 'dark' ? (
              <Sun size={18} strokeWidth={1.75} />
            ) : (
              <Moon size={18} strokeWidth={1.75} />
            )}
          </motion.button>

          <motion.div whileTap={{ scale: 0.9 }} className="hidden lg:block">
            <Link
              to="/wishlist"
              className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
              style={{ color: 'var(--foreground-muted)' }}
            >
              <Heart size={18} strokeWidth={1.75} />
            </Link>
          </motion.div>

          <motion.div whileTap={{ scale: 0.9 }} className="relative">
            <Link
              to="/cart"
              className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
              style={{ color: 'var(--foreground)' }}
            >
              <ShoppingBag size={18} strokeWidth={1.75} />

              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 min-w-4 h-4 rounded-full flex items-center justify-center text-white"
<<<<<<< HEAD:frontend/src/app/components/layout/Header.tsx
                  style={{ fontSize: '9px', fontWeight: 700, background: 'var(--brand-error)', padding: '0 3px' }}
=======
                  style={{
                    fontSize: '9px',
                    fontWeight: 700,
                    background: '#FF2D55',
                    padding: '0 3px',
                  }}
>>>>>>> 982fe67d6c94eaef1d0f69e08f64196bd4e8d1f4:src/app/components/layout/Header.tsx
                >
                  {cartCount}
                </motion.span>
              )}
            </Link>
          </motion.div>

          <Link
            to="/profile"
            className="hidden lg:flex ml-1 w-8 h-8 rounded-full items-center justify-center overflow-hidden"
            style={{
              background: 'var(--foreground)',
              color: 'var(--background)',
              fontSize: '12px',
              fontWeight: 700,
            }}
          >
            {state.user?.name?.charAt(0) ?? 'G'}
          </Link>
        </div>
      </div>
    </header>
  );
}