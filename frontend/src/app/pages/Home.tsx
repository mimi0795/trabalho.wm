import { FormEvent, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowRight, ChevronRight, Zap, Shield, RotateCcw, Star } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { products, getNewArrivals, getBestSellers, getExclusives } from '../data/products';
import { api } from '../lib/api';
import { formatCurrency, formatNumber, SITE_INITIALS, SITE_NAME, translateCategory } from '../lib/locale';

const categoryCards = [
  { value: 'Running', label: translateCategory('Running'), image: 'https://images.unsplash.com/photo-1776770673997-6a201dca425e?w=400&q=80' },
  { value: 'Basketball', label: translateCategory('Basketball'), image: 'https://images.unsplash.com/photo-1560906992-4b00de401b90?w=400&q=80' },
  { value: 'Lifestyle', label: translateCategory('Lifestyle'), image: 'https://images.unsplash.com/photo-1618554707482-14854a29f955?w=400&q=80' },
  { value: 'Training', label: translateCategory('Training'), image: 'https://images.unsplash.com/photo-1603808033587-935942847de4?w=400&q=80' },
  { value: 'Outdoor', label: translateCategory('Outdoor'), image: 'https://images.unsplash.com/photo-1603808033587-935942847de4?w=400&q=80' },
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
  { icon: Shield, label: '100% autêntico', desc: 'Cada par é verificado' },
  { icon: Zap, label: 'Entrega rápida', desc: 'Envio em até 24h úteis' },
  { icon: RotateCcw, label: 'Troca simples', desc: '30 dias para solicitar' },
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

  const featuredProduct = products[3];

  const handleNewsletterSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNewsletterStatus('loading');
    setNewsletterMessage('');

    try {
      await api.subscribeNewsletter(newsletterEmail);
      setNewsletterStatus('success');
      setNewsletterMessage('Você entrou na lista. Os alertas de lançamentos chegam primeiro por e-mail.');
      setNewsletterEmail('');
    } catch (error) {
      setNewsletterStatus('error');
      setNewsletterMessage(error instanceof Error ? error.message : 'Não foi possível cadastrar seu e-mail agora.');
    }
  };

  return (
    <div style={{ background: 'var(--background)' }}>
      <section ref={heroRef} className="relative overflow-hidden" style={{ minHeight: '78vh', background: '#0D0D0D' }}>
        <img
          src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1800&q=90"
          alt="Tênis esportivo premium em destaque"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: 'center 58%', filter: 'brightness(0.62) contrast(1.08) saturate(0.9)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D0D0D] via-[#0D0D0D]/78 to-[#0D0D0D]/8" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/20 to-transparent" />

        <div className="relative h-full max-w-7xl mx-auto px-5 lg:px-10 flex flex-col justify-end pb-14 lg:pb-20" style={{ minHeight: '78vh' }}>
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
              CURADORIA MASCULINA 2026
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
              Tênis premium<br />para uma rotina<br />
              <span style={{ color: '#D2CEC6' }}>mais precisa</span>
            </h1>

            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 'clamp(15px,2vw,17px)', lineHeight: 1.6, maxWidth: '420px', marginBottom: '2rem' }}>
              Modelos selecionados por conforto, acabamento e autenticidade para acompanhar trabalho, treino e uso diário.
            </p>

            <div className="flex flex-wrap gap-3">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/catalog')}
                className="flex items-center gap-2 px-7 h-13 rounded-md text-white"
                style={{ background: 'var(--foreground)', fontSize: '15px', fontWeight: 700, height: '52px', letterSpacing: '0' }}
              >
                Explorar catálogo <ArrowRight size={18} />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/catalog?isNew=true')}
                className="flex items-center gap-2 px-7 rounded-md"
                style={{ background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '15px', fontWeight: 600, height: '52px', border: '1px solid rgba(255,255,255,0.15)' }}
              >
                Ver lançamentos
              </motion.button>
            </div>

            <div className="flex gap-8 mt-10">
              {[
                { value: '20 mil+', label: 'Pares' },
                { value: '100%', label: 'Autenticados' },
                { value: '24h', label: 'Postagem' },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p className="text-white" style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.03em', fontFamily: 'Satoshi, sans-serif' }}>{value}</p>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', fontWeight: 500, letterSpacing: '0.04em' }}>{label.toUpperCase()}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-8 right-8 hidden lg:flex flex-col items-center gap-2"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="w-px h-10" style={{ background: 'rgba(255,255,255,0.2)' }} />
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', writingMode: 'vertical-rl' }}>ROLAR</span>
        </motion.div>
      </section>

      <section className="py-10" style={{ background: 'var(--background-secondary)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-7xl mx-auto px-5 lg:px-10">
          <div className="flex items-center justify-between gap-4 mb-6">
            <p style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--foreground-muted)' }}>ESCOLHER POR MARCA</p>
            <Link to="/catalog" style={{ fontSize: '13px', fontWeight: 700, color: 'var(--brand-accent)' }} className="flex items-center gap-1 flex-shrink-0">
              Todas as marcas <ChevronRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {brands.map(({ name, count }) => (
              <motion.div
                key={name}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(`/catalog?brand=${name}`)}
                className="px-5 h-12 rounded-md flex items-center justify-between gap-3 cursor-pointer transition-all"
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

      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8 px-5 lg:px-10">
            <div>
              <p style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--brand-accent)' }}>ACABOU DE CHEGAR</p>
              <h2 style={{ fontFamily: 'Satoshi, sans-serif', marginTop: 4 }}>Novidades masculinas</h2>
            </div>
            <Link to="/catalog?isNew=true" className="flex items-center gap-1" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--foreground-muted)' }}>
              Ver tudo <ChevronRight size={16} />
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
                ESCOLHA DA CURADORIA
              </span>
              <h3 className="text-white mb-1" style={{ fontFamily: 'Satoshi, sans-serif', fontSize: 'clamp(1.75rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.1 }}>
                {featuredProduct.name}
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px', marginBottom: '1.25rem', maxWidth: 380 }}>
                {featuredProduct.brand} · materiais premium · feito para uso diário
              </p>
              <div className="flex items-center gap-4">
                <span className="text-white" style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.04em' }}>
                  {formatCurrency(featuredProduct.price)}
                </span>
                <button
                  className="flex items-center gap-2 px-5 h-11 rounded-md text-white"
                  style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', fontSize: '14px', fontWeight: 700, backdropFilter: 'blur(8px)' }}
                >
                  Comprar agora <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-12 lg:py-16" style={{ background: 'var(--background-secondary)' }}>
        <div className="max-w-7xl mx-auto px-5 lg:px-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--foreground-muted)' }}>EXPLORE</p>
              <h2 style={{ fontFamily: 'Satoshi, sans-serif', marginTop: 4 }}>Categorias</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-4">
            {categoryCards.map(({ value, label, image }) => (
              <motion.div
                key={value}
                whileTap={{ scale: 0.96 }}
                whileHover={{ y: -4 }}
                onClick={() => navigate(`/catalog?category=${value}`)}
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
                  <span className="text-white" style={{ fontSize: '15px', fontWeight: 800, letterSpacing: '-0.02em' }}>{label}</span>
                  <span style={{ color: '#E7E4DF', fontSize: '11px', fontWeight: 700, marginTop: 2 }}>Comprar →</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8 px-5 lg:px-10">
            <div>
              <p style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--brand-accent)' }}>FAVORITOS DOS CLIENTES</p>
              <h2 style={{ fontFamily: 'Satoshi, sans-serif', marginTop: 4 }}>Mais vendidos</h2>
            </div>
            <Link to="/catalog?sort=popular" className="flex items-center gap-1" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--foreground-muted)' }}>
              Ver tudo <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-5 lg:px-10">
            {bestSellers.slice(0, 8).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16" style={{ background: '#111111' }}>
        <div className="max-w-7xl mx-auto px-5 lg:px-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', color: '#B89A4D' }}>SELEÇÃO LIMITADA</p>
              <h2 className="text-white" style={{ fontFamily: 'Satoshi, sans-serif', marginTop: 4 }}>Escolhas premium</h2>
            </div>
            <Link to="/catalog?isExclusive=true" className="flex items-center gap-1" style={{ fontSize: '14px', fontWeight: 600, color: 'rgba(255,255,255,0.4)' }}>
              Ver tudo <ChevronRight size={16} />
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
                    <p style={{ color: '#D2CEC6', fontSize: '16px', fontWeight: 800, marginTop: 4 }}>{formatCurrency(product.price)}</p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

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

      <section className="py-12 lg:py-16 px-5 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 text-center">
            <p style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--foreground-muted)' }}>APROVADO POR QUEM COLECIONA</p>
            <h2 style={{ fontFamily: 'Satoshi, sans-serif', marginTop: 4 }}>O que dizem por aí</h2>
            <div className="flex items-center justify-center gap-1 mt-3">
              {[1,2,3,4,5].map(i => <Star key={i} size={18} fill="#FFB800" stroke="none" />)}
              <span style={{ fontSize: '14px', fontWeight: 700, marginLeft: 6 }}>4,9 · {formatNumber(24000)}+ avaliações</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: 'Marcus W.', text: 'Finalmente um marketplace que parece tão premium quanto os tênis. Entrega rápida e pares legítimos sempre.', rating: 5 },
              { name: 'Sofia C.', text: 'Recebi meu Air Jordan 11 em 2 dias e veio 100% autenticado. Até a embalagem impressiona.', rating: 5 },
              { name: 'Jordan B.', text: `${SITE_NAME} é a plataforma em que eu confio. A curadoria é séria e a experiência é ótima.`, rating: 5 },
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

      <section className="py-16 px-5 lg:px-10" style={{ background: '#111111' }}>
        <div className="max-w-2xl mx-auto text-center">
          <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--brand-accent)' }}>FIQUE NA FRENTE</span>
          <h2 className="text-white mt-3 mb-3" style={{ fontFamily: 'Satoshi, sans-serif', fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', fontWeight: 900, letterSpacing: '-0.04em' }}>
            Receba lançamentos primeiro
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px', lineHeight: 1.6, marginBottom: '2rem' }}>
            Saiba antes sobre novas coleções, drops exclusivos e ofertas para membros.
          </p>
          <form onSubmit={handleNewsletterSubmit} className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="seu@email.com"
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
              {newsletterStatus === 'loading' ? 'Enviando...' : 'Assinar'}
            </button>
          </form>
          <p
            style={{
              color: newsletterStatus === 'success' ? '#D2CEC6' : newsletterStatus === 'error' ? '#FFB4B8' : 'rgba(255,255,255,0.3)',
              fontSize: '12px',
              marginTop: 12,
            }}
          >
            {newsletterMessage || 'Sem spam. Você pode cancelar quando quiser.'}
          </p>
        </div>
      </section>

      <footer className="py-10 px-5 lg:px-10" style={{ background: '#0A0A0A', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-lg bg-white flex items-center justify-center">
                  <span style={{ color: '#111111', fontSize: '10px', fontWeight: 900, fontFamily: 'Satoshi, sans-serif' }}>{SITE_INITIALS}</span>
                </div>
                <span className="text-white" style={{ fontSize: '16px', fontWeight: 800, letterSpacing: '-0.04em', fontFamily: 'Satoshi, sans-serif' }}>{SITE_NAME}</span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>Marketplace premium de tênis · Desde 2024</p>
            </div>
            <div className="flex flex-wrap gap-6">
              {['Sobre', 'Autenticação', 'Vendedores', 'Suporte', 'Privacidade', 'Termos'].map(link => (
                <button key={link} style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', fontWeight: 500 }}>{link}</button>
              ))}
            </div>
          </div>
          <div className="mt-8 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '12px' }}>© 2026 {SITE_NAME}. Todos os direitos reservados. Todos os tênis são 100% autenticados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
