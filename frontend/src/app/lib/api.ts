import type { CartItem } from '../store/AppContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data?.error?.message || 'A requisição falhou';
    const details = Array.isArray(data?.error?.details) ? data.error.details : [];
    const detailText = details.length > 0 ? `: ${details.join('; ')}` : '';
    throw new Error(`${message}${detailText}`);
  }

  return data as T;
}

export interface ApiHealth {
  status: 'ok';
  service: string;
  uptime: number;
  timestamp: string;
}

export interface CreateOrderPayload {
  customer: {
    name: string;
    email: string;
  };
  address: {
    name: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  shippingMethod: string;
  paymentMethod: string;
  items: Array<{
    productId: string;
    size: number;
    color: string;
    quantity: number;
  }>;
}

export interface CreatedOrder {
  id: string;
  status: string;
  createdAt?: string;
  customer?: {
    name: string;
    email: string;
  };
  shippingMethod?: string;
  paymentMethod?: string;
  items?: Array<{
    productId: string;
    name: string;
    brand: string;
    size: number;
    color: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }>;
  totals: {
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
  };
}

export const api = {
  health: () => request<ApiHealth>('/health'),
  subscribeNewsletter: (email: string) =>
    request<{ subscribed: boolean; email: string; subscriberCount: number }>('/newsletter', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
  createOrder: (payload: CreateOrderPayload) =>
    request<{ order: CreatedOrder }>('/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  listOrders: () => request<{ count: number; orders: CreatedOrder[] }>('/orders'),
};

export function cartItemsToOrderItems(items: CartItem[]) {
  return items.map(item => ({
    productId: item.product.id,
    size: item.size,
    color: item.color,
    quantity: item.quantity,
  }));
}
