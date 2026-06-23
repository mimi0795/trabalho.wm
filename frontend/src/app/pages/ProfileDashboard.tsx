import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { motion } from 'motion/react';
import {
  AlertCircle,
  BadgeCheck,
  Banknote,
  Bell,
  BellRing,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Globe2,
  Heart,
  HelpCircle,
  LockKeyhole,
  Mail,
  MapPin,
  MessageCircle,
  Moon,
  Package,
  ReceiptText,
  RotateCcw,
  Send,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Star,
  Sun,
  Truck,
  User,
  Wallet,
} from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { products } from '../data/products';
import { useApp } from '../store/AppContext';
import { api, type CreatedOrder } from '../lib/api';
import { FREE_SHIPPING_THRESHOLD, formatCurrency, formatDate, formatNumber, SITE_NAME } from '../lib/locale';

const sectionInfo = {
  pedidos: {
    title: 'Histórico de pedidos',
    eyebrow: 'Compras',
    description: 'Acompanhe pedidos, status de envio, autenticação dos pares e totais já comprados.',
    icon: Package,
  },
  favoritos: {
    title: 'Favoritos',
    eyebrow: 'Compras',
    description: 'Veja seus produtos salvos, preço médio e atalhos para continuar comprando.',
    icon: Heart,
  },
  pagamentos: {
    title: 'Formas de pagamento',
    eyebrow: 'Compras',
    description: 'Gerencie cartões, PIX, transferência e preferências de cobrança.',
    icon: CreditCard,
  },
  notificacoes: {
    title: 'Notificações',
    eyebrow: 'Conta',
    description: 'Controle alertas de pedidos, lançamentos, promoções e segurança.',
    icon: Bell,
  },
  autenticacao: {
    title: 'Autenticação',
    eyebrow: 'Conta',
    description: 'Acompanhe a verificação dos pares, garantia de autenticidade e proteção da conta.',
    icon: ShieldCheck,
  },
  configuracoes: {
    title: 'Configurações',
    eyebrow: 'Conta',
    description: 'Ajuste preferências de tema, idioma, privacidade e entrega.',
    icon: Settings,
  },
  ajuda: {
    title: 'Central de ajuda',
    eyebrow: 'Suporte',
    description: 'Encontre respostas rápidas, canais de contato e prazos de atendimento.',
    icon: HelpCircle,
  },
  avaliar: {
    title: `Avaliar ${SITE_NAME}`,
    eyebrow: 'Suporte',
    description: 'Compartilhe sua experiência para melhorar a loja e o atendimento.',
    icon: Star,
  },
} as const;

type SectionKey = keyof typeof sectionInfo;

const isSectionKey = (value?: string): value is SectionKey =>
  Boolean(value && value in sectionInfo);

const sectionOrder: SectionKey[] = [
  'pedidos',
  'favoritos',
  'pagamentos',
  'notificacoes',
  'autenticacao',
  'configuracoes',
  'ajuda',
  'avaliar',
];

export function ProfileDashboard() {
  const { section } = useParams<{ section: string }>();
  const navigate = useNavigate();
  const { state, cartTotal, toggleTheme } = useApp();
  const currentSection: SectionKey = isSectionKey(section) ? section : 'pedidos';
  const info = sectionInfo[currentSection];
  const Icon = info.icon;
  const [orders, setOrders] = useState<CreatedOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState('');
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [reviewSent, setReviewSent] = useState(false);
  const [notificationPrefs, setNotificationPrefs] = useState({
    orders: true,
    launches: true,
    promotions: false,
    security: true,
  });

  useEffect(() => {
    if (!isSectionKey(section)) navigate('/profile', { replace: true });
  }, [navigate, section]);

  useEffect(() => {
    let ignore = false;
    setOrdersLoading(true);
    setOrdersError('');

    api.listOrders()
      .then(({ orders }) => {
        if (!ignore) setOrders(orders);
      })
      .catch(error => {
        if (!ignore) setOrdersError(error instanceof Error ? error.message : 'Não foi possível carregar os pedidos');
      })
      .finally(() => {
        if (!ignore) setOrdersLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const wishlistedProducts = useMemo(
    () => products.filter(product => state.wishlist.includes(product.id)),
    [state.wishlist],
  );

  const recommendedProducts = useMemo(
    () => products.filter(product => !state.wishlist.includes(product.id)).slice(0, 4),
    [state.wishlist],
  );

  const renderDashboard = () => {
    switch (currentSection) {
      case 'pedidos':
        return <OrdersDashboard orders={orders} loading={ordersLoading} error={ordersError} />;
      case 'favoritos':
        return <FavoritesDashboard products={wishlistedProducts} recommendations={recommendedProducts} />;
      case 'pagamentos':
        return <PaymentsDashboard userEmail={state.user?.email} />;
      case 'notificacoes':
        return (
          <NotificationsDashboard
            prefs={notificationPrefs}
            onToggle={key => setNotificationPrefs(value => ({ ...value, [key]: !value[key] }))}
          />
        );
      case 'autenticacao':
        return <AuthenticationDashboard orders={orders} loading={ordersLoading} />;
      case 'configuracoes':
        return <SettingsDashboard theme={state.theme} cartTotal={cartTotal} toggleTheme={toggleTheme} />;
      case 'ajuda':
        return <HelpDashboard />;
      case 'avaliar':
        return (
          <ReviewDashboard
            rating={rating}
            review={review}
            sent={reviewSent}
            onRating={setRating}
            onReview={value => {
              setReview(value);
              setReviewSent(false);
            }}
            onSend={() => setReviewSent(true)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      <div className="max-w-6xl mx-auto px-5 lg:px-10 py-6">
        <section
          className="relative overflow-hidden rounded-3xl p-6 mb-6"
          style={{ background: '#111111', minHeight: 190 }}
        >
          <img
            src="https://images.unsplash.com/photo-1560906986-838e16987db2?w=1200&q=80"
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-20"
          />
          <div className="relative grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: 'var(--brand-accent)', color: 'white' }}
              >
                <Icon size={22} />
              </div>
              <p style={{ color: '#B89A4D', fontSize: 12, fontWeight: 800, letterSpacing: '0.08em', marginBottom: 8 }}>
                {info.eyebrow.toUpperCase()}
              </p>
              <h1 className="text-white" style={{ fontFamily: 'Satoshi, sans-serif', letterSpacing: '-0.04em', lineHeight: 1.05 }}>
                {info.title}
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.62)', maxWidth: 620, fontSize: 15, lineHeight: 1.6, marginTop: 10 }}>
                {info.description}
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                to="/profile"
                className="h-11 px-4 rounded-2xl flex items-center justify-center"
                style={{ color: 'white', border: '1px solid rgba(255,255,255,0.18)', background: 'rgba(255,255,255,0.08)', fontSize: 14, fontWeight: 700 }}
              >
                Voltar ao perfil
              </Link>
              <Link
                to="/catalog"
                className="h-11 px-4 rounded-2xl flex items-center justify-center gap-2"
                style={{ color: '#111111', background: 'white', fontSize: 14, fontWeight: 800 }}
              >
                Comprar <ShoppingBag size={16} />
              </Link>
            </div>
          </div>
        </section>

        {renderDashboard()}

        <Panel className="mt-6">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <h3 style={{ fontFamily: 'Satoshi, sans-serif', fontSize: 18 }}>Outras áreas</h3>
              <p style={{ color: 'var(--foreground-muted)', fontSize: 13 }}>Acesse os demais painéis da sua conta</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {sectionOrder.map(key => {
              const ItemIcon = sectionInfo[key].icon;
              const active = key === currentSection;
              return (
                <Link
                  key={key}
                  to={`/profile/${key}`}
                  className="p-3 rounded-2xl flex items-center gap-3 transition-colors"
                  style={{
                    background: active ? 'var(--foreground)' : 'var(--secondary)',
                    color: active ? 'var(--background)' : 'var(--foreground)',
                    border: `1px solid ${active ? 'var(--foreground)' : 'var(--border)'}`,
                  }}
                >
                  <ItemIcon size={17} />
                  <span style={{ fontSize: 13, fontWeight: 700 }}>{sectionInfo[key].title}</span>
                </Link>
              );
            })}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function OrdersDashboard({ orders, loading, error }: { orders: CreatedOrder[]; loading: boolean; error: string }) {
  const totalSpent = orders.reduce((sum, order) => sum + (order.totals?.total ?? 0), 0);
  const totalItems = orders.reduce((sum, order) => sum + (order.items?.reduce((itemSum, item) => itemSum + item.quantity, 0) ?? 0), 0);
  const latestOrder = orders[0];

  return (
    <div className="space-y-6">
      <MetricGrid>
        <Metric icon={ReceiptText} label="Pedidos" value={formatNumber(orders.length)} sub="Registrados na API" />
        <Metric icon={Wallet} label="Total comprado" value={formatCurrency(totalSpent)} sub="Produtos, frete e taxas" />
        <Metric icon={Package} label="Itens" value={formatNumber(totalItems)} sub="Pares comprados" />
        <Metric icon={Truck} label="Último envio" value={latestOrder ? 'Em andamento' : 'Sem pedido'} sub={latestOrder?.id ?? 'Finalize uma compra'} />
      </MetricGrid>

      <Panel>
        <SectionTitle title="Pedidos recentes" desc="Status, itens e totais enviados pelo backend" />
        {loading && <LoadingState label="Carregando pedidos" />}
        {!loading && error && <InlineAlert text={error} />}
        {!loading && !error && orders.length === 0 && (
          <EmptyState
            icon={Package}
            title="Nenhum pedido encontrado"
            desc="Quando uma compra for confirmada, o histórico aparece aqui com status de autenticação e envio."
            actionLabel="Ver catálogo"
            actionTo="/catalog"
          />
        )}
        {!loading && orders.length > 0 && (
          <div className="space-y-3">
            {orders.map(order => (
              <article key={order.id} className="p-4 rounded-2xl" style={{ background: 'var(--secondary)', border: '1px solid var(--border)' }}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span style={{ fontSize: 15, fontWeight: 900 }}>{order.id}</span>
                      <StatusPill label={order.status || 'confirmado'} tone="success" />
                    </div>
                    <p style={{ color: 'var(--foreground-muted)', fontSize: 13 }}>
                      {order.createdAt ? formatDate(order.createdAt) : 'Data não informada'} · {order.paymentMethod === 'pix' ? 'PIX' : order.paymentMethod === 'bank' ? 'Transferência' : 'Cartão'}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p style={{ fontSize: 18, fontWeight: 900 }}>{formatCurrency(order.totals.total)}</p>
                    <p style={{ color: 'var(--foreground-muted)', fontSize: 12 }}>Frete {order.totals.shipping === 0 ? 'grátis' : formatCurrency(order.totals.shipping)}</p>
                  </div>
                </div>
                <div className="mt-4 grid gap-2">
                  {(order.items ?? []).map(item => (
                    <div key={`${order.id}-${item.productId}-${item.size}-${item.color}`} className="flex items-center justify-between gap-3 text-sm">
                      <span style={{ color: 'var(--foreground-muted)' }}>
                        {item.quantity}x {item.name} · EU {item.size} · {item.color}
                      </span>
                      <span style={{ fontWeight: 700 }}>{formatCurrency(item.subtotal)}</span>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}
      </Panel>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Panel>
          <SectionTitle title="Fluxo de entrega" desc="Etapas padrão após a confirmação" />
          <Timeline
            items={[
              ['Pedido confirmado', 'Pagamento registrado e resumo enviado'],
              ['Autenticação', 'Conferência de modelo, numeração e acabamento'],
              ['Preparação', 'Embalagem premium e emissão da etiqueta'],
              ['Entrega', 'Envio com rastreio atualizado'],
            ]}
          />
        </Panel>
        <Panel>
          <SectionTitle title="Política do pedido" desc="Regras principais para compras" />
          <InfoRow icon={RotateCcw} title="Troca e devolução" desc="Solicitação em até 30 dias após o recebimento." />
          <InfoRow icon={BadgeCheck} title="Garantia de autenticidade" desc="Todos os pares passam por verificação antes do envio." />
          <InfoRow icon={Truck} title="Frete grátis" desc={`Pedidos acima de ${formatCurrency(FREE_SHIPPING_THRESHOLD)} têm entrega padrão grátis.`} />
        </Panel>
      </div>
    </div>
  );
}

function FavoritesDashboard({ products, recommendations }: { products: typeof import('../data/products').products; recommendations: typeof import('../data/products').products }) {
  const savedValue = products.reduce((sum, product) => sum + product.price, 0);
  const avgPrice = products.length > 0 ? savedValue / products.length : 0;

  return (
    <div className="space-y-6">
      <MetricGrid>
        <Metric icon={Heart} label="Salvos" value={formatNumber(products.length)} sub="Na lista de favoritos" />
        <Metric icon={Wallet} label="Valor salvo" value={formatCurrency(savedValue)} sub="Soma dos produtos" />
        <Metric icon={Star} label="Preço médio" value={formatCurrency(avgPrice)} sub="Baseado nos favoritos" />
        <Metric icon={BellRing} label="Alertas" value={products.length > 0 ? 'Ativos' : 'Inativos'} sub="Queda de preço e reposição" />
      </MetricGrid>

      <Panel>
        <div className="flex items-center justify-between gap-3 mb-4">
          <SectionTitle title="Produtos favoritos" desc="Pares que você salvou para comprar depois" compact />
          <Link to="/wishlist" style={{ color: 'var(--brand-accent)', fontSize: 13, fontWeight: 800 }}>Ver lista completa</Link>
        </div>
        {products.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="Nenhum favorito salvo"
            desc="Toque no coração de um produto para acompanhar preço, estoque e novidades."
            actionLabel="Explorar produtos"
            actionTo="/catalog"
          />
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {products.map(product => <ProductCard key={product.id} product={product} />)}
          </div>
        )}
      </Panel>

      {products.length === 0 && (
        <Panel>
          <SectionTitle title="Sugestões para começar" desc="Produtos populares alinhados à curadoria da loja" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {recommendations.map(product => <ProductCard key={product.id} product={product} />)}
          </div>
        </Panel>
      )}
    </div>
  );
}

function PaymentsDashboard({ userEmail }: { userEmail?: string }) {
  return (
    <div className="space-y-6">
      <MetricGrid>
        <Metric icon={CreditCard} label="Cartões" value="1" sub="Principal cadastrado" />
        <Metric icon={Smartphone} label="PIX" value="Ativo" sub="Confirmação instantânea" />
        <Metric icon={Banknote} label="Transferência" value="Disponível" sub="Compensação manual" />
        <Metric icon={ShieldCheck} label="Segurança" value="3D Secure" sub="Proteção em compras" />
      </MetricGrid>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Panel>
          <SectionTitle title="Métodos salvos" desc="Opções disponíveis no checkout" />
          <InfoRow icon={CreditCard} title="Cartão principal" desc="Mastercard final 4242 · validade 12/29" meta="Padrão" />
          <InfoRow icon={Smartphone} title="PIX" desc={userEmail ? `Chave sugerida: ${userEmail}` : 'QR Code gerado ao confirmar o pedido'} meta="Rápido" />
          <InfoRow icon={Banknote} title="Transferência" desc="Dados bancários enviados na confirmação" meta="Manual" />
        </Panel>
        <Panel>
          <SectionTitle title="Preferências de cobrança" desc="Resumo aplicado às próximas compras" />
          <InfoRow icon={ReceiptText} title="Nota e recibo" desc="Enviados por e-mail após a confirmação." />
          <InfoRow icon={Wallet} title="Parcelamento" desc="Até 10x no cartão, com cálculo no provedor de pagamento." />
          <InfoRow icon={LockKeyhole} title="Dados sensíveis" desc="O projeto não armazena número completo do cartão." />
        </Panel>
      </div>
    </div>
  );
}

function NotificationsDashboard({ prefs, onToggle }: { prefs: Record<'orders' | 'launches' | 'promotions' | 'security', boolean>; onToggle: (key: 'orders' | 'launches' | 'promotions' | 'security') => void }) {
  return (
    <div className="space-y-6">
      <MetricGrid>
        <Metric icon={Bell} label="Canais" value="3" sub="E-mail, app e SMS" />
        <Metric icon={Package} label="Pedidos" value={prefs.orders ? 'Ligado' : 'Desligado'} sub="Status e rastreio" />
        <Metric icon={Star} label="Lançamentos" value={prefs.launches ? 'Ligado' : 'Desligado'} sub="Drops e novidades" />
        <Metric icon={ShieldCheck} label="Segurança" value={prefs.security ? 'Ligado' : 'Desligado'} sub="Alertas essenciais" />
      </MetricGrid>

      <Panel>
        <SectionTitle title="Preferências" desc="Escolha quais comunicações deseja receber" />
        <ToggleRow icon={Package} title="Atualizações de pedidos" desc="Confirmação, autenticação, envio e entrega." enabled={prefs.orders} onClick={() => onToggle('orders')} />
        <ToggleRow icon={BellRing} title="Lançamentos e reposições" desc="Novos modelos, numerações e drops premium." enabled={prefs.launches} onClick={() => onToggle('launches')} />
        <ToggleRow icon={Wallet} title="Promoções e benefícios" desc="Cupons, frete grátis e campanhas sazonais." enabled={prefs.promotions} onClick={() => onToggle('promotions')} />
        <ToggleRow icon={ShieldCheck} title="Segurança da conta" desc="Login, alterações de senha e verificações." enabled={prefs.security} onClick={() => onToggle('security')} />
      </Panel>
    </div>
  );
}

function AuthenticationDashboard({ orders, loading }: { orders: CreatedOrder[]; loading: boolean }) {
  const latestOrder = orders[0];

  return (
    <div className="space-y-6">
      <MetricGrid>
        <Metric icon={BadgeCheck} label="Garantia" value="100%" sub="Pares verificados" />
        <Metric icon={ShieldCheck} label="Inspeção" value="12 pontos" sub="Modelo, material e acabamento" />
        <Metric icon={Package} label="Pedido atual" value={latestOrder?.id ?? 'Nenhum'} sub={loading ? 'Carregando' : 'Última compra'} />
        <Metric icon={LockKeyhole} label="Conta" value="Protegida" sub="Sessão local e dados mínimos" />
      </MetricGrid>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Panel>
          <SectionTitle title="Verificação dos pares" desc="Como a loja autentica cada produto" />
          <Timeline
            items={[
              ['Recebimento', 'Conferência do SKU, caixa e etiqueta'],
              ['Materiais', 'Análise de couro, mesh, costuras e solado'],
              ['Numeração', 'Validação de forma, medidas e acabamento interno'],
              ['Liberação', 'Selo digital anexado ao pedido'],
            ]}
          />
        </Panel>
        <Panel>
          <SectionTitle title="Última autenticação" desc="Resumo baseado no histórico de pedidos" />
          {latestOrder ? (
            <>
              <InfoRow icon={ReceiptText} title={latestOrder.id} desc={`${latestOrder.items?.length ?? 0} item(ns) em validação operacional`} meta="Ativo" />
              <InfoRow icon={BadgeCheck} title="Status" desc="Pedido confirmado e pronto para conferência." />
              <InfoRow icon={Truck} title="Próxima etapa" desc="Preparação para envio após autenticação." />
            </>
          ) : (
            <EmptyState
              icon={ShieldCheck}
              title="Nenhum par em autenticação"
              desc="Após finalizar uma compra, o andamento da verificação aparece neste painel."
              actionLabel="Comprar agora"
              actionTo="/catalog"
            />
          )}
        </Panel>
      </div>
    </div>
  );
}

function SettingsDashboard({ theme, cartTotal, toggleTheme }: { theme: 'light' | 'dark'; cartTotal: number; toggleTheme: () => void }) {
  return (
    <div className="space-y-6">
      <MetricGrid>
        <Metric icon={theme === 'dark' ? Moon : Sun} label="Tema" value={theme === 'dark' ? 'Escuro' : 'Claro'} sub="Preferência visual" />
        <Metric icon={Globe2} label="Idioma" value="Português" sub="Brasil · BRL" />
        <Metric icon={MapPin} label="Entrega" value="Brasil" sub="CEP no checkout" />
        <Metric icon={ShoppingBag} label="Sacola" value={formatCurrency(cartTotal)} sub="Valor atual" />
      </MetricGrid>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Panel>
          <SectionTitle title="Preferências" desc="Configurações principais da experiência" />
          <ToggleRow icon={theme === 'dark' ? Moon : Sun} title="Tema escuro" desc="Alterna a aparência do site." enabled={theme === 'dark'} onClick={toggleTheme} />
          <InfoRow icon={Globe2} title="Idioma e moeda" desc="Português do Brasil · Real brasileiro." meta="pt-BR" />
          <InfoRow icon={Truck} title="Frete grátis" desc={`Ativo acima de ${formatCurrency(FREE_SHIPPING_THRESHOLD)}.`} />
        </Panel>
        <Panel>
          <SectionTitle title="Privacidade" desc="Dados usados apenas para a experiência do projeto" />
          <InfoRow icon={User} title="Perfil" desc="Nome e e-mail aparecem no pedido e na conta." />
          <InfoRow icon={LockKeyhole} title="Pagamento" desc="Dados completos de cartão não são armazenados." />
          <InfoRow icon={Bell} title="Comunicação" desc="Preferências podem ser ajustadas no painel de notificações." />
        </Panel>
      </div>
    </div>
  );
}

function HelpDashboard() {
  return (
    <div className="space-y-6">
      <MetricGrid>
        <Metric icon={MessageCircle} label="Chat" value="Online" sub="Resposta em minutos" />
        <Metric icon={Mail} label="E-mail" value="24h" sub="Prazo médio" />
        <Metric icon={Truck} label="Entrega" value="2 a 5 dias" sub="Conforme método" />
        <Metric icon={RotateCcw} label="Trocas" value="30 dias" sub="Após recebimento" />
      </MetricGrid>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Panel>
          <SectionTitle title="Perguntas frequentes" desc="Respostas rápidas para dúvidas comuns" />
          <Faq question="Como acompanho meu pedido?" answer="Abra Histórico de pedidos para ver status, itens, total e etapa de envio." />
          <Faq question="Os pares são originais?" answer="Sim. O fluxo de autenticação confere modelo, materiais, numeração e acabamento antes do envio." />
          <Faq question="Quando o frete fica grátis?" answer={`A entrega padrão fica grátis acima de ${formatCurrency(FREE_SHIPPING_THRESHOLD)}.`} />
          <Faq question="Posso trocar o produto?" answer="Sim. A solicitação pode ser feita em até 30 dias após o recebimento." />
        </Panel>
        <Panel>
          <SectionTitle title="Canais de atendimento" desc="Escolha o caminho mais adequado" />
          <InfoRow icon={MessageCircle} title="Chat da loja" desc="Suporte para pedidos, pagamento e entrega." meta="Agora" />
          <InfoRow icon={Mail} title="E-mail" desc="atendimento@passoprime.test" meta="24h" />
          <InfoRow icon={AlertCircle} title="Prioridade" desc="Pedidos confirmados e problemas de pagamento têm prioridade." />
        </Panel>
      </div>
    </div>
  );
}

function ReviewDashboard({ rating, review, sent, onRating, onReview, onSend }: { rating: number; review: string; sent: boolean; onRating: (value: number) => void; onReview: (value: string) => void; onSend: () => void }) {
  return (
    <div className="space-y-6">
      <MetricGrid>
        <Metric icon={Star} label="Sua nota" value={`${rating}/5`} sub="Avaliação atual" />
        <Metric icon={MessageCircle} label="Comentário" value={review.trim() ? 'Escrito' : 'Pendente'} sub="Feedback da experiência" />
        <Metric icon={BadgeCheck} label="Status" value={sent ? 'Enviado' : 'Rascunho'} sub="Nesta sessão" />
        <Metric icon={Heart} label="Impacto" value="Alto" sub="Ajuda a priorizar melhorias" />
      </MetricGrid>

      <Panel>
        <SectionTitle title={`Avalie o ${SITE_NAME}`} desc="Conte como foi comprar, navegar e finalizar o pedido" />
        <div className="flex gap-2 mb-4">
          {[1, 2, 3, 4, 5].map(value => (
            <button key={value} onClick={() => onRating(value)} className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: value <= rating ? '#FFB800' : 'var(--secondary)', color: value <= rating ? '#111111' : 'var(--foreground-muted)' }}>
              <Star size={19} fill={value <= rating ? '#111111' : 'none'} />
            </button>
          ))}
        </div>
        <textarea
          value={review}
          onChange={event => onReview(event.target.value)}
          placeholder="Escreva sua avaliação"
          className="w-full min-h-36 rounded-2xl p-4 outline-none resize-none"
          style={{ background: 'var(--input-background)', border: '1.5px solid var(--border)', fontSize: 14, lineHeight: 1.6 }}
        />
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4">
          <p style={{ color: sent ? '#00A85A' : 'var(--foreground-muted)', fontSize: 13, fontWeight: 600 }}>
            {sent ? 'Obrigado pela avaliação. Ela foi registrada nesta sessão.' : 'Sua opinião ajuda a melhorar a experiência da loja.'}
          </p>
          <button
            onClick={onSend}
            disabled={!review.trim()}
            className="h-11 px-5 rounded-2xl text-white flex items-center justify-center gap-2"
            style={{ background: review.trim() ? 'var(--foreground)' : 'var(--foreground-muted)', fontSize: 14, fontWeight: 800 }}
          >
            Enviar avaliação <Send size={16} />
          </button>
        </div>
      </Panel>
    </div>
  );
}

function Panel({ children, className = '', style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <div
      className={`rounded-3xl p-5 ${className}`}
      style={{ background: 'var(--card)', border: '1px solid var(--card-border)', boxShadow: 'var(--shadow-sm)', ...style }}
    >
      {children}
    </div>
  );
}

function MetricGrid({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">{children}</div>;
}

function Metric({ icon: Icon, label, value, sub }: { icon: typeof Package; label: string; value: string; sub: string }) {
  return (
    <Panel className="min-h-32">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4" style={{ background: 'var(--secondary)' }}>
        <Icon size={17} style={{ color: 'var(--brand-accent)' }} />
      </div>
      <p style={{ color: 'var(--foreground-muted)', fontSize: 12, fontWeight: 700 }}>{label}</p>
      <p style={{ fontSize: 21, fontWeight: 900, letterSpacing: '-0.04em', marginTop: 2 }}>{value}</p>
      <p style={{ color: 'var(--foreground-muted)', fontSize: 12, marginTop: 2 }}>{sub}</p>
    </Panel>
  );
}

function SectionTitle({ title, desc, compact = false }: { title: string; desc: string; compact?: boolean }) {
  return (
    <div className={compact ? '' : 'mb-4'}>
      <h3 style={{ fontFamily: 'Satoshi, sans-serif', fontSize: compact ? 17 : 19 }}>{title}</h3>
      <p style={{ color: 'var(--foreground-muted)', fontSize: 13, marginTop: 2 }}>{desc}</p>
    </div>
  );
}

function InfoRow({ icon: Icon, title, desc, meta }: { icon: typeof Package; title: string; desc: string; meta?: string }) {
  return (
    <div className="flex items-start gap-3 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--secondary)' }}>
        <Icon size={16} style={{ color: 'var(--foreground)' }} />
      </div>
      <div className="flex-1 min-w-0">
        <p style={{ fontSize: 14, fontWeight: 800 }}>{title}</p>
        <p style={{ color: 'var(--foreground-muted)', fontSize: 13, lineHeight: 1.45 }}>{desc}</p>
      </div>
      {meta && <StatusPill label={meta} tone="neutral" />}
    </div>
  );
}

function ToggleRow({ icon, title, desc, enabled, onClick }: { icon: typeof Package; title: string; desc: string; enabled: boolean; onClick: () => void }) {
  const Icon = icon;

  return (
    <div className="flex items-center gap-3 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--secondary)' }}>
        <Icon size={16} style={{ color: 'var(--foreground)' }} />
      </div>
      <div className="flex-1 min-w-0">
        <p style={{ fontSize: 14, fontWeight: 800 }}>{title}</p>
        <p style={{ color: 'var(--foreground-muted)', fontSize: 13, lineHeight: 1.45 }}>{desc}</p>
      </div>
      <motion.button
        whileTap={{ scale: 0.94 }}
        onClick={onClick}
        className="relative w-12 h-6 rounded-full flex-shrink-0"
        style={{ background: enabled ? 'var(--brand-accent)' : 'var(--border)' }}
      >
        <motion.span
          animate={{ x: enabled ? 24 : 2 }}
          className="absolute top-0.5 w-5 h-5 rounded-full bg-white"
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        />
      </motion.button>
    </div>
  );
}

function StatusPill({ label, tone }: { label: string; tone: 'success' | 'neutral' }) {
  return (
    <span
      className="px-2.5 py-1 rounded-full"
      style={{
        background: tone === 'success' ? 'rgba(0,168,90,0.1)' : 'var(--secondary)',
        color: tone === 'success' ? '#00A85A' : 'var(--foreground-muted)',
        fontSize: 11,
        fontWeight: 800,
      }}
    >
      {label}
    </span>
  );
}

function Timeline({ items }: { items: Array<[string, string]> }) {
  return (
    <div>
      {items.map(([title, desc], index) => (
        <div key={title} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: index === 0 ? 'var(--brand-accent)' : 'var(--secondary)', color: index === 0 ? 'white' : 'var(--foreground-muted)' }}>
              {index === 0 ? <CheckCircle2 size={15} /> : <ChevronRight size={15} />}
            </div>
            {index < items.length - 1 && <div className="w-px flex-1 my-1" style={{ minHeight: 18, background: 'var(--border)' }} />}
          </div>
          <div className="pb-4 pt-1">
            <p style={{ fontSize: 14, fontWeight: 800 }}>{title}</p>
            <p style={{ color: 'var(--foreground-muted)', fontSize: 13 }}>{desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function Faq({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="py-3" style={{ borderBottom: '1px solid var(--border)' }}>
      <p style={{ fontSize: 14, fontWeight: 800 }}>{question}</p>
      <p style={{ color: 'var(--foreground-muted)', fontSize: 13, lineHeight: 1.5, marginTop: 3 }}>{answer}</p>
    </div>
  );
}

function EmptyState({ icon: Icon, title, desc, actionLabel, actionTo }: { icon: typeof Package; title: string; desc: string; actionLabel: string; actionTo: string }) {
  return (
    <div className="text-center py-10 flex flex-col items-center">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'var(--secondary)' }}>
        <Icon size={26} style={{ color: 'var(--brand-accent)' }} />
      </div>
      <h3 style={{ fontFamily: 'Satoshi, sans-serif', fontSize: 19 }}>{title}</h3>
      <p style={{ color: 'var(--foreground-muted)', fontSize: 14, maxWidth: 430, lineHeight: 1.6, marginTop: 6 }}>{desc}</p>
      <Link to={actionTo} className="h-11 px-5 rounded-2xl text-white flex items-center justify-center mt-5" style={{ background: 'var(--foreground)', fontSize: 14, fontWeight: 800 }}>
        {actionLabel}
      </Link>
    </div>
  );
}

function LoadingState({ label }: { label: string }) {
  return (
    <div className="py-10 flex items-center justify-center gap-3" style={{ color: 'var(--foreground-muted)', fontSize: 14, fontWeight: 700 }}>
      <div className="w-5 h-5 rounded-full border-2 border-current border-t-transparent animate-spin" />
      {label}
    </div>
  );
}

function InlineAlert({ text }: { text: string }) {
  return (
    <div className="p-4 rounded-2xl flex items-start gap-3" style={{ background: 'rgba(180,35,42,0.08)', color: 'var(--brand-error)', border: '1px solid rgba(180,35,42,0.18)' }}>
      <AlertCircle size={18} />
      <p style={{ fontSize: 13, fontWeight: 700 }}>{text}</p>
    </div>
  );
}
