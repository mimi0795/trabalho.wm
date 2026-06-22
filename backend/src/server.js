import { createServer } from 'node:http';
import { randomUUID } from 'node:crypto';

const PORT = Number(process.env.PORT || 5000);
const MAX_BODY_SIZE = 1_000_000;

const products = [
  {
    id: 'p1',
    name: 'Air Phantom Ultra',
    brand: 'Nike',
    category: 'Lifestyle',
    price: 189,
    image: 'https://images.unsplash.com/photo-1645784127380-77aeb81be500?w=800&q=80',
    stock: 18,
    rating: 4.9,
    isNew: true,
    isBestSeller: true,
  },
  {
    id: 'p2',
    name: 'Boost 360 Pro',
    brand: 'Adidas',
    category: 'Running',
    price: 229,
    image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&q=80',
    stock: 11,
    rating: 4.8,
    isOnSale: true,
    isBestSeller: true,
  },
  {
    id: 'p3',
    name: 'Air Force Iconic',
    brand: 'Nike',
    category: 'Lifestyle',
    price: 149,
    image: 'https://images.unsplash.com/photo-1618554707482-14854a29f955?w=800&q=80',
    stock: 27,
    rating: 4.9,
    isBestSeller: true,
  },
  {
    id: 'p4',
    name: 'Jordan Retro IV OG',
    brand: 'Jordan',
    category: 'Basketball',
    price: 320,
    image: 'https://images.unsplash.com/photo-1560906992-4b00de401b90?w=800&q=80',
    stock: 7,
    rating: 4.95,
    isExclusive: true,
  },
  {
    id: 'p5',
    name: 'Velocity Strike',
    brand: 'Nike',
    category: 'Running',
    price: 259,
    image: 'https://images.unsplash.com/photo-1686931463322-916e93213d86?w=800&q=80',
    stock: 14,
    rating: 4.7,
    isNew: true,
  },
  {
    id: 'p6',
    name: 'Jordan 1 High OG',
    brand: 'Jordan',
    category: 'Basketball',
    price: 270,
    image: 'https://images.unsplash.com/photo-1564864265033-8f50f3e0e3be?w=800&q=80',
    stock: 9,
    rating: 4.9,
    isExclusive: true,
    isBestSeller: true,
  },
];

const orders = [];
const newsletterSubscribers = new Set();

function sendJson(res, statusCode, body) {
  res.writeHead(statusCode, {
    'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json; charset=utf-8',
  });

  if (statusCode === 204) {
    res.end();
    return;
  }

  res.end(JSON.stringify(body));
}

function sendError(res, statusCode, message, details) {
  sendJson(res, statusCode, {
    error: {
      message,
      ...(details ? { details } : {}),
    },
  });
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';

    req.on('data', chunk => {
      body += chunk;
      if (body.length > MAX_BODY_SIZE) {
        reject(new Error('Request body is too large'));
        req.destroy();
      }
    });

    req.on('end', () => {
      if (!body) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error('Invalid JSON body'));
      }
    });

    req.on('error', reject);
  });
}

function pickProductFilters(searchParams) {
  return {
    brand: searchParams.get('brand'),
    category: searchParams.get('category'),
    q: searchParams.get('q')?.trim().toLowerCase(),
    onlyNew: searchParams.get('isNew') === 'true',
    onlyExclusive: searchParams.get('isExclusive') === 'true',
    onlySale: searchParams.get('isOnSale') === 'true',
  };
}

function filterProducts(searchParams) {
  const filters = pickProductFilters(searchParams);
  let list = [...products];

  if (filters.brand) list = list.filter(product => product.brand === filters.brand);
  if (filters.category) list = list.filter(product => product.category === filters.category);
  if (filters.q) {
    list = list.filter(product =>
      [product.name, product.brand, product.category].some(value => value.toLowerCase().includes(filters.q)),
    );
  }
  if (filters.onlyNew) list = list.filter(product => product.isNew);
  if (filters.onlyExclusive) list = list.filter(product => product.isExclusive);
  if (filters.onlySale) list = list.filter(product => product.isOnSale);

  return list;
}

function validateOrder(payload) {
  const errors = [];

  if (!payload || typeof payload !== 'object') errors.push('Order payload is required');
  if (!Array.isArray(payload?.items) || payload.items.length === 0) errors.push('Order must include at least one item');
  if (!payload?.customer?.name) errors.push('Customer name is required');
  if (!payload?.customer?.email) errors.push('Customer email is required');
  if (!payload?.address?.street || !payload?.address?.city) errors.push('Street and city are required');

  const items = Array.isArray(payload?.items) ? payload.items : [];
  for (const item of items) {
    const product = products.find(candidate => candidate.id === item.productId);
    if (!product) errors.push(`Unknown product: ${item.productId}`);
    if (!Number.isInteger(item.quantity) || item.quantity < 1) errors.push('Item quantity must be a positive integer');
    if (!item.size) errors.push('Item size is required');
    if (!item.color) errors.push('Item color is required');
  }

  return errors;
}

function createOrder(payload) {
  const enrichedItems = payload.items.map(item => {
    const product = products.find(candidate => candidate.id === item.productId);
    return {
      productId: item.productId,
      name: product.name,
      brand: product.brand,
      size: item.size,
      color: item.color,
      quantity: item.quantity,
      unitPrice: product.price,
      subtotal: product.price * item.quantity,
    };
  });

  const subtotal = enrichedItems.reduce((sum, item) => sum + item.subtotal, 0);
  const shipping = subtotal >= 150 ? 0 : 12.99;
  const tax = Number((subtotal * 0.08).toFixed(2));
  const total = Number((subtotal + shipping + tax).toFixed(2));

  const order = {
    id: `SNX-${randomUUID().slice(0, 8).toUpperCase()}`,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
    customer: payload.customer,
    address: payload.address,
    shippingMethod: payload.shippingMethod || 'standard',
    paymentMethod: payload.paymentMethod || 'card',
    items: enrichedItems,
    totals: { subtotal, shipping, tax, total },
  };

  orders.unshift(order);
  return order;
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host}`);

  try {
    if (req.method === 'OPTIONS') {
      sendJson(res, 204);
      return;
    }

    if (req.method === 'GET' && url.pathname === '/api/health') {
      sendJson(res, 200, {
        status: 'ok',
        service: 'premium-sneaker-backend',
        uptime: Math.round(process.uptime()),
        timestamp: new Date().toISOString(),
      });
      return;
    }

    if (req.method === 'GET' && url.pathname === '/api/products') {
      const filtered = filterProducts(url.searchParams);
      sendJson(res, 200, {
        count: filtered.length,
        products: filtered,
      });
      return;
    }

    if (req.method === 'GET' && url.pathname.startsWith('/api/products/')) {
      const id = url.pathname.split('/').pop();
      const product = products.find(candidate => candidate.id === id);
      if (!product) {
        sendError(res, 404, 'Product not found');
        return;
      }
      sendJson(res, 200, { product });
      return;
    }

    if (req.method === 'POST' && url.pathname === '/api/orders') {
      const payload = await readBody(req);
      const errors = validateOrder(payload);
      if (errors.length > 0) {
        sendError(res, 422, 'Order validation failed', errors);
        return;
      }

      const order = createOrder(payload);
      sendJson(res, 201, { order });
      return;
    }

    if (req.method === 'GET' && url.pathname === '/api/orders') {
      sendJson(res, 200, { count: orders.length, orders });
      return;
    }

    if (req.method === 'POST' && url.pathname === '/api/newsletter') {
      const payload = await readBody(req);
      const email = String(payload.email || '').trim().toLowerCase();

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        sendError(res, 422, 'A valid email is required');
        return;
      }

      newsletterSubscribers.add(email);
      sendJson(res, 201, {
        email,
        subscribed: true,
        subscriberCount: newsletterSubscribers.size,
      });
      return;
    }

    sendError(res, 404, 'Route not found');
  } catch (error) {
    sendError(res, 500, error.message || 'Unexpected server error');
  }
});

server.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
