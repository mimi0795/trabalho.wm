import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Zap, Shield, Truck } from 'lucide-react';
import { useApp } from '../store/AppContext';

const slides = [
  {
    id: 0,
    image: 'https://images.unsplash.com/photo-1560906992-4b00de401b90?w=800&q=80',
    tag: 'PREMIUM SELECTION',
    headline: 'The Rarest\nSneakers,\nAll in One Place',
    body: 'Thousands of exclusive drops from Nike, Jordan, Adidas and more — authenticated and ready to ship.',
    icon: Shield,
    accent: '#0055FF',
  },
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1618554707482-14854a29f955?w=800&q=80',
    tag: 'INSTANT DROPS',
    headline: 'Never Miss\na Release\nAgain',
    body: 'Real-time alerts for limited drops. Secure checkout in under 30 seconds. Be first in line, every time.',
    icon: Zap,
    accent: '#AAFF00',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&q=80',
    tag: 'FAST DELIVERY',
    headline: 'Delivered in\n24 Hours,\nAuthenticated',
    body: '100% verified authentic. Ships in premium packaging with certificate of authenticity included.',
    icon: Truck,
    accent: '#FF2D55',
  },
];

export function Onboarding() {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();
  const { dispatch } = useApp();

  const handleNext = () => {
    if (current < slides.length - 1) {
      setCurrent(c => c + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    dispatch({ type: 'SET_ONBOARDING_SEEN' });
    navigate('/');
  };

  const slide = slides[current];

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ background: '#0D0D0D' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          {/* Background image */}
          <div className="absolute inset-0">
            <img
              src={slide.image}
              alt=""
              className="w-full h-full object-cover"
              style={{ filter: 'brightness(0.35)' }}
            />
          </div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/60 to-transparent" />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-between p-8" style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 56px)', paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 40px)' }}>
            {/* Top: logo + skip */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: 'white' }}
                >
                  <span style={{ color: '#0D0D0D', fontSize: '13px', fontWeight: 900, fontFamily: 'Satoshi, sans-serif', letterSpacing: '-0.05em' }}>SX</span>
                </div>
                <span style={{ color: 'white', fontSize: '18px', fontWeight: 800, letterSpacing: '-0.04em', fontFamily: 'Satoshi, sans-serif' }}>SNEAKRX</span>
              </div>
              <button
                onClick={handleFinish}
                style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', fontWeight: 500 }}
              >
                Skip
              </button>
            </div>

            {/* Bottom: text content */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <span
                  className="inline-block px-3 py-1.5 rounded-full mb-4"
                  style={{
                    background: `${slide.accent}20`,
                    color: slide.accent,
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    border: `1px solid ${slide.accent}40`,
                  }}
                >
                  {slide.tag}
                </span>
                <h1
                  className="text-white mb-4"
                  style={{
                    fontSize: 'clamp(2.5rem, 8vw, 4rem)',
                    fontWeight: 900,
                    lineHeight: 1.05,
                    letterSpacing: '-0.04em',
                    fontFamily: 'Satoshi, sans-serif',
                    whiteSpace: 'pre-line',
                  }}
                >
                  {slide.headline}
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '16px', lineHeight: 1.6, maxWidth: '380px' }}>
                  {slide.body}
                </p>
              </motion.div>

              {/* Progress dots */}
              <div className="flex items-center gap-2 mt-8 mb-6">
                {slides.map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      width: i === current ? 24 : 6,
                      background: i === current ? slide.accent : 'rgba(255,255,255,0.3)',
                    }}
                    transition={{ duration: 0.3 }}
                    className="h-1.5 rounded-full"
                    style={{ width: 6 }}
                  />
                ))}
              </div>

              {/* CTA */}
              <div className="flex gap-3">
                <motion.button
                  onClick={handleNext}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 h-14 rounded-2xl flex items-center justify-center gap-2 text-white"
                  style={{ background: slide.accent, fontSize: '16px', fontWeight: 700, letterSpacing: '-0.02em' }}
                >
                  {current === slides.length - 1 ? 'Get Started' : 'Continue'}
                  <ChevronRight size={20} />
                </motion.button>
                {current === slides.length - 1 && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => navigate('/auth/login')}
                    whileTap={{ scale: 0.95 }}
                    className="h-14 px-6 rounded-2xl flex items-center justify-center"
                    style={{ background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '15px', fontWeight: 600, border: '1px solid rgba(255,255,255,0.15)' }}
                  >
                    Sign In
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
