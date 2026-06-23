import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { SlidersHorizontal, X, ChevronDown, Grid2X2, LayoutList } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { products, brands, categories, priceRanges } from '../data/products';
import { formatNumber, translateCategory } from '../lib/locale';

type SortKey = 'popular' | 'newest' | 'price-asc' | 'price-desc' | 'rating';

const sortOptions: { value: SortKey; label: string }[] = [
  { value: 'popular', label: 'Mais populares' },
  { value: 'newest', label: 'Mais recentes' },
  { value: 'price-asc', label: 'Menor preço' },
  { value: 'price-desc', label: 'Maior preço' },
  { value: 'rating', label: 'Melhor avaliação' },
];

export function Catalog() {
  const [searchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [gridMode, setGridMode] = useState<'grid' | 'list'>('grid');
  const [sort, setSort] = useState<SortKey>('popular');
  const [selectedBrands, setSelectedBrands] = useState<string[]>(() => {
    const b = searchParams.get('brand');
    return b ? [b] : [];
  });
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    const c = searchParams.get('category');
    return c ? [c] : [];
  });
  const [priceRange, setPriceRange] = useState<number[]>([]);
  const [showNewOnly, setShowNewOnly] = useState(searchParams.get('isNew') === 'true');
  const [showExclusiveOnly, setShowExclusiveOnly] = useState(searchParams.get('isExclusive') === 'true');
  const [showSaleOnly, setShowSaleOnly] = useState(false);

  const toggle = <T,>(arr: T[], val: T): T[] =>
    arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val];

  const filtered = useMemo(() => {
    let list = [...products];

    if (selectedBrands.length > 0) list = list.filter(p => selectedBrands.includes(p.brand));
    if (selectedCategories.length > 0) list = list.filter(p => selectedCategories.includes(p.category));
    if (priceRange.length === 2) list = list.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (showNewOnly) list = list.filter(p => p.isNew);
    if (showExclusiveOnly) list = list.filter(p => p.isExclusive);
    if (showSaleOnly) list = list.filter(p => p.isOnSale);

    switch (sort) {
      case 'newest': list.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()); break;
      case 'price-asc': list.sort((a, b) => a.price - b.price); break;
      case 'price-desc': list.sort((a, b) => b.price - a.price); break;
      case 'rating': list.sort((a, b) => b.rating - a.rating); break;
      default: list.sort((a, b) => b.reviewCount - a.reviewCount);
    }

    return list;
  }, [selectedBrands, selectedCategories, priceRange, showNewOnly, showExclusiveOnly, showSaleOnly, sort]);

  const activeFilterCount = selectedBrands.length + selectedCategories.length + priceRange.length / 2 + +showNewOnly + +showExclusiveOnly + +showSaleOnly;

  const clearAll = () => {
    setSelectedBrands([]);
    setSelectedCategories([]);
    setPriceRange([]);
    setShowNewOnly(false);
    setShowExclusiveOnly(false);
    setShowSaleOnly(false);
  };

  const FilterPanel = () => (
    <div className="space-y-6">
      {activeFilterCount > 0 && (
        <button onClick={clearAll} className="flex items-center gap-2 px-3 py-1.5 rounded-sm" style={{ background: 'rgba(180,35,42,0.08)', color: 'var(--brand-error)', fontSize: '13px', fontWeight: 600 }}>
          <X size={14} /> Limpar tudo ({activeFilterCount})
        </button>
      )}

      <div>
        <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', color: 'var(--foreground-muted)' }} className="mb-3">FILTROS RÁPIDOS</p>
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'Novidades', active: showNewOnly, onToggle: () => setShowNewOnly(s => !s) },
            { label: 'Exclusivos', active: showExclusiveOnly, onToggle: () => setShowExclusiveOnly(s => !s) },
            { label: 'Promoção', active: showSaleOnly, onToggle: () => setShowSaleOnly(s => !s) },
          ].map(({ label, active, onToggle }) => (
            <button
              key={label}
              onClick={onToggle}
              className="px-3 py-1.5 rounded-full transition-all"
              style={{
                background: active ? 'var(--brand-accent)' : 'var(--secondary)',
                color: active ? 'white' : 'var(--foreground)',
                fontSize: '13px',
                fontWeight: 600,
                border: active ? 'none' : '1px solid var(--border)',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', color: 'var(--foreground-muted)' }} className="mb-3">MARCA</p>
        <div className="space-y-2">
          {brands.map(brand => (
            <label key={brand} className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => setSelectedBrands(b => toggle(b, brand))}
                className="w-4.5 h-4.5 rounded flex items-center justify-center transition-all flex-shrink-0"
                style={{
                  width: '18px',
                  height: '18px',
                  background: selectedBrands.includes(brand) ? 'var(--brand-accent)' : 'var(--secondary)',
                  border: `1.5px solid ${selectedBrands.includes(brand) ? 'var(--brand-accent)' : 'var(--border)'}`,
                }}
              >
                {selectedBrands.includes(brand) && <span style={{ color: 'white', fontSize: '11px' }}>✓</span>}
              </div>
              <span style={{ fontSize: '14px', fontWeight: 500 }}>{brand}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', color: 'var(--foreground-muted)' }} className="mb-3">CATEGORIA</p>
        <div className="space-y-2">
          {categories.map(cat => (
            <label key={cat} className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => setSelectedCategories(c => toggle(c, cat))}
                className="w-4.5 h-4.5 rounded flex items-center justify-center transition-all flex-shrink-0"
                style={{
                  width: '18px',
                  height: '18px',
                  background: selectedCategories.includes(cat) ? 'var(--brand-accent)' : 'var(--secondary)',
                  border: `1.5px solid ${selectedCategories.includes(cat) ? 'var(--brand-accent)' : 'var(--border)'}`,
                }}
              >
                {selectedCategories.includes(cat) && <span style={{ color: 'white', fontSize: '11px' }}>✓</span>}
              </div>
              <span style={{ fontSize: '14px', fontWeight: 500 }}>{translateCategory(cat)}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', color: 'var(--foreground-muted)' }} className="mb-3">FAIXA DE PREÇO</p>
        <div className="space-y-2">
          {priceRanges.map(range => {
            const active = priceRange[0] === range.min && priceRange[1] === range.max;
            return (
              <button
                key={range.label}
                onClick={() => setPriceRange(active ? [] : [range.min, range.max])}
                className="flex items-center gap-3"
                style={{ textAlign: 'left', width: '100%' }}
              >
                <div
                  className="flex items-center justify-center flex-shrink-0"
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: active ? 'var(--brand-accent)' : 'var(--secondary)',
                    border: `1.5px solid ${active ? 'var(--brand-accent)' : 'var(--border)'}`,
                  }}
                >
                  {active && <span style={{ color: 'white', fontSize: '9px', fontWeight: 700 }}>•</span>}
                </div>
                <span style={{ fontSize: '14px', fontWeight: 500 }}>{range.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-5 lg:px-10 py-6">
      <div className="flex items-center justify-between mb-6 gap-3">
        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFilters(s => !s)}
            className="flex items-center gap-2 h-10 px-4 rounded-2xl transition-all"
            style={{
              background: activeFilterCount > 0 ? 'var(--brand-accent)' : 'var(--secondary)',
              color: activeFilterCount > 0 ? 'white' : 'var(--foreground)',
              fontSize: '14px',
              fontWeight: 600,
              border: activeFilterCount > 0 ? 'none' : '1px solid var(--border)',
            }}
          >
            <SlidersHorizontal size={16} />
            Filtros
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-white text-[var(--brand-accent)] flex items-center justify-center" style={{ fontSize: '11px', fontWeight: 700 }}>
                {activeFilterCount}
              </span>
            )}
          </motion.button>

          <p style={{ fontSize: '13px', color: 'var(--foreground-muted)', fontWeight: 500 }}>
            {formatNumber(filtered.length)} tênis
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={sort}
              onChange={e => setSort(e.target.value as SortKey)}
              className="appearance-none h-10 pl-3 pr-8 rounded-2xl outline-none cursor-pointer"
              style={{ background: 'var(--secondary)', border: '1px solid var(--border)', fontSize: '13px', fontWeight: 600, color: 'var(--foreground)' }}
            >
              {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--foreground-muted)' }} />
          </div>

          <div className="hidden lg:flex rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            {[{ mode: 'grid', Icon: Grid2X2 }, { mode: 'list', Icon: LayoutList }].map(({ mode, Icon }) => (
              <button
                key={mode}
                onClick={() => setGridMode(mode as 'grid' | 'list')}
                className="w-10 h-10 flex items-center justify-center transition-colors"
                style={{ background: gridMode === mode ? 'var(--foreground)' : 'var(--secondary)', color: gridMode === mode ? 'var(--background)' : 'var(--foreground-muted)' }}
              >
                <Icon size={16} />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        <AnimatePresence>
          {showFilters && (
            <motion.aside
              initial={{ opacity: 0, width: 0, x: -20 }}
              animate={{ opacity: 1, width: 260, x: 0 }}
              exit={{ opacity: 0, width: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="flex-shrink-0 hidden lg:block overflow-hidden"
            >
              <div className="w-[260px] sticky top-20">
                <FilterPanel />
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        <div className="flex-1 min-w-0">
          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <p style={{ fontSize: '3rem' }}>⌕</p>
              <h3 style={{ fontFamily: 'Satoshi, sans-serif', marginTop: 12, marginBottom: 8 }}>Nenhum tênis encontrado</h3>
              <p style={{ color: 'var(--foreground-muted)', fontSize: '15px' }}>Tente ajustar os filtros</p>
              <button onClick={clearAll} className="mt-6 px-6 h-11 rounded-2xl text-white" style={{ background: 'var(--foreground)', fontSize: '14px', fontWeight: 700 }}>
                Limpar filtros
              </button>
            </div>
          ) : (
            <div className={gridMode === 'grid' ? 'grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' : 'space-y-4'}>
              {filtered.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                >
                  <ProductCard product={product} variant={gridMode === 'list' ? 'compact' : 'default'} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFilters(false)}
              className="fixed inset-0 z-40 lg:hidden"
              style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl p-6 overflow-y-auto lg:hidden"
              style={{ background: 'var(--card)', maxHeight: '85vh', paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 24px)' }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 style={{ fontFamily: 'Satoshi, sans-serif' }}>Filtros</h3>
                <button onClick={() => setShowFilters(false)} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'var(--secondary)' }}>
                  <X size={16} />
                </button>
              </div>
              <FilterPanel />
              <button
                onClick={() => setShowFilters(false)}
                className="w-full h-12 rounded-2xl text-white mt-6"
                style={{ background: 'var(--foreground)', fontSize: '15px', fontWeight: 700 }}
              >
                Mostrar {formatNumber(filtered.length)} resultados
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
