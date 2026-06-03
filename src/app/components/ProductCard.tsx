import { Link } from 'react-router';
import { Heart, Star } from 'lucide-react';
import { motion } from 'motion/react';
import type { Product } from '../data/products';
import { useApp } from '../store/AppContext';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'wide' | 'compact';
}

export function ProductCard({ product, variant = 'default' }: ProductCardProps) {
  const { isInWishlist, toggleWishlist } = useApp();
  const inWishlist = isInWishlist(product.id);
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  if (variant === 'compact') {
    return (
      <Link to={`/product/${product.id}`} className="group block">
        <motion.div
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="relative overflow-hidden rounded-2xl"
          style={{ background: 'var(--card)', border: '1px solid var(--card-border)', boxShadow: 'var(--shadow-sm)' }}
        >
          <div className="relative aspect-square overflow-hidden" style={{ background: 'var(--background-secondary)' }}>
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {product.isNew && (
              <span
                className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-white"
                style={{ fontSize: '10px', fontWeight: 700, background: 'var(--brand-accent)', letterSpacing: '0.02em' }}
              >
                NEW
              </span>
            )}
          </div>
          <div className="p-3">
            <p style={{ fontSize: '11px', color: 'var(--foreground-muted)', fontWeight: 500 }}>{product.brand}</p>
            <p style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '-0.02em' }} className="truncate mt-0.5">{product.name}</p>
            <p style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '-0.02em' }} className="mt-1">${product.price}</p>
          </div>
        </motion.div>
      </Link>
    );
  }

  if (variant === 'wide') {
    return (
      <Link to={`/product/${product.id}`} className="group block">
        <motion.div
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.98 }}
          className="relative overflow-hidden rounded-3xl"
          style={{
            background: 'var(--card)',
            border: '1px solid var(--card-border)',
            boxShadow: 'var(--shadow-md)',
            width: '220px',
            flexShrink: 0,
          }}
        >
          <div className="relative overflow-hidden" style={{ height: '180px', background: 'var(--background-secondary)' }}>
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
              style={{ objectPosition: 'center 30%' }}
            />
            <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
              {product.isNew && (
                <span
                  className="px-2.5 py-1 rounded-full text-white"
                  style={{ fontSize: '10px', fontWeight: 700, background: 'var(--brand-accent)', letterSpacing: '0.02em' }}
                >
                  NEW
                </span>
              )}
              {product.isExclusive && (
                <span
                  className="px-2.5 py-1 rounded-full"
                  style={{ fontSize: '10px', fontWeight: 700, background: 'rgba(0,0,0,0.7)', color: '#AAFF00', letterSpacing: '0.02em' }}
                >
                  EXCL
                </span>
              )}
              {discount > 0 && (
                <span
                  className="px-2.5 py-1 rounded-full text-white"
                  style={{ fontSize: '10px', fontWeight: 700, background: '#FF2D55', letterSpacing: '0.02em' }}
                >
                  -{discount}%
                </span>
              )}
            </div>
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); }}
              className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all"
              style={{
                background: 'var(--glass-bg)',
                backdropFilter: 'blur(8px)',
                border: '1px solid var(--glass-border)',
              }}
            >
              <Heart
                size={15}
                fill={inWishlist ? '#FF2D55' : 'none'}
                stroke={inWishlist ? '#FF2D55' : 'currentColor'}
                strokeWidth={2}
              />
            </motion.button>
          </div>
          <div className="p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p style={{ fontSize: '11px', color: 'var(--brand-accent)', fontWeight: 600, letterSpacing: '0.02em' }}>
                  {product.brand.toUpperCase()}
                </p>
                <p style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.3 }} className="mt-0.5 truncate">
                  {product.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <Star size={11} fill="#FFB800" stroke="none" />
              <span style={{ fontSize: '12px', fontWeight: 600 }}>{product.rating}</span>
              <span style={{ fontSize: '11px', color: 'var(--foreground-muted)' }}>({product.reviewCount.toLocaleString()})</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span style={{ fontSize: '16px', fontWeight: 800, letterSpacing: '-0.03em' }}>${product.price}</span>
              {product.originalPrice && (
                <span style={{ fontSize: '13px', color: 'var(--foreground-muted)', textDecoration: 'line-through' }}>
                  ${product.originalPrice}
                </span>
              )}
            </div>
          </div>
        </motion.div>
      </Link>
    );
  }

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <motion.div
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.97 }}
        className="relative overflow-hidden rounded-3xl h-full"
        style={{
          background: 'var(--card)',
          border: '1px solid var(--card-border)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div className="relative overflow-hidden" style={{ aspectRatio: '4/3', background: 'var(--background-secondary)' }}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-108"
            style={{ objectPosition: 'center 30%' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
            {product.isNew && (
              <span className="px-2.5 py-1 rounded-full text-white" style={{ fontSize: '10px', fontWeight: 700, background: 'var(--brand-accent)', letterSpacing: '0.03em' }}>
                NEW
              </span>
            )}
            {product.isExclusive && (
              <span className="px-2.5 py-1 rounded-full" style={{ fontSize: '10px', fontWeight: 700, background: 'rgba(0,0,0,0.8)', color: '#AAFF00', letterSpacing: '0.03em' }}>
                EXCL
              </span>
            )}
            {discount > 0 && (
              <span className="px-2.5 py-1 rounded-full text-white" style={{ fontSize: '10px', fontWeight: 700, background: '#FF2D55', letterSpacing: '0.03em' }}>
                -{discount}%
              </span>
            )}
          </div>

          {/* Wishlist */}
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); }}
            className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
            style={{
              background: 'var(--glass-bg)',
              backdropFilter: 'blur(10px)',
              border: '1px solid var(--glass-border)',
            }}
          >
            <Heart
              size={16}
              fill={inWishlist ? '#FF2D55' : 'none'}
              stroke={inWishlist ? '#FF2D55' : 'currentColor'}
              strokeWidth={2}
            />
          </motion.button>
        </div>

        <div className="p-4">
          <p style={{ fontSize: '11px', color: 'var(--brand-accent)', fontWeight: 600, letterSpacing: '0.04em' }}>
            {product.brand.toUpperCase()}
          </p>
          <p style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.3 }} className="mt-1">
            {product.name}
          </p>
          <div className="flex items-center gap-1.5 mt-1.5">
            <Star size={12} fill="#FFB800" stroke="none" />
            <span style={{ fontSize: '12px', fontWeight: 600 }}>{product.rating}</span>
            <span style={{ fontSize: '11px', color: 'var(--foreground-muted)' }}>({product.reviewCount.toLocaleString()})</span>
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              <span style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.03em' }}>${product.price}</span>
              {product.originalPrice && (
                <span style={{ fontSize: '13px', color: 'var(--foreground-muted)', textDecoration: 'line-through' }}>
                  ${product.originalPrice}
                </span>
              )}
            </div>
            <div className="flex gap-1">
              {product.colors.slice(0, 3).map(c => (
                <div
                  key={c.hex}
                  className="w-3 h-3 rounded-full border border-black/10"
                  style={{ background: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
