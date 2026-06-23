import { useState, useMemo } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, TrendingUp, Clock } from 'lucide-react';
import { products } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { formatCurrency, formatNumber, translateCategory } from '../lib/locale';

const trending = ['Jordan 4', 'Air Force 1', 'Dunk Low', 'Ultraboost', 'Air Max 97', 'corrida'];
const recent = ['Jordan Retro IV OG', 'Air Phantom Ultra', 'Boost 360 Pro'];

export function SearchPage() {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);

  const results = useMemo(() => {
    if (query.length < 2) return [];
    const q = query.toLowerCase();
    return products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      translateCategory(p.category).toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    );
  }, [query]);

  const showResults = query.length >= 2;

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      <div className="sticky top-14 z-30 px-4 py-3" style={{ background: 'var(--nav-bg)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-2xl mx-auto relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--foreground-muted)' }} />
          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
            placeholder="Buscar tênis, marcas, categorias..."
            className="w-full h-12 pl-11 pr-11 rounded-2xl outline-none transition-all"
            style={{
              background: 'var(--input-background)',
              fontSize: '15px',
              border: '1.5px solid transparent',
            }}
            onInput={e => {
              (e.target as HTMLInputElement).style.borderColor = 'var(--brand-accent)';
            }}
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2" aria-label="Limpar busca">
              <X size={16} style={{ color: 'var(--foreground-muted)' }} />
            </button>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {showResults ? (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p style={{ fontSize: '13px', color: 'var(--foreground-muted)', marginBottom: 16 }}>
                {formatNumber(results.length)} resultados para "<strong style={{ color: 'var(--foreground)' }}>{query}</strong>"
              </p>
              {results.length === 0 ? (
                <div className="text-center py-16">
                  <p style={{ fontSize: '3rem' }}>⌕</p>
                  <h3 style={{ fontFamily: 'Satoshi, sans-serif', marginTop: 12, marginBottom: 8 }}>Nenhum resultado encontrado</h3>
                  <p style={{ color: 'var(--foreground-muted)' }}>Tente buscar por outra palavra</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {results.map((p, i) => (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <ProductCard product={p} variant="compact" />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="suggestions"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {recent.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock size={15} style={{ color: 'var(--foreground-muted)' }} />
                    <p style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.04em', color: 'var(--foreground-muted)' }}>RECENTES</p>
                  </div>
                  <div className="space-y-1">
                    {recent.map(term => (
                      <button
                        key={term}
                        onClick={() => setQuery(term)}
                        className="flex items-center justify-between w-full py-2.5 px-3 rounded-2xl transition-colors hover:bg-[var(--secondary)]"
                      >
                        <span style={{ fontSize: '15px', fontWeight: 500 }}>{term}</span>
                        <X size={14} style={{ color: 'var(--foreground-muted)' }} />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp size={15} style={{ color: 'var(--brand-accent)' }} />
                  <p style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.04em', color: 'var(--foreground-muted)' }}>EM ALTA</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {trending.map(term => (
                    <motion.button
                      key={term}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setQuery(term)}
                      className="px-4 py-2 rounded-full"
                      style={{ background: 'var(--secondary)', border: '1px solid var(--border)', fontSize: '14px', fontWeight: 600 }}
                    >
                      {term}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div>
                <p style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.04em', color: 'var(--foreground-muted)', marginBottom: 16 }}>POPULARES AGORA</p>
                <div className="space-y-3">
                  {products.filter(p => p.isBestSeller).slice(0, 5).map(p => (
                    <Link to={`/product/${p.id}`} key={p.id}>
                      <motion.div
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-3 p-3 rounded-2xl transition-colors"
                        style={{ background: 'var(--card)', border: '1px solid var(--card-border)' }}
                      >
                        <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0" style={{ background: 'var(--background-secondary)' }}>
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover" style={{ objectPosition: 'center 30%' }} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p style={{ fontSize: '11px', color: 'var(--brand-accent)', fontWeight: 600 }}>{p.brand}</p>
                          <p style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '-0.02em' }} className="truncate">{p.name}</p>
                          <p style={{ fontSize: '13px', fontWeight: 700, marginTop: 2 }}>{formatCurrency(p.price)}</p>
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {!showResults && focused ? null : null}
      </div>
    </div>
  );
}
