import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { CreditCard, Smartphone, Building2, ChevronRight, Check } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { api, cartItemsToOrderItems } from '../lib/api';
import { FREE_SHIPPING_THRESHOLD, formatCurrency, pluralize, STANDARD_SHIPPING, TAX_RATE } from '../lib/locale';

const STEPS = ['Endereço', 'Entrega', 'Pagamento', 'Revisão'] as const;
type Step = typeof STEPS[number];

export function Checkout() {
  const [step, setStep] = useState<Step>('Endereço');
  const [loading, setLoading] = useState(false);
  const [orderError, setOrderError] = useState('');
  const { state, cartTotal, dispatch } = useApp();
  const navigate = useNavigate();

  const stepIndex = STEPS.indexOf(step);
  const shipping = cartTotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING;
  const tax = cartTotal * TAX_RATE;
  const total = cartTotal + shipping + tax;

  const [address, setAddress] = useState({ name: '', street: '', city: '', state: '', zip: '', country: 'BR' });
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express' | 'overnight'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'pix' | 'bank'>('card');
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '', name: '' });

  const validateStep = (currentStep: Step) => {
    if (state.cart.length === 0) return 'Sua sacola está vazia';

    if (currentStep === 'Endereço') {
      const missing = [
        !address.name.trim() && 'nome',
        !address.street.trim() && 'rua',
        !address.city.trim() && 'cidade',
        !address.state.trim() && 'estado',
        !address.zip.trim() && 'CEP',
      ].filter(Boolean);

      if (missing.length > 0) return `Preencha ${missing.join(', ')} para continuar`;
    }

    if (currentStep === 'Pagamento' && paymentMethod === 'card') {
      const cardNumber = card.number.replace(/\D/g, '');
      const cvv = card.cvv.replace(/\D/g, '');

      if (cardNumber.length < 13 || !card.name.trim() || !card.expiry.trim() || cvv.length < 3) {
        return 'Preencha os dados do cartão ou escolha PIX';
      }
    }

    return '';
  };

  const validateCheckout = () => validateStep('Endereço') || validateStep('Pagamento');

  const handleNext = () => {
    const validationError = validateStep(step);
    if (validationError) {
      setOrderError(validationError);
      return;
    }

    setOrderError('');
    const idx = STEPS.indexOf(step);
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1]);
    else handlePlaceOrder();
  };

  const handlePlaceOrder = async () => {
    const validationError = validateCheckout();
    if (validationError) {
      setOrderError(validationError);
      return;
    }

    setLoading(true);
    setOrderError('');

    try {
      const { order } = await api.createOrder({
        customer: {
          name: address.name || state.user?.name || 'Cliente convidado',
          email: state.user?.email || 'cliente@passoprime.test',
        },
        address,
        shippingMethod,
        paymentMethod,
        items: cartItemsToOrderItems(state.cart),
      });

      sessionStorage.setItem('lastOrderId', order.id);
      sessionStorage.setItem('lastOrderTotal', String(order.totals.total));
      dispatch({ type: 'CLEAR_CART' });
      navigate(`/order-confirmed?order=${order.id}`);
    } catch (error) {
      setOrderError(error instanceof Error ? error.message : 'Não foi possível finalizar o pedido');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    background: 'var(--input-background)',
    border: '1.5px solid transparent',
    fontSize: '15px',
    height: '48px',
  };

  const onFocus = (e: React.FocusEvent<HTMLInputElement>) => (e.target.style.borderColor = 'var(--brand-accent)');
  const onBlur = (e: React.FocusEvent<HTMLInputElement>) => (e.target.style.borderColor = 'transparent');

  const shippingOptions = [
    { id: 'standard', label: 'Entrega padrão', time: '3 a 5 dias úteis', price: shipping === 0 ? 'Grátis' : formatCurrency(shipping), cost: shipping },
    { id: 'express', label: 'Entrega expressa', time: '1 a 2 dias úteis', price: formatCurrency(49.9), cost: 49.9 },
    { id: 'overnight', label: 'Entrega prioritária', time: 'Próximo dia útil', price: formatCurrency(89.9), cost: 89.9 },
  ];

  const paymentOptions = [
    { id: 'card', icon: CreditCard, label: 'Cartão' },
    { id: 'pix', icon: Smartphone, label: 'PIX' },
    { id: 'bank', icon: Building2, label: 'Transferência' },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--background-secondary)' }}>
      <div className="max-w-4xl mx-auto px-5 lg:px-10 py-6">
        <div className="flex items-center gap-0 mb-8 overflow-x-auto hide-scrollbar">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center flex-shrink-0">
              <button
                onClick={() => i < stepIndex && setStep(s)}
                className="flex items-center gap-2"
                disabled={i > stepIndex}
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                  style={{
                    background: i <= stepIndex ? 'var(--foreground)' : 'var(--secondary)',
                    color: i <= stepIndex ? 'var(--background)' : 'var(--foreground-muted)',
                    fontSize: '12px',
                    fontWeight: 700,
                    border: `2px solid ${i <= stepIndex ? 'var(--foreground)' : 'var(--border)'}`,
                  }}
                >
                  {i < stepIndex ? <Check size={14} /> : i + 1}
                </div>
                <span style={{ fontSize: '13px', fontWeight: i === stepIndex ? 700 : 500, color: i === stepIndex ? 'var(--foreground)' : 'var(--foreground-muted)', whiteSpace: 'nowrap' }}>
                  {s}
                </span>
              </button>
              {i < STEPS.length - 1 && (
                <div className="h-px mx-3 flex-1" style={{ width: '24px', minWidth: '24px', background: i < stepIndex ? 'var(--foreground)' : 'var(--border)' }} />
              )}
            </div>
          ))}
        </div>

        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          <div className="lg:col-span-2 mb-6 lg:mb-0">
            <div className="rounded-3xl p-6" style={{ background: 'var(--card)', border: '1px solid var(--card-border)', boxShadow: 'var(--shadow-sm)' }}>
              <AnimatePresence mode="wait">
                {step === 'Endereço' && (
                  <motion.div key="address" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                    <h3 style={{ fontFamily: 'Satoshi, sans-serif', marginBottom: 20 }}>Endereço de entrega</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <input placeholder="Nome completo" className="w-full px-4 rounded-2xl outline-none" style={inputStyle} onFocus={onFocus} onBlur={onBlur} value={address.name} onChange={e => setAddress(a => ({ ...a, name: e.target.value }))} />
                      <input placeholder="Rua, número e complemento" className="w-full px-4 rounded-2xl outline-none" style={inputStyle} onFocus={onFocus} onBlur={onBlur} value={address.street} onChange={e => setAddress(a => ({ ...a, street: e.target.value }))} />
                      <div className="grid grid-cols-2 gap-3">
                        <input placeholder="Cidade" className="px-4 rounded-2xl outline-none" style={inputStyle} onFocus={onFocus} onBlur={onBlur} value={address.city} onChange={e => setAddress(a => ({ ...a, city: e.target.value }))} />
                        <input placeholder="Estado" className="px-4 rounded-2xl outline-none" style={inputStyle} onFocus={onFocus} onBlur={onBlur} value={address.state} onChange={e => setAddress(a => ({ ...a, state: e.target.value }))} />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <input placeholder="CEP" className="px-4 rounded-2xl outline-none" style={inputStyle} onFocus={onFocus} onBlur={onBlur} value={address.zip} onChange={e => setAddress(a => ({ ...a, zip: e.target.value }))} />
                        <select
                          className="px-4 rounded-2xl outline-none"
                          style={{ ...inputStyle, color: 'var(--foreground)' }}
                          value={address.country}
                          onChange={e => setAddress(a => ({ ...a, country: e.target.value }))}
                        >
                          <option value="BR">Brasil</option>
                          <option value="US">Estados Unidos</option>
                          <option value="CA">Canadá</option>
                          <option value="GB">Reino Unido</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 'Entrega' && (
                  <motion.div key="shipping" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h3 style={{ fontFamily: 'Satoshi, sans-serif', marginBottom: 20 }}>Método de entrega</h3>
                    <div className="space-y-3">
                      {shippingOptions.map(opt => (
                        <button
                          key={opt.id}
                          onClick={() => setShippingMethod(opt.id as typeof shippingMethod)}
                          className="w-full flex items-center justify-between p-4 rounded-2xl transition-all text-left"
                          style={{
                            background: shippingMethod === opt.id ? 'var(--brand-accent-subtle)' : 'var(--secondary)',
                            border: `2px solid ${shippingMethod === opt.id ? 'var(--brand-accent)' : 'transparent'}`,
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                              style={{
                                background: shippingMethod === opt.id ? 'var(--brand-accent)' : 'transparent',
                                border: `2px solid ${shippingMethod === opt.id ? 'var(--brand-accent)' : 'var(--border)'}`,
                              }}
                            >
                              {shippingMethod === opt.id && <div className="w-2 h-2 rounded-full bg-white" />}
                            </div>
                            <div>
                              <p style={{ fontSize: '15px', fontWeight: 700 }}>{opt.label}</p>
                              <p style={{ fontSize: '13px', color: 'var(--foreground-muted)' }}>{opt.time}</p>
                            </div>
                          </div>
                          <span style={{ fontSize: '15px', fontWeight: 700, color: opt.cost === 0 ? '#00C853' : 'var(--foreground)' }}>{opt.price}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {step === 'Pagamento' && (
                  <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h3 style={{ fontFamily: 'Satoshi, sans-serif', marginBottom: 20 }}>Método de pagamento</h3>
                    <div className="flex gap-3 mb-6">
                      {paymentOptions.map(({ id, icon: Icon, label }) => (
                        <button
                          key={id}
                          onClick={() => setPaymentMethod(id as typeof paymentMethod)}
                          className="flex-1 flex flex-col items-center gap-2 p-3 rounded-2xl transition-all"
                          style={{
                            background: paymentMethod === id ? 'var(--brand-accent-subtle)' : 'var(--secondary)',
                            border: `2px solid ${paymentMethod === id ? 'var(--brand-accent)' : 'transparent'}`,
                          }}
                        >
                          <Icon size={20} style={{ color: paymentMethod === id ? 'var(--brand-accent)' : 'var(--foreground-muted)' }} />
                          <span style={{ fontSize: '11px', fontWeight: 700, color: paymentMethod === id ? 'var(--brand-accent)' : 'var(--foreground-muted)', textAlign: 'center' }}>{label}</span>
                        </button>
                      ))}
                    </div>
                    {paymentMethod === 'card' && (
                      <div className="space-y-3">
                        <input placeholder="Número do cartão" maxLength={19} className="w-full px-4 rounded-2xl outline-none" style={inputStyle} onFocus={onFocus} onBlur={onBlur} value={card.number} onChange={e => setCard(c => ({ ...c, number: e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim() }))} />
                        <input placeholder="Nome impresso no cartão" className="w-full px-4 rounded-2xl outline-none" style={inputStyle} onFocus={onFocus} onBlur={onBlur} value={card.name} onChange={e => setCard(c => ({ ...c, name: e.target.value }))} />
                        <div className="grid grid-cols-2 gap-3">
                          <input placeholder="MM / AA" maxLength={5} className="px-4 rounded-2xl outline-none" style={inputStyle} onFocus={onFocus} onBlur={onBlur} value={card.expiry} onChange={e => setCard(c => ({ ...c, expiry: e.target.value }))} />
                          <input placeholder="CVV" maxLength={4} type="password" className="px-4 rounded-2xl outline-none" style={inputStyle} onFocus={onFocus} onBlur={onBlur} value={card.cvv} onChange={e => setCard(c => ({ ...c, cvv: e.target.value }))} />
                        </div>
                      </div>
                    )}
                    {paymentMethod === 'pix' && (
                      <div className="text-center p-8 rounded-2xl" style={{ background: 'var(--secondary)' }}>
                        <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--foreground-muted)' }}>Um QR Code PIX será gerado após a confirmação do pedido.</p>
                      </div>
                    )}
                    {paymentMethod === 'bank' && (
                      <div className="text-center p-8 rounded-2xl" style={{ background: 'var(--secondary)' }}>
                        <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--foreground-muted)' }}>Os dados bancários serão enviados junto com a confirmação.</p>
                      </div>
                    )}
                  </motion.div>
                )}

                {step === 'Revisão' && (
                  <motion.div key="review" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h3 style={{ fontFamily: 'Satoshi, sans-serif', marginBottom: 20 }}>Revisar pedido</h3>
                    <div className="space-y-3 mb-6">
                      {state.cart.map(item => (
                        <div key={`${item.product.id}-${item.size}`} className="flex gap-3 p-3 rounded-2xl" style={{ background: 'var(--secondary)' }}>
                          <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0" style={{ background: 'var(--background-secondary)' }}>
                            <img src={item.product.image} alt="" className="w-full h-full object-cover" style={{ objectPosition: 'center 30%' }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p style={{ fontSize: '14px', fontWeight: 700 }} className="truncate">{item.product.name}</p>
                            <p style={{ fontSize: '12px', color: 'var(--foreground-muted)' }}>EU {item.size} · {item.color} · Qtd. {item.quantity}</p>
                          </div>
                          <span style={{ fontSize: '15px', fontWeight: 800 }}>{formatCurrency(item.product.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2 p-4 rounded-2xl" style={{ background: 'var(--secondary)' }}>
                      <div className="flex justify-between text-sm">
                        <span style={{ color: 'var(--foreground-muted)' }}>Subtotal</span>
                        <span style={{ fontWeight: 600 }}>{formatCurrency(cartTotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span style={{ color: 'var(--foreground-muted)' }}>Frete</span>
                        <span style={{ fontWeight: 600, color: shipping === 0 ? '#00C853' : 'inherit' }}>{shipping === 0 ? 'Grátis' : formatCurrency(shipping)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span style={{ color: 'var(--foreground-muted)' }}>Taxas</span>
                        <span style={{ fontWeight: 600 }}>{formatCurrency(tax)}</span>
                      </div>
                      <div className="h-px" style={{ background: 'var(--border)' }} />
                      <div className="flex justify-between">
                        <span style={{ fontWeight: 700, fontSize: '15px' }}>Total</span>
                        <span style={{ fontWeight: 900, fontSize: '18px' }}>{formatCurrency(total)}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="rounded-3xl p-5 sticky top-20" style={{ background: 'var(--card)', border: '1px solid var(--card-border)' }}>
              <h4 style={{ fontFamily: 'Satoshi, sans-serif', marginBottom: 12, fontSize: '15px' }}>
                {state.cart.length} {pluralize(state.cart.length, 'item', 'itens')}
              </h4>
              <div className="space-y-2 mb-4">
                {state.cart.map(item => (
                  <div key={`${item.product.id}-${item.size}`} className="flex justify-between text-sm">
                    <span style={{ color: 'var(--foreground-muted)', maxWidth: '150px' }} className="truncate">{item.product.name} ×{item.quantity}</span>
                    <span style={{ fontWeight: 600 }}>{formatCurrency(item.product.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="h-px mb-4" style={{ background: 'var(--border)' }} />
              <div className="flex justify-between mb-5">
                <span style={{ fontWeight: 700 }}>Total</span>
                <span style={{ fontWeight: 900, fontSize: '18px' }}>{formatCurrency(total)}</span>
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleNext}
                disabled={loading}
                className="w-full h-12 rounded-2xl text-white flex items-center justify-center gap-2"
                style={{ background: 'var(--foreground)', fontSize: '15px', fontWeight: 700, letterSpacing: '-0.02em' }}
              >
                {loading ? (
                  <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                  <>
                    {step === 'Revisão' ? 'Confirmar pedido' : 'Continuar'}
                    <ChevronRight size={18} />
                  </>
                )}
              </motion.button>
              {orderError && (
                <p className="mt-3 text-center" style={{ color: 'var(--brand-error)', fontSize: '12px', fontWeight: 600 }}>
                  {orderError}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
