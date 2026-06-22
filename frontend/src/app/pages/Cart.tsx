import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import { useApp } from '../store/AppContext';

export function Cart() {
  const { state, dispatch, cartTotal, cartCount } = useApp();
  const navigate = useNavigate();
  const shipping = cartTotal >= 150 ? 0 : 12.99;
  const tax = cartTotal * 0.08;
  const total = cartTotal + shipping + tax;

  const updateQty = (productId: string, size: number, color: string, delta: number) => {
    const item = state.cart.find(i => i.product.id === productId && i.size === size && i.color === color);
    if (item) {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, size, color, quantity: item.quantity + delta } });
    }
  };

  const remove = (productId: string, size: number, color: string) =>
    dispatch({ type: 'REMOVE_FROM_CART', payload: { productId, size, color } });

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      <div className="max-w-4xl mx-auto px-5 lg:px-10 py-6">
        {state.cart.length === 0 ? (
          <div className="text-center py-24 flex flex-col items-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
              style={{ background: 'var(--secondary)' }}
            >
              <ShoppingBag size={40} style={{ color: 'var(--foreground-muted)' }} />
            </motion.div>
            <h2 style={{ fontFamily: 'Satoshi, sans-serif' }}>Your cart is empty</h2>
            <p style={{ color: 'var(--foreground-muted)', fontSize: '15px', marginTop: 8, marginBottom: 24 }}>
              Looks like you haven't added anything yet
            </p>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/catalog')}
              className="px-8 h-12 rounded-2xl text-white flex items-center gap-2"
              style={{ background: 'var(--foreground)', fontSize: '15px', fontWeight: 700 }}
            >
              Browse Sneakers <ArrowRight size={18} />
            </motion.button>
          </div>
        ) : (
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            {/* Cart items */}
            <div className="lg:col-span-2 space-y-3 mb-6 lg:mb-0">
              <p style={{ fontSize: '13px', color: 'var(--foreground-muted)', fontWeight: 600, marginBottom: 16 }}>
                {cartCount} item{cartCount !== 1 ? 's' : ''} in cart
              </p>
              <AnimatePresence>
                {state.cart.map(item => (
                  <motion.div
                    key={`${item.product.id}-${item.size}-${item.color}`}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex gap-4 p-4 rounded-3xl"
                    style={{ background: 'var(--card)', border: '1px solid var(--card-border)', boxShadow: 'var(--shadow-sm)' }}
                  >
                    <div
                      className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0"
                      style={{ background: 'var(--background-secondary)' }}
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                        style={{ objectPosition: 'center 30%' }}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p style={{ fontSize: '11px', color: 'var(--brand-accent)', fontWeight: 600 }}>{item.product.brand}</p>
                          <p style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.3 }}>{item.product.name}</p>
                          <div className="flex gap-3 mt-1.5">
                            <span style={{ fontSize: '12px', color: 'var(--foreground-muted)', fontWeight: 500 }}>EU {item.size}</span>
                            <span style={{ fontSize: '12px', color: 'var(--foreground-muted)', fontWeight: 500 }}>{item.color}</span>
                          </div>
                        </div>
                        <button onClick={() => remove(item.product.id, item.size, item.color)}>
                          <Trash2 size={16} style={{ color: 'var(--foreground-muted)' }} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2 rounded-2xl overflow-hidden" style={{ border: '1.5px solid var(--border)' }}>
                          <button
                            onClick={() => updateQty(item.product.id, item.size, item.color, -1)}
                            className="w-9 h-9 flex items-center justify-center transition-colors hover:bg-[var(--secondary)]"
                          >
                            <Minus size={14} />
                          </button>
                          <span style={{ fontSize: '14px', fontWeight: 700, minWidth: '20px', textAlign: 'center' }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQty(item.product.id, item.size, item.color, 1)}
                            className="w-9 h-9 flex items-center justify-center transition-colors hover:bg-[var(--secondary)]"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <span style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.03em' }}>
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Order summary */}
            <div className="lg:col-span-1">
              <div className="rounded-3xl p-5 sticky top-20" style={{ background: 'var(--card)', border: '1px solid var(--card-border)', boxShadow: 'var(--shadow-md)' }}>
                <h3 style={{ fontFamily: 'Satoshi, sans-serif', marginBottom: 20 }}>Order Summary</h3>

                {/* Coupon */}
                <div className="flex gap-2 mb-5">
                  <div className="flex-1 relative">
                    <Tag size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--foreground-muted)' }} />
                    <input
                      placeholder="Coupon code"
                      className="w-full h-10 pl-9 pr-3 rounded-xl outline-none"
                      style={{ background: 'var(--input-background)', fontSize: '13px', border: '1px solid var(--border)' }}
                    />
                  </div>
                  <button className="px-4 h-10 rounded-xl" style={{ background: 'var(--secondary)', fontSize: '13px', fontWeight: 700, border: '1px solid var(--border)' }}>
                    Apply
                  </button>
                </div>

                <div className="space-y-3 mb-5">
                  {[
                    { label: 'Subtotal', value: `$${cartTotal.toFixed(2)}` },
                    { label: 'Shipping', value: shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`, green: shipping === 0 },
                    { label: 'Tax (8%)', value: `$${tax.toFixed(2)}` },
                  ].map(({ label, value, green }) => (
                    <div key={label} className="flex justify-between">
                      <span style={{ fontSize: '14px', color: 'var(--foreground-muted)' }}>{label}</span>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: green ? 'var(--brand-success, #00C853)' : 'var(--foreground)' }}>{value}</span>
                    </div>
                  ))}
                </div>

                <div className="h-px my-4" style={{ background: 'var(--border)' }} />

                <div className="flex justify-between mb-5">
                  <span style={{ fontSize: '16px', fontWeight: 700 }}>Total</span>
                  <span style={{ fontSize: '20px', fontWeight: 900, letterSpacing: '-0.03em' }}>${total.toFixed(2)}</span>
                </div>

                {cartTotal < 150 && (
                  <div className="p-3 rounded-2xl mb-4" style={{ background: 'var(--brand-accent-subtle)', border: '1px solid var(--brand-accent-glow)' }}>
                    <p style={{ fontSize: '12px', color: 'var(--brand-accent)', fontWeight: 600 }}>
                      Add ${(150 - cartTotal).toFixed(2)} more for FREE shipping
                    </p>
                  </div>
                )}

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/checkout')}
                  className="w-full h-13 rounded-2xl text-white flex items-center justify-center gap-2"
                  style={{ background: 'var(--foreground)', fontSize: '16px', fontWeight: 700, height: '52px', letterSpacing: '-0.02em' }}
                >
                  Checkout <ArrowRight size={18} />
                </motion.button>

                <p className="text-center mt-3" style={{ fontSize: '12px', color: 'var(--foreground-muted)' }}>
                  🔒 Secured by 256-bit SSL encryption
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
