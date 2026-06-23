import { randomUUID } from 'node:crypto';
import { MongoClient } from 'mongodb';
import { seedProducts } from './seedProducts.js';

const DEFAULT_MONGODB_URI = 'mongodb://127.0.0.1:27017';
const DEFAULT_DATABASE_NAME = 'passo_prime';
const FREE_SHIPPING_THRESHOLD = 700;
const STANDARD_SHIPPING = 29.9;
const TAX_RATE = 0.08;

const collectionNames = {
  usuarios: 'usuarios',
  enderecos: 'enderecos',
  suporte: 'suporte',
  pedidos: 'pedidos',
  pagamentos: 'pagamentos',
  produtos: 'produtos',
  categorias: 'categorias',
  produtoCategoria: 'produto_categoria',
  variacoesProduto: 'variacoes_produto',
  itemPedido: 'item_pedido',
  promocoes: 'promocoes',
  produtoPromocao: 'produto_promocao',
  newsletter: 'newsletter',
};

let client;
let database;

export async function connectDatabase() {
  const uri = process.env.MONGODB_URI || DEFAULT_MONGODB_URI;
  const dbName = process.env.MONGODB_DB || DEFAULT_DATABASE_NAME;

  client = new MongoClient(uri, {
    serverSelectionTimeoutMS: Number(process.env.MONGODB_TIMEOUT_MS || 5000),
  });

  await client.connect();
  database = client.db(dbName);
  await database.command({ ping: 1 });
  await createIndexes();
  await seedDatabase();

  return database;
}

export async function closeDatabase() {
  if (client) await client.close();
  client = undefined;
  database = undefined;
}

export function getDatabaseInfo() {
  return {
    provider: 'mongodb',
    name: process.env.MONGODB_DB || DEFAULT_DATABASE_NAME,
    connected: Boolean(database),
    collections: Object.values(collectionNames),
  };
}

export async function listProducts(searchParams) {
  const filters = pickProductFilters(searchParams);
  const query = { ativo: true };

  if (filters.brand) query.marca = filters.brand;
  if (filters.category) query.categoria = normalizeCategory(filters.category);
  if (filters.onlyNew) query['flags.isNew'] = true;
  if (filters.onlyExclusive) query['flags.isExclusive'] = true;
  if (filters.onlySale) query['flags.isOnSale'] = true;
  if (filters.q) {
    const regex = new RegExp(escapeRegex(filters.q), 'i');
    query.$or = [
      { nome: regex },
      { marca: regex },
      { categoria: regex },
      { descricao: regex },
    ];
  }

  const docs = await col('produtos')
    .find(query)
    .sort({ destaque: -1, data_cadastro: -1, nome: 1 })
    .toArray();

  return docs.map(toApiProduct);
}

export async function getProductById(id) {
  const product = await col('produtos').findOne({ id_produto: id, ativo: true });
  return product ? toApiProduct(product) : null;
}

export async function validateOrder(payload) {
  const errors = [];

  if (!payload || typeof payload !== 'object') errors.push('Os dados do pedido são obrigatórios');
  if (!Array.isArray(payload?.items) || payload.items.length === 0) errors.push('O pedido deve incluir pelo menos um item');
  if (!payload?.customer?.name) errors.push('O nome do cliente é obrigatório');
  if (!payload?.customer?.email) errors.push('O e-mail do cliente é obrigatório');
  if (!payload?.address?.street || !payload?.address?.city) errors.push('Rua e cidade são obrigatórias');

  const items = Array.isArray(payload?.items) ? payload.items : [];
  const productIds = [...new Set(items.map(item => item.productId).filter(Boolean))];
  const products = productIds.length > 0
    ? await col('produtos').find({ id_produto: { $in: productIds }, ativo: true }).toArray()
    : [];
  const productsById = new Map(products.map(product => [product.id_produto, product]));

  for (const item of items) {
    const product = productsById.get(item.productId);
    if (!product) errors.push(`Produto desconhecido: ${item.productId}`);
    if (!Number.isInteger(item.quantity) || item.quantity < 1) errors.push('A quantidade deve ser um número inteiro positivo');
    if (!item.size) errors.push('O tamanho do item é obrigatório');
    if (!item.color) errors.push('A cor do item é obrigatória');
    if (product && Number.isInteger(item.quantity) && item.quantity > product.estoque_total) {
      errors.push(`Estoque insuficiente para ${product.nome}`);
    }
  }

  return { errors, productsById };
}

export async function createOrder(payload, productsById) {
  const now = new Date();
  const user = await ensureUser(payload.customer);
  const address = await createAddress(payload.address, user.id_usuario, true);
  const enrichedItems = [];

  for (const item of payload.items) {
    const product = productsById.get(item.productId);
    const variation = await ensureVariation(product, item);
    const quantity = item.quantity;
    const unitPrice = product.preco;

    enrichedItems.push({
      id_item: `ITEM-${randomUUID().slice(0, 8).toUpperCase()}`,
      quantity,
      productId: product.id_produto,
      name: product.nome,
      brand: product.marca,
      size: item.size,
      color: item.color,
      unitPrice,
      subtotal: unitPrice * quantity,
      id_variacao: variation.id_variacao,
    });
  }

  const subtotal = enrichedItems.reduce((sum, item) => sum + item.subtotal, 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING;
  const tax = Number((subtotal * TAX_RATE).toFixed(2));
  const total = Number((subtotal + shipping + tax).toFixed(2));
  const orderId = `PP-${randomUUID().slice(0, 8).toUpperCase()}`;
  const paymentMethod = payload.paymentMethod || 'card';

  const orderDoc = {
    id_pedido: orderId,
    status: 'confirmado',
    valor_total: total,
    frete: shipping,
    data_pedido: now,
    data_atualizacao: now,
    id_usuario: user.id_usuario,
    id_endereco_entrega: address.id_endereco,
    id_endereco_cobranca: address.id_endereco,
    customer: payload.customer,
    address: payload.address,
    shippingMethod: payload.shippingMethod || 'standard',
    paymentMethod,
    totals: { subtotal, shipping, tax, total },
  };

  await col('pedidos').insertOne(orderDoc);
  await col('itemPedido').insertMany(enrichedItems.map(item => ({
    id_item: item.id_item,
    quantidade: item.quantity,
    preco_unitario: item.unitPrice,
    subtotal: item.subtotal,
    id_pedido: orderId,
    id_produto: item.productId,
    id_variacao: item.id_variacao,
    name: item.name,
    brand: item.brand,
    size: item.size,
    color: item.color,
  })));

  await col('pagamentos').insertOne({
    id_pagamento: `PAY-${randomUUID().slice(0, 8).toUpperCase()}`,
    metodo: paymentMethod,
    status: 'aprovado',
    transaction_id: `TX-${randomUUID().slice(0, 12).toUpperCase()}`,
    valor_pago: total,
    data_pagamento: now,
    id_pedido: orderId,
  });

  return toApiOrder(orderDoc, enrichedItems);
}

export async function listOrders() {
  const orders = await col('pedidos').find({}).sort({ data_pedido: -1 }).limit(100).toArray();
  const orderIds = orders.map(order => order.id_pedido);
  const items = orderIds.length > 0
    ? await col('itemPedido').find({ id_pedido: { $in: orderIds } }).toArray()
    : [];
  const itemsByOrder = groupBy(items, item => item.id_pedido);

  return orders.map(order => toApiOrder(order, itemsByOrder.get(order.id_pedido) || []));
}

export async function subscribeNewsletter(email) {
  const now = new Date();

  await col('newsletter').updateOne(
    { email },
    {
      $setOnInsert: { id_newsletter: `NEWS-${randomUUID().slice(0, 8).toUpperCase()}`, data_cadastro: now },
      $set: { subscribed: true, data_atualizacao: now },
    },
    { upsert: true },
  );

  const subscriberCount = await col('newsletter').countDocuments({ subscribed: true });
  return { email, subscribed: true, subscriberCount };
}

export async function createSupportTicket(payload) {
  const now = new Date();
  const ticket = {
    id_suporte: `SUP-${randomUUID().slice(0, 8).toUpperCase()}`,
    assunto: String(payload.subject || payload.assunto || '').trim(),
    mensagem: String(payload.message || payload.mensagem || '').trim(),
    status: 'aberto',
    resposta: null,
    data_abertura: now,
    data_atualizacao: now,
    id_usuario: payload.userId || null,
    email: payload.email || null,
    nome: payload.name || null,
  };

  await col('suporte').insertOne(ticket);
  return ticket;
}

async function createIndexes() {
  await Promise.all([
    col('usuarios').createIndex({ email: 1 }, { unique: true }),
    col('enderecos').createIndex({ id_usuario: 1 }),
    col('suporte').createIndex({ id_suporte: 1 }, { unique: true }),
    col('suporte').createIndex({ id_usuario: 1 }),
    col('pedidos').createIndex({ id_pedido: 1 }, { unique: true }),
    col('pedidos').createIndex({ id_usuario: 1, data_pedido: -1 }),
    col('pagamentos').createIndex({ id_pagamento: 1 }, { unique: true }),
    col('pagamentos').createIndex({ id_pedido: 1 }),
    col('produtos').createIndex({ id_produto: 1 }, { unique: true }),
    col('produtos').createIndex({ marca: 1, categoria: 1 }),
    col('produtos').createIndex({ nome: 'text', marca: 'text', categoria: 'text', descricao: 'text' }),
    col('categorias').createIndex({ slug: 1 }, { unique: true }),
    col('produtoCategoria').createIndex({ id_produto: 1, id_categoria: 1 }, { unique: true }),
    col('variacoesProduto').createIndex({ sku: 1 }, { unique: true }),
    col('variacoesProduto').createIndex({ id_produto: 1, tamanho: 1, cor: 1 }, { unique: true }),
    col('itemPedido').createIndex({ id_pedido: 1 }),
    col('itemPedido').createIndex({ id_variacao: 1 }),
    col('promocoes').createIndex({ id_promocao: 1 }, { unique: true }),
    col('produtoPromocao').createIndex({ id_produto: 1, id_promocao: 1 }, { unique: true }),
    col('newsletter').createIndex({ email: 1 }, { unique: true }),
  ]);
}

async function seedDatabase() {
  const now = new Date();
  const categoryNames = [...new Set(seedProducts.map(product => product.category))];
  const categories = categoryNames.map(name => ({
    id_categoria: `CAT-${slugify(name).toUpperCase()}`,
    nome: name,
    slug: slugify(name),
  }));

  await Promise.all(categories.map(category =>
    col('categorias').updateOne(
      { slug: category.slug },
      { $setOnInsert: category },
      { upsert: true },
    ),
  ));

  const categoriesByName = new Map(categories.map(category => [category.nome, category]));

  await Promise.all(seedProducts.map(product => {
    const doc = {
      id_produto: product.id,
      nome: product.name,
      marca: product.brand,
      categoria: product.category,
      descricao: `${product.name} selecionado para a curadoria ${product.brand}, com foco em conforto, acabamento e autenticidade.`,
      preco: product.price,
      imagem_url: product.image,
      estoque_total: product.stock,
      avaliacao_media: product.rating,
      destaque: Boolean(product.isBestSeller || product.isExclusive),
      ativo: true,
      flags: {
        isNew: Boolean(product.isNew),
        isBestSeller: Boolean(product.isBestSeller),
        isExclusive: Boolean(product.isExclusive),
        isOnSale: Boolean(product.isOnSale),
      },
      data_atualizacao: now,
    };

    return col('produtos').updateOne(
      { id_produto: product.id },
      {
        $setOnInsert: { data_cadastro: now },
        $set: doc,
      },
      { upsert: true },
    );
  }));

  await Promise.all(seedProducts.map(product => {
    const category = categoriesByName.get(product.category);
    return col('produtoCategoria').updateOne(
      { id_produto: product.id, id_categoria: category.id_categoria },
      { $setOnInsert: { id_produto: product.id, id_categoria: category.id_categoria } },
      { upsert: true },
    );
  }));

  const sizes = [38, 39, 40, 41, 42, 43, 44, 45, 46];
  await Promise.all(seedProducts.flatMap(product =>
    sizes.map(size => col('variacoesProduto').updateOne(
      { id_produto: product.id, tamanho: size, cor: 'Padrão' },
      {
        $setOnInsert: {
          id_variacao: `VAR-${product.id.toUpperCase()}-${size}-PADRAO`,
          id_produto: product.id,
          tamanho: size,
          cor: 'Padrão',
          estoque: Math.max(1, Math.floor(product.stock / sizes.length)),
          sku: `${product.id}-${size}-PADRAO`.toUpperCase(),
        },
      },
      { upsert: true },
    )),
  ));

  const saleProducts = seedProducts.filter(product => product.isOnSale);
  if (saleProducts.length > 0) {
    const promotion = {
      id_promocao: 'PROMO-LANCAMENTO',
      titulo: 'Seleção especial',
      descricao: 'Produtos selecionados com condição promocional.',
      desconto_percentual: 12,
      data_inicio: now,
      data_fim: null,
      ativo: true,
    };

    await col('promocoes').updateOne(
      { id_promocao: promotion.id_promocao },
      { $setOnInsert: promotion },
      { upsert: true },
    );

    await Promise.all(saleProducts.map(product =>
      col('produtoPromocao').updateOne(
        { id_produto: product.id, id_promocao: promotion.id_promocao },
        { $setOnInsert: { id_produto: product.id, id_promocao: promotion.id_promocao } },
        { upsert: true },
      ),
    ));
  }
}

async function ensureUser(customer) {
  const now = new Date();
  const email = String(customer.email).trim().toLowerCase();
  const existing = await col('usuarios').findOne({ email });

  if (existing) {
    await col('usuarios').updateOne(
      { email },
      { $set: { nome: customer.name, data_atualizacao: now } },
    );
    return { ...existing, nome: customer.name };
  }

  const user = {
    id_usuario: `USR-${randomUUID().slice(0, 8).toUpperCase()}`,
    nome: customer.name,
    email,
    senha_hash: null,
    telefone: null,
    token_recuperacao: null,
    token_expira_em: null,
    data_criacao: now,
    data_atualizacao: now,
  };

  await col('usuarios').insertOne(user);
  return user;
}

async function createAddress(address, userId, principal) {
  const now = new Date();
  const doc = {
    id_endereco: `ADDR-${randomUUID().slice(0, 8).toUpperCase()}`,
    cep: address.zip || '',
    rua: address.street || '',
    numero: address.number || '',
    complemento: address.complement || '',
    bairro: address.neighborhood || '',
    cidade: address.city || '',
    estado: address.state || '',
    pais: address.country || 'BR',
    principal,
    id_usuario: userId,
    data_criacao: now,
    data_atualizacao: now,
  };

  await col('enderecos').insertOne(doc);
  return doc;
}

async function ensureVariation(product, item) {
  const color = String(item.color);
  const size = Number(item.size);
  const existing = await col('variacoesProduto').findOne({
    id_produto: product.id_produto,
    tamanho: size,
    cor: color,
  });

  if (existing) return existing;

  const variation = {
    id_variacao: `VAR-${randomUUID().slice(0, 8).toUpperCase()}`,
    id_produto: product.id_produto,
    tamanho: size,
    cor: color,
    estoque: product.estoque_total,
    sku: `${product.id_produto}-${size}-${slugify(color)}`.toUpperCase(),
  };

  await col('variacoesProduto').insertOne(variation);
  return variation;
}

function toApiProduct(product) {
  return {
    id: product.id_produto,
    name: product.nome,
    brand: product.marca,
    category: product.categoria,
    price: product.preco,
    image: product.imagem_url,
    stock: product.estoque_total,
    rating: product.avaliacao_media,
    isNew: Boolean(product.flags?.isNew),
    isBestSeller: Boolean(product.flags?.isBestSeller),
    isExclusive: Boolean(product.flags?.isExclusive),
    isOnSale: Boolean(product.flags?.isOnSale),
  };
}

function toApiOrder(order, items) {
  return {
    id: order.id_pedido,
    status: order.status,
    createdAt: order.data_pedido instanceof Date ? order.data_pedido.toISOString() : order.data_pedido,
    customer: order.customer,
    address: order.address,
    shippingMethod: order.shippingMethod,
    paymentMethod: order.paymentMethod,
    items: items.map(item => ({
      productId: item.productId || item.id_produto,
      name: item.name,
      brand: item.brand,
      size: item.size,
      color: item.color,
      quantity: item.quantity || item.quantidade,
      unitPrice: item.unitPrice || item.preco_unitario,
      subtotal: item.subtotal,
    })),
    totals: order.totals || {
      subtotal: Number((order.valor_total - order.frete).toFixed(2)),
      shipping: order.frete,
      tax: 0,
      total: order.valor_total,
    },
  };
}

function pickProductFilters(searchParams) {
  return {
    brand: searchParams.get('brand'),
    category: searchParams.get('category'),
    q: searchParams.get('q')?.trim(),
    onlyNew: searchParams.get('isNew') === 'true',
    onlyExclusive: searchParams.get('isExclusive') === 'true',
    onlySale: searchParams.get('isOnSale') === 'true',
  };
}

function normalizeCategory(category) {
  const aliases = {
    Lifestyle: 'Casual',
    Running: 'Corrida',
    Basketball: 'Basquete',
    Training: 'Treino',
  };

  return aliases[category] || category;
}

function groupBy(items, getKey) {
  const grouped = new Map();
  for (const item of items) {
    const key = getKey(item);
    const list = grouped.get(key) || [];
    list.push(item);
    grouped.set(key, list);
  }
  return grouped;
}

function col(key) {
  if (!database) throw new Error('MongoDB não conectado');
  return database.collection(collectionNames[key]);
}

function slugify(value) {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
