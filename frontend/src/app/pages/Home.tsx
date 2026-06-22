import { FormEvent, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowRight, ChevronRight, Zap, Shield, RotateCcw, Star } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { products, getNewArrivals, getBestSellers, getExclusives } from '../data/products';
import { api } from '../lib/api';

const categories = [
  { label: 'Running', icon: '🏃', color: '#1F3A5F', bg: 'rgba(31,58,95,0.08)', image: 'https://images.unsplash.com/photo-1776770673997-6a201dca425e?w=400&q=80' },
  { label: 'Basketball', icon: '🏀', color: '#5F5A52', bg: 'rgba(95,90,82,0.08)', image: 'https://images.unsplash.com/photo-1560906992-4b00de401b90?w=400&q=80' },
  { label: 'Lifestyle', icon: '✨', color: '#B89A4D', bg: 'rgba(184,154,77,0.08)', image: 'https://images.unsplash.com/photo-1618554707482-14854a29f955?w=400&q=80' },
  { label: 'Training', icon: '💪', color: '#167A4A', bg: 'rgba(22,122,74,0.08)', image: 'https://images.unsplash.com/photo-1603808033587-935942847de4?w=400&q=80' },
  { label: 'Outdoor', icon: '🏔️', color: '#3C3934', bg: 'rgba(60,57,52,0.08)', image: 'https://images.unsplash.com/photo-1603808033587-935942847de4?w=400&q=80' },
];

const brands = [
  { name: 'Nike', count: 8 },
  { name: 'Jordan', count: 4 },
  { name: 'Adidas', count: 5 },
  { name: 'New Balance', count: 3 },
  { name: 'On', count: 2 },
  { name: 'Puma', count: 1 },
];

const perks = [
  { icon: Shield, label: '100% Authentic', desc: 'Every pair verified' },
  { icon: Zap, label: 'Fast Delivery', desc: '24h shipping' },
  { icon: RotateCcw, label: 'Easy Returns', desc: '30-day policy' },
];

export function Home() {
  const newArrivals = getNewArrivals();
  const bestSellers = getBestSellers();
  const exclusives = getExclusives();
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [newsletterMessage, setNewsletterMessage] = useState('');

  const heroProduct = products[0];
  const featuredProduct = products[3];

  const handleNewsletterSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNewsletterStatus('loading');
    setNewsletterMessage('');

    try {
      await api.subscribeNewsletter(newsletterEmail);
      setNewsletterStatus('success');
      setNewsletterMessage('You are on the list. Drop alerts will arrive first.');
      setNewsletterEmail('');
    } catch (error) {
      setNewsletterStatus('error');
      setNewsletterMessage(error instanceof Error ? error.message : 'Could not subscribe right now.');
    }
  };

  return (
    <div style={{ background: 'var(--background)' }}>
      {/* HERO */}
      <section ref={heroRef} className="relative overflow-hidden" style={{ minHeight: '82vh', background: '#111111' }}>
        <img
          src="https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=1600&q=85"
          alt="Premium men's footwear"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: 'center 45%', filter: 'brightness(0.45) contrast(1.05)' }}
        />
        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#111111] via-[#111111]/72 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent" />

        <div className="relative h-full max-w-7xl mx-auto px-5 lg:px-10 flex flex-col justify-end pb-14 lg:pb-20" style={{ minHeight: '82vh' }}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <span
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm mb-5"
              style={{ background: 'rgba(255,255,255,0.10)', color: '#E7E4DF', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', border: '1px solid rgba(255,255,255,0.18)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#B89A4D]" />
              MEN'S FOOTWEAR 2026
            </span>

            <h1
              className="text-white mb-4"
              style={{
                fontFamily: 'Satoshi, sans-serif',
                fontSize: 'clamp(2.75rem, 7vw, 5rem)',
                fontWeight: 900,
                letterSpacing: '-0.02em',
                lineHeight: 1.0,
                maxWidth: '700px',
              }}
            >
              Refined Shoes<br />For Everyday<br />
              <span style={{ color: '#D2CEC6' }}>Confidence</span>
            </h1>

            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 'clamp(15px,2vw,17px)', lineHeight: 1.6, maxWidth: '420px', marginBottom: '2rem' }}>
              Premium men's sneakers and casual shoes selected for clean style, comfort, and durable daily wear.
            </p>

            <div className="flex flex-wrap gap-3">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/catalog')}
                className="flex items-center gap-2 px-7 h-13 rounded-md text-white"
                style={{ background: 'var(--foreground)', fontSize: '15px', fontWeight: 700, height: '52px', letterSpacing: '0' }}
              >
                Shop Men's Shoes <ArrowRight size={18} />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/catalog?isNew=true')}
                className="flex items-center gap-2 px-7 rounded-md"
                style={{ background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '15px', fontWeight: 600, height: '52px', border: '1px solid rgba(255,255,255,0.15)' }}
              >
                New Arrivals
              </motion.button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-10">
              {[
                { value: '20K+', label: 'Pairs' },
                { value: '100%', label: 'Verified' },
                { value: '2-Day', label: 'Shipping' },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p className="text-white" style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.03em', fontFamily: 'Satoshi, sans-serif' }}>{value}</p>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', fontWeight: 500, letterSpacing: '0.04em' }}>{label.toUpperCase()}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 right-8 hidden lg:flex flex-col items-center gap-2"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="w-px h-10" style={{ background: 'rgba(255,255,255,0.2)' }} />
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', writingMode: 'vertical-rl' }}>SCROLL</span>
        </motion.div>
      </section>

      {/* BRANDS STRIP */}
      <section className="py-10 px-5 lg:px-10" style={{ background: 'var(--background-secondary)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <p style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', color: 'var(--foreground-muted)' }}>SHOP BY BRAND</p>
            <Link to="/catalog" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--brand-accent)' }} className="flex items-center gap-1">
              All brands <ChevronRight size={14} />
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1">
            {brands.map(({ name, count }) => (
              <motion.div
                key={name}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(`/catalog?brand=${name}`)}
                className="flex-shrink-0 px-5 h-11 rounded-md flex items-center gap-2 cursor-pointer transition-all"
                style={{ background: 'var(--card)', border: '1px solid var(--card-border)', boxShadow: 'var(--shadow-sm)' }}
                whileHover={{ borderColor: 'var(--brand-accent)' }}
              >
                <span style={{ fontSize: '14px', fontWeight: 700 }}>{name}</span>
                <span className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: 'var(--secondary)', fontSize: '10px', fontWeight: 700 }}>
                  {count}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8 px-5 lg:px-10">
            <div>
              <p style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--brand-accent)' }}>JUST DROPPED</p>
              <h2 style={{ fontFamily: 'Satoshi, sans-serif', marginTop: 4 }}>New Arrivals for Men</h2>
            </div>
            <Link to="/catalog?isNew=true" className="flex items-center gap-1" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--foreground-muted)' }}>
              See all <ChevronRight size={16} />
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto hide-scrollbar px-5 lg:px-10 pb-2">
            {newArrivals.map(product => (
              <div key={product.id} style={{ flexShrink: 0 }}>
                <ProductCard product={product} variant="wide" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EDITORIAL BANNER */}
      <section className="px-5 lg:px-10 mb-12 lg:mb-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            whileHover={{ scale: 1.005 }}
            onClick={() => navigate(`/product/${featuredProduct.id}`)}
            className="relative overflow-hidden rounded-lg cursor-pointer"
            style={{ height: 'clamp(280px, 40vw, 480px)' }}
          >
            <img
              src={featuredProduct.images[1]}
              alt={featuredProduct.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              style={{ objectPosition: 'center 30%' }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#111111]/80 via-[#111111]/30 to-transparent" />
            <div className="absolute inset-0 p-8 lg:p-12 flex flex-col justify-end">
              <span
                className="inline-block px-3 py-1.5 rounded-sm mb-3 self-start"
                style={{ background: '#E7E4DF', color: '#111111', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em' }}
              >
                EDITOR'S PICK
              </span>
              <h3 className="text-white mb-1" style={{ fontFamily: 'Satoshi, sans-serif', fontSize: 'clamp(1.75rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.1 }}>
                {featuredProduct.name}
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px', marginBottom: '1.25rem', maxWidth: 380 }}>
                {featuredProduct.brand} · Premium materials · Built for daily wear
              </p>
              <div className="flex items-center gap-4">
                <span className="text-white" style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.04em' }}>
                  ${featuredProduct.price}
                </span>
                <button
                  className="flex items-center gap-2 px-5 h-11 rounded-md text-white"
                  style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', fontSize: '14px', fontWeight: 700, backdropFilter: 'blur(8px)' }}
                >
                  Shop Now <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-12 lg:py-16" style={{ background: 'var(--background-secondary)' }}>
        <div className="max-w-7xl mx-auto px-5 lg:px-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--foreground-muted)' }}>EXPLORE</p>
              <h2 style={{ fontFamily: 'Satoshi, sans-serif', marginTop: 4 }}>Categories</h2>
            </div>
          </div>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-4">
            {categories.map(({ label, icon, color, image }) => (
              <motion.div
                key={label}
                whileTap={{ scale: 0.96 }}
                whileHover={{ y: -4 }}
                onClick={() => navigate(`/catalog?category=${label}`)}
                className="relative overflow-hidden rounded-lg cursor-pointer group"
                style={{ height: '160px' }}
              >
                <img
                  src={image}
                  alt={label}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
                <div className="absolute inset-0 p-4 flex flex-col justify-end">
                  <span style={{ fontSize: '22px', marginBottom: '4px' }}>{icon}</span>
                  <span className="text-white" style={{ fontSize: '15px', fontWeight: 800, letterSpacing: '-0.02em' }}>{label}</span>
                  <span style={{ color: '#E7E4DF', fontSize: '11px', fontWeight: 700, marginTop: 2 }}>Shop →</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* BEST SELLERS */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8 px-5 lg:px-10">
            <div>
              <p style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--brand-accent)' }}>CUSTOMER FAVORITES</p>
              <h2 style={{ fontFamily: 'Satoshi, sans-serif', marginTop: 4 }}>Best-Selling Men's Shoes</h2>
            </div>
            <Link to="/catalog?sort=popular" className="flex items-center gap-1" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--foreground-muted)' }}>
              See all <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-5 lg:px-10">
            {bestSellers.slice(0, 8).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* EXCLUSIVES BANNER */}
      <section className="py-12 lg:py-16" style={{ background: '#111111' }}>
        <div className="max-w-7xl mx-auto px-5 lg:px-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', color: '#B89A4D' }}>LIMITED SELECTION</p>
              <h2 className="text-white" style={{ fontFamily: 'Satoshi, sans-serif', marginTop: 4 }}>Premium Picks</h2>
            </div>
            <Link to="/catalog?isExclusive=true" className="flex items-center gap-1" style={{ fontSize: '14px', fontWeight: 600, color: 'rgba(255,255,255,0.4)' }}>
              View all <ChevronRight size={16} />
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
            {exclusives.map(product => (
              <Link key={product.id} to={`/product/${product.id}`} className="group" style={{ flexShrink: 0, width: '240px' }}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="relative overflow-hidden rounded-lg"
                  style={{ height: '300px', background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    style={{ objectPosition: 'center 30%', filter: 'brightness(0.7)' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent" />
                  <div className="absolute bottom-0 p-5">
                    <span className="px-2.5 py-1 rounded-sm" style={{ background: '#E7E4DF', color: '#111111', fontSize: '10px', fontWeight: 700, letterSpacing: '0.06em' }}>PREMIUM</span>
                    <p className="text-white mt-2" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>{product.brand}</p>
                    <p className="text-white" style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '-0.02em', marginTop: 2 }}>{product.name}</p>
                    <p style={{ color: '#D2CEC6', fontSize: '16px', fontWeight: 800, marginTop: 4 }}>${product.price}</p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* PERKS */}
      <section className="py-12 lg:py-16 px-5 lg:px-10" style={{ background: 'var(--background-secondary)', borderTop: '1px solid var(--border)' }}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {perks.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex items-center gap-4 p-5 rounded-lg" style={{ background: 'var(--card)', border: '1px solid var(--card-border)' }}>
              <div className="w-11 h-11 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: 'var(--brand-accent-subtle)' }}>
                <Icon size={20} style={{ color: 'var(--brand-accent)' }} />
              </div>
              <div>
                <p style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '-0.02em' }}>{label}</p>
                <p style={{ fontSize: '13px', color: 'var(--foreground-muted)', marginTop: 2 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* REVIEWS TEASER */}
      <section className="py-12 lg:py-16 px-5 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 text-center">
            <p style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--foreground-muted)' }}>LOVED BY SNEAKERHEADS</p>
            <h2 style={{ fontFamily: 'Satoshi, sans-serif', marginTop: 4 }}>What People Say</h2>
            <div className="flex items-center justify-center gap-1 mt-3">
              {[1,2,3,4,5].map(i => <Star key={i} size={18} fill="#FFB800" stroke="none" />)}
              <span style={{ fontSize: '14px', fontWeight: 700, marginLeft: 6 }}>4.9 · 24,000+ reviews</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: 'Marcus W.', text: 'Finally a marketplace that feels as premium as the shoes. Fast delivery, legit pairs every time.', rating: 5 },
              { name: 'Sofia C.', text: 'Got my Air Jordan 11s in 2 days and they were 100% authentic. The packaging alone is 10/10.', rating: 5 },
              { name: 'Jordan B.', text: 'SNEAKRX is the only platform I trust. Their auth team is next level. Never had a bad experience.', rating: 5 },
            ].map(({ name, text, rating }) => (
              <div key={name} className="p-6 rounded-lg" style={{ background: 'var(--card)', border: '1px solid var(--card-border)' }}>
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: rating }).map((_, i) => <Star key={i} size={14} fill="#FFB800" stroke="none" />)}
                </div>
                <p style={{ fontSize: '15px', lineHeight: 1.6, color: 'var(--foreground-secondary)' }}>"{text}"</p>
                <p style={{ fontSize: '13px', fontWeight: 600, marginTop: 12, color: 'var(--foreground-muted)' }}>— {name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="py-16 px-5 lg:px-10" style={{ background: '#111111' }}>
        <div className="max-w-2xl mx-auto text-center">
          <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--brand-accent)' }}>STAY AHEAD</span>
          <h2 className="text-white mt-3 mb-3" style={{ fontFamily: 'Satoshi, sans-serif', fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', fontWeight: 900, letterSpacing: '-0.04em' }}>
            Get Drop Alerts First
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px', lineHeight: 1.6, marginBottom: '2rem' }}>
            Be the first to know about new releases, exclusive drops, and member-only deals.
          </p>
          <form onSubmit={handleNewsletterSubmit} className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              value={newsletterEmail}
              onChange={event => setNewsletterEmail(event.target.value)}
              className="flex-1 h-12 px-4 rounded-md outline-none"
              style={{ background: 'rgba(255,255,255,0.08)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', fontSize: '15px' }}
              required
            />
            <button
              disabled={newsletterStatus === 'loading'}
              className="px-6 h-12 rounded-md text-white flex-shrink-0"
              style={{ background: 'var(--brand-accent)', fontSize: '14px', fontWeight: 700, opacity: newsletterStatus === 'loading' ? 0.7 : 1 }}
            >
              {newsletterStatus === 'loading' ? 'Sending...' : 'Subscribe'}
            </button>
          </form>
          <p
            style={{
              color: newsletterStatus === 'success' ? '#D2CEC6' : newsletterStatus === 'error' ? '#FFB4B8' : 'rgba(255,255,255,0.3)',
              fontSize: '12px',
              marginTop: 12,
            }}
          >
            {newsletterMessage || 'No spam. Unsubscribe anytime.'}
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 px-5 lg:px-10" style={{ background: '#0A0A0A', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-lg bg-white flex items-center justify-center">
                  <span style={{ color: '#111111', fontSize: '10px', fontWeight: 900, fontFamily: 'Satoshi, sans-serif' }}>SX</span>
                </div>
                <span className="text-white" style={{ fontSize: '16px', fontWeight: 800, letterSpacing: '-0.04em', fontFamily: 'Satoshi, sans-serif' }}>SNEAKRX</span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>Premium Sneaker Marketplace · Est. 2024</p>
            </div>
            <div className="flex flex-wrap gap-6">
              {['About', 'Authentication', 'Sellers', 'Support', 'Privacy', 'Terms'].map(link => (
                <button key={link} style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', fontWeight: 500 }}>{link}</button>
              ))}
            </div>
          </div>
          <div className="mt-8 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '12px' }}>© 2026 SNEAKRX. All rights reserved. All sneakers are 100% authenticated.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
