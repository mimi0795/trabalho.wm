import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Sun, Moon, Heart, Package, Settings, ChevronRight, LogOut, LogIn, Bell, Shield, CreditCard, HelpCircle, Star } from 'lucide-react';
import { useApp } from '../store/AppContext';

export function Profile() {
  const { state, dispatch, toggleTheme } = useApp();
  const navigate = useNavigate();

  const menuItems = [
    {
      group: 'Shopping',
      items: [
        { icon: Package, label: 'Order History', desc: 'Track your purchases', action: () => {} },
        { icon: Heart, label: 'Wishlist', desc: `${state.wishlist.length} saved items`, action: () => navigate('/wishlist') },
        { icon: CreditCard, label: 'Payment Methods', desc: 'Manage cards & wallets', action: () => {} },
      ],
    },
    {
      group: 'Account',
      items: [
        { icon: Bell, label: 'Notifications', desc: 'Drop alerts & updates', action: () => {} },
        { icon: Shield, label: 'Authentication', desc: 'Verify your pairs', action: () => {} },
        { icon: Settings, label: 'Settings', desc: 'Preferences & privacy', action: () => {} },
      ],
    },
    {
      group: 'Support',
      items: [
        { icon: HelpCircle, label: 'Help Center', desc: 'FAQs & contact support', action: () => {} },
        { icon: Star, label: 'Rate SNEAKRX', desc: 'Share your experience', action: () => {} },
      ],
    },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      <div className="max-w-lg mx-auto px-5 py-6">
        {/* Profile card */}
        <div className="relative overflow-hidden rounded-3xl mb-6 p-6" style={{ background: '#111111' }}>
          <img
            src="https://images.unsplash.com/photo-1618554707482-14854a29f955?w=600&q=80"
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-15"
          />
          <div className="relative flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'var(--brand-accent)', fontSize: '22px', fontWeight: 900, color: 'white', fontFamily: 'Satoshi, sans-serif' }}
            >
              {state.user?.name?.charAt(0) ?? 'G'}
            </div>
            <div>
              {state.isAuthenticated ? (
                <>
                  <p className="text-white" style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.03em', fontFamily: 'Satoshi, sans-serif' }}>
                    {state.user?.name}
                  </p>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>{state.user?.email}</p>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="px-2.5 py-1 rounded-sm" style={{ background: 'rgba(184,154,77,0.16)', color: '#E7E4DF', fontSize: '11px', fontWeight: 700 }}>
                      ✦ Premium Member
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-white" style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.03em' }}>Guest User</p>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>Sign in to unlock everything</p>
                </>
              )}
            </div>
          </div>

          {!state.isAuthenticated && (
            <div className="relative mt-5 flex gap-3">
              <button
                onClick={() => navigate('/auth/login')}
                className="flex-1 h-10 rounded-xl text-white flex items-center justify-center gap-1.5"
                style={{ background: 'var(--brand-accent)', fontSize: '14px', fontWeight: 700 }}
              >
                <LogIn size={16} /> Sign In
              </button>
              <button
                onClick={() => navigate('/auth/register')}
                className="flex-1 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '14px', fontWeight: 600, border: '1px solid rgba(255,255,255,0.15)' }}
              >
                Register
              </button>
            </div>
          )}

          {/* Stats */}
          {state.isAuthenticated && (
            <div className="relative mt-5 pt-5 flex gap-6" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              {[
                { label: 'Orders', value: '12' },
                { label: 'Saved', value: state.wishlist.length.toString() },
                { label: 'Reviews', value: '7' },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-white" style={{ fontSize: '20px', fontWeight: 900, letterSpacing: '-0.03em', fontFamily: 'Satoshi, sans-serif' }}>{value}</p>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', fontWeight: 500 }}>{label}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dark mode toggle */}
        <div
          className="flex items-center justify-between p-4 rounded-2xl mb-4"
          style={{ background: 'var(--card)', border: '1px solid var(--card-border)' }}
        >
          <div className="flex items-center gap-3">
            {state.theme === 'dark' ? <Moon size={18} style={{ color: 'var(--brand-accent)' }} /> : <Sun size={18} style={{ color: '#FFB800' }} />}
            <span style={{ fontSize: '15px', fontWeight: 600 }}>{state.theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
          </div>
          <motion.button
            onClick={toggleTheme}
            className="relative w-12 h-6 rounded-full transition-all"
            style={{ background: state.theme === 'dark' ? 'var(--brand-accent)' : 'var(--border)' }}
          >
            <motion.div
              animate={{ x: state.theme === 'dark' ? 24 : 2 }}
              className="absolute top-0.5 w-5 h-5 rounded-full bg-white"
              style={{ boxShadow: 'var(--shadow-sm)' }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            />
          </motion.button>
        </div>

        {/* Menu groups */}
        <div className="space-y-4">
          {menuItems.map(({ group, items }) => (
            <div key={group}>
              <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--foreground-muted)', paddingLeft: 4, marginBottom: 8 }}>
                {group.toUpperCase()}
              </p>
              <div className="rounded-3xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--card-border)' }}>
                {items.map(({ icon: Icon, label, desc, action }, i) => (
                  <motion.button
                    key={label}
                    whileTap={{ scale: 0.98 }}
                    onClick={action}
                    className="w-full flex items-center gap-4 p-4 text-left transition-colors hover:bg-[var(--card-hover)]"
                    style={{ borderBottom: i < items.length - 1 ? '1px solid var(--border)' : 'none' }}
                  >
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--secondary)' }}>
                      <Icon size={17} style={{ color: 'var(--foreground)' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p style={{ fontSize: '15px', fontWeight: 600 }}>{label}</p>
                      <p style={{ fontSize: '12px', color: 'var(--foreground-muted)' }}>{desc}</p>
                    </div>
                    <ChevronRight size={16} style={{ color: 'var(--foreground-muted)', flexShrink: 0 }} />
                  </motion.button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Logout */}
        {state.isAuthenticated && (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => dispatch({ type: 'LOGOUT' })}
            className="w-full h-12 rounded-2xl flex items-center justify-center gap-2 mt-6"
            style={{ background: 'rgba(180,35,42,0.08)', color: 'var(--brand-error)', fontSize: '15px', fontWeight: 700, border: '1px solid rgba(180,35,42,0.18)' }}
          >
            <LogOut size={18} /> Sign Out
          </motion.button>
        )}

        <div className="mt-8 text-center">
          <p style={{ color: 'var(--foreground-muted)', fontSize: '12px' }}>SNEAKRX v2.6.0 · © 2026</p>
        </div>
      </div>
    </div>
  );
}
