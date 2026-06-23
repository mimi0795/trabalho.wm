import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Home, Search } from 'lucide-react';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6">
          <p style={{ fontSize: '100px', lineHeight: 1, fontFamily: 'Satoshi, sans-serif', fontWeight: 900, color: 'var(--border)' }}>404</p>
          <span style={{ fontSize: '4rem', display: 'block', marginTop: -20 }}>⌕</span>
        </div>
        <h2 style={{ fontFamily: 'Satoshi, sans-serif', letterSpacing: '-0.04em', marginBottom: 8 }}>Página não encontrada</h2>
        <p style={{ color: 'var(--foreground-muted)', fontSize: '15px', lineHeight: 1.6, marginBottom: 32, maxWidth: '320px' }}>
          Essa página saiu da coleção. Vamos levar você de volta para os produtos.
        </p>
        <div className="flex gap-3 justify-center">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-6 h-12 rounded-2xl text-white"
            style={{ background: 'var(--foreground)', fontSize: '15px', fontWeight: 700 }}
          >
            <Home size={18} /> Início
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/catalog')}
            className="flex items-center gap-2 px-6 h-12 rounded-2xl"
            style={{ background: 'var(--secondary)', border: '1px solid var(--border)', fontSize: '15px', fontWeight: 600 }}
          >
            <Search size={18} /> Catálogo
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
