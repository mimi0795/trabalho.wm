import { NavLink, useLocation } from 'react-router';
import { Home, Search, Grid3X3, Heart, User, ShoppingBag } from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../../store/AppContext';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/search', icon: Search, label: 'Search' },
  { to: '/catalog', icon: Grid3X3, label: 'Browse' },
  { to: '/wishlist', icon: Heart, label: 'Saved' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export function BottomNav() {
  const { cartCount } = useApp();
  const location = useLocation();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
      style={{
        background: 'var(--nav-bg)',
        borderTop: '1px solid var(--nav-border)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div className="flex items-center justify-around px-2 h-16">
        {navItems.map(({ to, icon: Icon, label }) => {
          const isActive = to === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(to);

          return (
            <NavLink
              key={to}
              to={to}
              className="relative flex flex-col items-center justify-center gap-0.5 w-14 h-12 rounded-2xl transition-colors duration-200"
            >
              <motion.div
                className="relative flex flex-col items-center gap-0.5"
                whileTap={{ scale: 0.85 }}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 -m-2 rounded-2xl"
                    style={{ background: 'var(--brand-accent-subtle)' }}
                    initial={false}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <div className="relative">
                  <Icon
                    size={20}
                    strokeWidth={isActive ? 2.5 : 1.75}
                    style={{ color: isActive ? 'var(--brand-accent)' : 'var(--foreground-muted)' }}
                  />
                </div>
                <span
                  className="relative"
                  style={{
                    fontSize: '10px',
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? 'var(--brand-accent)' : 'var(--foreground-muted)',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {label}
                </span>
              </motion.div>
            </NavLink>
          );
        })}

        {/* Cart floating button */}
        <NavLink to="/cart" className="relative flex flex-col items-center justify-center gap-0.5 w-14 h-12">
          <motion.div
            className="relative flex flex-col items-center gap-0.5"
            whileTap={{ scale: 0.85 }}
          >
            <div className="relative">
              <ShoppingBag
                size={20}
                strokeWidth={location.pathname === '/cart' ? 2.5 : 1.75}
                style={{ color: location.pathname === '/cart' ? 'var(--brand-accent)' : 'var(--foreground-muted)' }}
              />
              {cartCount > 0 && (
                <span
                  className="absolute -top-1.5 -right-1.5 min-w-4 h-4 rounded-full flex items-center justify-center text-white"
                  style={{ fontSize: '9px', fontWeight: 700, background: 'var(--brand-error)', padding: '0 3px' }}
                >
                  {cartCount}
                </span>
              )}
            </div>
            <span
              style={{
                fontSize: '10px',
                fontWeight: location.pathname === '/cart' ? 600 : 400,
                color: location.pathname === '/cart' ? 'var(--brand-accent)' : 'var(--foreground-muted)',
                letterSpacing: '-0.01em',
              }}
            >
              Cart
            </span>
          </motion.div>
        </NavLink>
      </div>
    </nav>
  );
}
