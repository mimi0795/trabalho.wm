import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { products } from '../data/products';
import { ProductCard } from '../components/ProductCard';

export function Wishlist() {
  const { state, toggleWishlist, addToCart } = useApp();
  const navigate = useNavigate();
  const wishlistedProducts = products.filter(p => state.wishlist.includes(p.id));

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      <div className="max-w-7xl mx-auto px-5 lg:px-10 py-6">
        {wishlistedProducts.length === 0 ? (
          <div className="text-center py-24 flex flex-col items-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
              style={{ background: 'rgba(255,45,85,0.08)' }}
            >
              <Heart size={40} style={{ color: '#FF2D55' }} />
            </motion.div>
            <h2 style={{ fontFamily: 'Satoshi, sans-serif' }}>Your wishlist is empty</h2>
            <p style={{ color: 'var(--foreground-muted)', fontSize: '15px', marginTop: 8, marginBottom: 24 }}>
              Save your dream pairs and never lose track
            </p>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/catalog')}
              className="px-8 h-12 rounded-2xl text-white"
              style={{ background: 'var(--foreground)', fontSize: '15px', fontWeight: 700 }}
            >
              Browse Sneakers
            </motion.button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p style={{ fontSize: '13px', color: 'var(--foreground-muted)', fontWeight: 600 }}>
                {wishlistedProducts.length} saved item{wishlistedProducts.length !== 1 ? 's' : ''}
              </p>
              <button
                onClick={() => state.wishlist.forEach(id => toggleWishlist(id))}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                style={{ background: 'rgba(255,45,85,0.08)', color: '#FF2D55', fontSize: '13px', fontWeight: 600 }}
              >
                <Trash2 size={13} /> Clear all
              </button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <AnimatePresence>
                {wishlistedProducts.map((product, i) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: i * 0.04 }}
                    className="relative group"
                  >
                    <ProductCard product={product} />
                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          addToCart({ product, size: product.sizes[4] ?? product.sizes[0], color: product.colors[0].name, quantity: 1 });
                          navigate('/cart');
                        }}
                        className="w-full h-10 rounded-xl text-white flex items-center justify-center gap-2"
                        style={{ background: 'var(--foreground)', fontSize: '13px', fontWeight: 700 }}
                      >
                        <ShoppingBag size={15} /> Quick Add
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
