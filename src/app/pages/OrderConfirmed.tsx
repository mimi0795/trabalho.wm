import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { CheckCircle, Package, Truck, Home, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export function OrderConfirmed() {
  const navigate = useNavigate();
  const orderNumber = `SNX-${Math.random().toString(36).toUpperCase().slice(2, 9)}`;
  const [step, setStep] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#0055FF', '#AAFF00', '#FF2D55', '#FFFFFF'],
      });
    }, 600);

    const t1 = setTimeout(() => setStep(1), 1500);
    const t2 = setTimeout(() => setStep(2), 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const trackingSteps = [
    { icon: CheckCircle, label: 'Order Confirmed', time: 'Just now', done: true },
    { icon: Package, label: 'Processing & Authentication', time: 'Est. 1-2 hours', done: step >= 1 },
    { icon: Truck, label: 'Shipped', time: 'Est. tomorrow', done: step >= 2 },
    { icon: Home, label: 'Delivered', time: 'Est. 2-3 days', done: false },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 py-12" style={{ background: 'var(--background)' }}>
      <div className="max-w-md w-full text-center">
        {/* Success icon */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
          className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: 'rgba(0,200,83,0.1)', border: '2px solid rgba(0,200,83,0.2)' }}
        >
          <CheckCircle size={48} style={{ color: '#00C853' }} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <p style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', color: '#00C853', marginBottom: 8 }}>
            ORDER CONFIRMED
          </p>
          <h1 style={{ fontFamily: 'Satoshi, sans-serif', letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: 8 }}>
            You're all set!
          </h1>
          <p style={{ color: 'var(--foreground-muted)', fontSize: '15px', lineHeight: 1.6, marginBottom: 6 }}>
            Your order has been placed and will be authenticated before shipping.
          </p>
          <p style={{ fontSize: '14px', fontWeight: 700 }}>
            Order: <span style={{ color: 'var(--brand-accent)' }}>{orderNumber}</span>
          </p>
        </motion.div>

        {/* Tracking */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 p-5 rounded-3xl text-left"
          style={{ background: 'var(--card)', border: '1px solid var(--card-border)', boxShadow: 'var(--shadow-md)' }}
        >
          <p style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.04em', color: 'var(--foreground-muted)', marginBottom: 16 }}>
            LIVE TRACKING
          </p>
          <div className="relative space-y-0">
            {trackingSteps.map(({ icon: Icon, label, time, done }, i) => (
              <div key={label} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <motion.div
                    animate={{
                      background: done ? '#00C853' : 'var(--secondary)',
                      borderColor: done ? '#00C853' : 'var(--border)',
                    }}
                    className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all border-2"
                  >
                    <Icon size={16} style={{ color: done ? 'white' : 'var(--foreground-muted)' }} />
                  </motion.div>
                  {i < trackingSteps.length - 1 && (
                    <div className="w-0.5 flex-1 my-1" style={{ minHeight: '20px', background: done ? '#00C853' : 'var(--border)', transition: 'background 0.5s' }} />
                  )}
                </div>
                <div className="pb-4 pt-2">
                  <p style={{ fontSize: '14px', fontWeight: done ? 700 : 500, color: done ? 'var(--foreground)' : 'var(--foreground-muted)' }}>
                    {label}
                  </p>
                  <p style={{ fontSize: '12px', color: 'var(--foreground-muted)' }}>{time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col gap-3 mt-8"
        >
          <button
            onClick={() => navigate('/')}
            className="w-full h-12 rounded-2xl text-white flex items-center justify-center gap-2"
            style={{ background: 'var(--foreground)', fontSize: '15px', fontWeight: 700 }}
          >
            Continue Shopping <ArrowRight size={18} />
          </button>
          <button
            onClick={() => navigate('/profile')}
            className="w-full h-12 rounded-2xl"
            style={{ background: 'var(--secondary)', border: '1px solid var(--border)', fontSize: '15px', fontWeight: 600 }}
          >
            View Order History
          </button>
        </motion.div>
      </div>
    </div>
  );
}
