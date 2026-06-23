import { createServer } from 'node:http';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from 'dotenv';
import {
  closeDatabase,
  connectDatabase,
  createOrder,
  createSupportTicket,
  getDatabaseInfo,
  getProductById,
  listOrders,
  listProducts,
  subscribeNewsletter,
  validateOrder,
} from './db.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '../.env') });
config();

const PORT = Number(process.env.PORT || 5000);
const MAX_BODY_SIZE = 1_000_000;

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
        reject(new Error('Corpo da requisição muito grande'));
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
        reject(new Error('JSON inválido no corpo da requisição'));
      }
    });

    req.on('error', reject);
  });
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
        service: 'passo-prime-backend',
        database: getDatabaseInfo(),
        uptime: Math.round(process.uptime()),
        timestamp: new Date().toISOString(),
      });
      return;
    }

    if (req.method === 'GET' && url.pathname === '/api/products') {
      const products = await listProducts(url.searchParams);
      sendJson(res, 200, {
        count: products.length,
        products,
      });
      return;
    }

    if (req.method === 'GET' && url.pathname.startsWith('/api/products/')) {
      const id = url.pathname.split('/').pop();
      const product = await getProductById(id);
      if (!product) {
        sendError(res, 404, 'Produto não encontrado');
        return;
      }
      sendJson(res, 200, { product });
      return;
    }

    if (req.method === 'POST' && url.pathname === '/api/orders') {
      const payload = await readBody(req);
      const { errors, productsById } = await validateOrder(payload);
      if (errors.length > 0) {
        sendError(res, 422, 'Falha na validação do pedido', errors);
        return;
      }

      const order = await createOrder(payload, productsById);
      sendJson(res, 201, { order });
      return;
    }

    if (req.method === 'GET' && url.pathname === '/api/orders') {
      const orders = await listOrders();
      sendJson(res, 200, { count: orders.length, orders });
      return;
    }

    if (req.method === 'POST' && url.pathname === '/api/newsletter') {
      const payload = await readBody(req);
      const email = String(payload.email || '').trim().toLowerCase();

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        sendError(res, 422, 'Informe um e-mail válido');
        return;
      }

      const subscription = await subscribeNewsletter(email);
      sendJson(res, 201, subscription);
      return;
    }

    if (req.method === 'POST' && url.pathname === '/api/support') {
      const payload = await readBody(req);
      if (!payload?.subject && !payload?.assunto) {
        sendError(res, 422, 'Informe o assunto do atendimento');
        return;
      }
      if (!payload?.message && !payload?.mensagem) {
        sendError(res, 422, 'Informe a mensagem do atendimento');
        return;
      }

      const ticket = await createSupportTicket(payload);
      sendJson(res, 201, { ticket });
      return;
    }

    sendError(res, 404, 'Rota não encontrada');
  } catch (error) {
    sendError(res, 500, error.message || 'Erro inesperado no servidor');
  }
});

async function start() {
  try {
    await connectDatabase();
    server.listen(PORT, () => {
      console.log(`Backend rodando em http://localhost:${PORT}`);
      console.log(`MongoDB conectado ao banco ${getDatabaseInfo().name}`);
    });
  } catch (error) {
    console.error('Não foi possível conectar ao MongoDB.');
    console.error(error.message || error);
    console.error('Defina MONGODB_URI no backend/.env ou inicie um MongoDB local em mongodb://127.0.0.1:27017.');
    process.exitCode = 1;
  }
}

async function shutdown() {
  await closeDatabase();
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

start();
