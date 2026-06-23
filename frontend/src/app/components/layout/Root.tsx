import { Outlet, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './Header';
import { BottomNav } from './BottomNav';

const headerConfig: Record<string, { title?: string; showBack?: boolean }> = {
  '/catalog': { title: 'Catálogo' },
  '/search': { title: 'Busca' },
  '/cart': { title: 'Minha sacola', showBack: true },
  '/checkout': { title: 'Finalizar compra', showBack: true },
  '/order-confirmed': { title: 'Pedido confirmado' },
  '/profile': { title: 'Perfil' },
  '/wishlist': { title: 'Favoritos' },
};

const profileSectionTitles: Record<string, string> = {
  pedidos: 'Histórico de pedidos',
  favoritos: 'Favoritos',
  pagamentos: 'Formas de pagamento',
  notificacoes: 'Notificações',
  autenticacao: 'Autenticação',
  configuracoes: 'Configurações',
  ajuda: 'Central de ajuda',
  avaliar: 'Avaliar Passo Prime',
};

const noHeader = ['/onboarding', '/auth/login', '/auth/register'];
const noBottomNav = ['/checkout', '/order-confirmed', '/onboarding', '/auth/login', '/auth/register'];

export function Root() {
  const location = useLocation();

  const isProductPage = location.pathname.startsWith('/product/');
  const profileSection = location.pathname.startsWith('/profile/')
    ? location.pathname.split('/')[2]
    : '';
  const showHeader = !noHeader.some(p => location.pathname.startsWith(p));
  const showBottomNav = !noBottomNav.some(p => location.pathname.startsWith(p));
  const config = isProductPage
    ? { showBack: true }
    : profileSection
      ? { title: profileSectionTitles[profileSection] ?? 'Perfil', showBack: true }
    : headerConfig[location.pathname] ?? {};

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      {showHeader && <Header {...config} />}

      <main
        style={{
          paddingTop: showHeader ? '3.5rem' : 0,
          paddingBottom: showBottomNav ? '4.5rem' : 0,
          minHeight: '100vh',
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {showBottomNav && <BottomNav />}
    </div>
  );
}
