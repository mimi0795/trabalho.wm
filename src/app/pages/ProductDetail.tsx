import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Star, Truck, Shield, RotateCcw, ChevronDown, Share2, ZoomIn } from 'lucide-react';
import { getProductById, getRelated } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { useApp } from '../store/AppContext';

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const product = id ? getProductById(id) : null;
  const navigate = useNavigate();
  const { addToCart, isInWishlist, toggleWishlist } = useApp();

  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState(product?.colors[0] ?? null);
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');
  const [added, setAdded] = useState(false);
  const [showSizeError, setShowSizeError] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p style={{ fontSize: '3rem' }}>👟</p>
        <h3 style={{ fontFamily: 'Satoshi, sans-serif' }}>Product not found</h3>
        <button onClick={() => navigate('/catalog')} className="px-6 h-11 rounded-2xl text-white" style={{ background: 'var(--foreground)', fontSize: '14px', fontWeight: 700 }}>
          Browse Catalog
        </button>
      </div>
    );
  }

  const related = getRelated(product);
  const inWishlist = isInWishlist(product.id);
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  const handleAddToCart = () => {
    if (!selectedSize) {
      setShowSizeError(true);
      setTimeout(() => setShowSizeError(false), 2000);
      return;
    }
    addToCart({
      product,
      size: selectedSize,
      color: selectedColor?.name ?? product.colors[0].name,
      quantity: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div style={{ background: 'var(--background)', paddingBottom: '6rem' }}>
      <div className="max-w-7xl mx-auto">
        <div className="lg:grid lg:grid-cols-2 lg:gap-0">
          {/* IMAGE GALLERY */}
          <div className="relative lg:sticky lg:top-14 lg:self-start">
            <div
              className="relative overflow-hidden cursor-zoom-in"
              style={{ aspectRatio: '1', background: 'var(--background-secondary)' }}
              onClick={() => setZoomOpen(true)}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  src={product.images[activeImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  style={{ objectPosition: 'center 30%' }}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                />
              </AnimatePresence>

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isNew && (
                  <span className="px-3 py-1.5 rounded-full text-white" style={{ fontSize: '11px', fontWeight: 700, background: 'var(--brand-accent)', letterSpacing: '0.04em' }}>NEW</span>
                )}
                {product.isExclusive && (
                  <span className="px-3 py-1.5 rounded-full" style={{ fontSize: '11px', fontWeight: 700, background: 'rgba(0,0,0,0.8)', color: '#AAFF00', letterSpacing: '0.04em' }}>EXCLUSIVE</span>
                )}
                {discount > 0 && (
                  <span className="px-3 py-1.5 rounded-full text-white" style={{ fontSize: '11px', fontWeight: 700, background: '#FF2D55' }}>-{discount}%</span>
                )}
              </div>

              {/* Zoom icon */}
              <button
                onClick={() => setZoomOpen(true)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center"
                style={{ background: 'var(--glass-bg)', backdropFilter: 'blur(8px)', border: '1px solid var(--glass-border)' }}
              >
                <ZoomIn size={16} />
              </button>

              {/* Image dots */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
                {product.images.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); setActiveImage(i); }}
                    className="transition-all"
                    style={{
                      width: i === activeImage ? 20 : 6,
                      height: 6,
                      borderRadius: 3,
                      background: i === activeImage ? 'var(--foreground)' : 'rgba(0,0,0,0.25)',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Thumbnail strip */}
            <div className="flex gap-2 p-4 overflow-x-auto hide-scrollbar">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className="flex-shrink-0 overflow-hidden rounded-xl transition-all"
                  style={{
                    width: '72px',
                    height: '72px',
                    border: `2px solid ${i === activeImage ? 'var(--foreground)' : 'var(--border)'}`,
                    background: 'var(--background-secondary)',
                  }}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" style={{ objectPosition: 'center 30%' }} />
                </button>
              ))}
            </div>
          </div>

          {/* PRODUCT INFO */}
          <div className="px-5 lg:px-10 lg:py-8">
            {/* Brand + actions */}
            <div className="flex items-start justify-between mb-1">
              <span style={{ fontSize: '13px', color: 'var(--brand-accent)', fontWeight: 700, letterSpacing: '0.06em' }}>
                {product.brand.toUpperCase()}
              </span>
              <div className="flex gap-2">
                <button className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'var(--secondary)' }}>
                  <Share2 size={16} style={{ color: 'var(--foreground-muted)' }} />
                </button>
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => toggleWishlist(product.id)}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
                  style={{ background: inWishlist ? 'rgba(255,45,85,0.1)' : 'var(--secondary)' }}
                >
                  <Heart
                    size={16}
                    fill={inWishlist ? '#FF2D55' : 'none'}
                    stroke={inWishlist ? '#FF2D55' : 'currentColor'}
                    strokeWidth={2}
                  />
                </motion.button>
              </div>
            </div>

            <h1 style={{ fontFamily: 'Satoshi, sans-serif', letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: 8 }}>
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-0.5">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} size={14} fill={i <= Math.round(product.rating) ? '#FFB800' : 'none'} stroke={i <= Math.round(product.rating) ? 'none' : 'var(--foreground-muted)'} />
                ))}
              </div>
              <span style={{ fontSize: '14px', fontWeight: 700 }}>{product.rating}</span>
              <span style={{ fontSize: '13px', color: 'var(--foreground-muted)' }}>({product.reviewCount.toLocaleString()} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.04em', fontFamily: 'Satoshi, sans-serif' }}>
                ${product.price}
              </span>
              {product.originalPrice && (
                <>
                  <span style={{ fontSize: '1.25rem', color: 'var(--foreground-muted)', textDecoration: 'line-through' }}>
                    ${product.originalPrice}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-white" style={{ fontSize: '12px', fontWeight: 700, background: '#FF2D55' }}>
                    Save ${product.originalPrice - product.price}
                  </span>
                </>
              )}
            </div>

            {/* Color selector */}
            <div className="mb-6">
              <p style={{ fontSize: '13px', fontWeight: 700, marginBottom: 10 }}>
                Color: <span style={{ fontWeight: 500, color: 'var(--foreground-muted)' }}>{selectedColor?.name}</span>
              </p>
              <div className="flex gap-2.5">
                {product.colors.map(color => (
                  <motion.button
                    key={color.hex}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedColor(color)}
                    className="w-9 h-9 rounded-full transition-all"
                    style={{
                      background: color.hex,
                      border: `3px solid ${selectedColor?.hex === color.hex ? 'var(--brand-accent)' : 'var(--border)'}`,
                      outline: selectedColor?.hex === color.hex ? '2px solid var(--brand-accent-glow)' : 'none',
                      outlineOffset: '2px',
                    }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Size selector */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <p style={{ fontSize: '13px', fontWeight: 700 }}>
                  Size (EU): {selectedSize && <span style={{ color: 'var(--brand-accent)', fontWeight: 800 }}>{selectedSize}</span>}
                </p>
                <button style={{ fontSize: '12px', color: 'var(--brand-accent)', fontWeight: 600 }}>Size Guide</button>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {product.sizes.map(size => (
                  <motion.button
                    key={size}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => { setSelectedSize(size); setShowSizeError(false); }}
                    className="h-11 rounded-2xl flex items-center justify-center transition-all"
                    style={{
                      background: selectedSize === size ? 'var(--foreground)' : 'var(--secondary)',
                      color: selectedSize === size ? 'var(--background)' : 'var(--foreground)',
                      fontSize: '14px',
                      fontWeight: 700,
                      border: `1.5px solid ${selectedSize === size ? 'var(--foreground)' : showSizeError ? '#FF2D55' : 'var(--border)'}`,
                    }}
                  >
                    {size}
                  </motion.button>
                ))}
              </div>
              <AnimatePresence>
                {showSizeError && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{ color: '#FF2D55', fontSize: '13px', fontWeight: 600, marginTop: 8 }}
                  >
                    Please select a size to continue
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Shipping info */}
            <div className="rounded-3xl p-4 mb-6 space-y-3" style={{ background: 'var(--background-secondary)', border: '1px solid var(--border)' }}>
              {[
                { icon: Truck, text: 'Free shipping on orders over $150', sub: 'Delivered in 2-3 business days' },
                { icon: Shield, text: '100% Authentic Guarantee', sub: 'Every pair verified by our experts' },
                { icon: RotateCcw, text: 'Free Returns', sub: '30 days return policy' },
              ].map(({ icon: Icon, text, sub }) => (
                <div key={text} className="flex items-start gap-3">
                  <Icon size={18} style={{ color: 'var(--brand-accent)', flexShrink: 0, marginTop: 1 }} />
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: 600 }}>{text}</p>
                    <p style={{ fontSize: '12px', color: 'var(--foreground-muted)' }}>{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="mb-6">
              <div className="flex gap-0 rounded-2xl overflow-hidden mb-4" style={{ background: 'var(--secondary)' }}>
                {(['details', 'reviews'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className="flex-1 h-10 transition-all"
                    style={{
                      background: activeTab === tab ? 'var(--foreground)' : 'transparent',
                      color: activeTab === tab ? 'var(--background)' : 'var(--foreground-muted)',
                      fontSize: '13px',
                      fontWeight: 700,
                      textTransform: 'capitalize',
                      borderRadius: '16px',
                    }}
                  >
                    {tab === 'reviews' ? `Reviews (${product.reviewCount.toLocaleString()})` : 'Details'}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {activeTab === 'details' ? (
                  <motion.div key="details" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <p style={{ fontSize: '15px', lineHeight: 1.7, color: 'var(--foreground-secondary)', marginBottom: 16 }}>
                      {product.description}
                    </p>
                    <ul className="space-y-2">
                      {product.features.map(f => (
                        <li key={f} className="flex items-start gap-2.5">
                          <span style={{ color: 'var(--brand-accent)', fontWeight: 700, flexShrink: 0, marginTop: 2 }}>→</span>
                          <span style={{ fontSize: '14px', color: 'var(--foreground-secondary)' }}>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ) : (
                  <motion.div key="reviews" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                    {product.reviews.map(review => (
                      <div key={review.id} className="p-4 rounded-2xl" style={{ background: 'var(--card)', border: '1px solid var(--card-border)' }}>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                              style={{ background: 'var(--foreground)', color: 'var(--background)', fontSize: '13px', fontWeight: 700 }}
                            >
                              {review.avatar}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p style={{ fontSize: '14px', fontWeight: 700 }}>{review.author}</p>
                                {review.verified && (
                                  <span className="px-2 py-0.5 rounded-full" style={{ fontSize: '10px', fontWeight: 700, background: 'rgba(0,85,255,0.1)', color: 'var(--brand-accent)' }}>✓ Verified</span>
                                )}
                              </div>
                              <p style={{ fontSize: '12px', color: 'var(--foreground-muted)' }}>{new Date(review.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                            </div>
                          </div>
                          <div className="flex">
                            {[1,2,3,4,5].map(i => <Star key={i} size={13} fill={i <= review.rating ? '#FFB800' : 'none'} stroke={i <= review.rating ? 'none' : 'var(--foreground-muted)'} />)}
                          </div>
                        </div>
                        <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--foreground-secondary)' }}>{review.comment}</p>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        {related.length > 0 && (
          <div className="px-5 lg:px-10 py-10" style={{ borderTop: '1px solid var(--border)' }}>
            <h3 style={{ fontFamily: 'Satoshi, sans-serif', marginBottom: 20 }}>You Might Also Like</h3>
            <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
              {related.map(p => (
                <div key={p.id} style={{ flexShrink: 0 }}>
                  <ProductCard product={p} variant="wide" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* STICKY ADD TO CART */}
      <div
        className="fixed bottom-16 left-0 right-0 px-4 pb-2 z-40 lg:bottom-0 lg:pb-4"
        style={{ background: 'linear-gradient(to top, var(--background) 60%, transparent)' }}
      >
        <div className="max-w-lg mx-auto">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleAddToCart}
            className="w-full h-14 rounded-2xl flex items-center justify-center gap-3 text-white transition-all"
            style={{
              background: added
                ? 'var(--brand-success, #00C853)'
                : selectedSize
                  ? 'var(--foreground)'
                  : 'var(--foreground)',
              fontSize: '16px',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              boxShadow: 'var(--shadow-xl)',
            }}
            animate={{
              background: added ? '#00C853' : '#0D0D0D',
            }}
          >
            <AnimatePresence mode="wait">
              {added ? (
                <motion.span key="added" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                  ✓ Added to Cart!
                </motion.span>
              ) : (
                <motion.span key="add" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                  Add to Cart — ${product.price}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Zoom modal */}
      <AnimatePresence>
        {zoomOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(20px)' }}
          >
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              src={product.images[activeImage]}
              alt={product.name}
              className="max-w-full max-h-full object-contain rounded-3xl"
              style={{ maxHeight: '90vh', maxWidth: '90vw' }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
